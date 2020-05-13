import yfinance as yf
import pymongo
from pymongo.errors import DuplicateKeyError
import requests
from time import sleep
import os


'''
For this to work you need to create a file name 'alpha_vintage.key' in the same directory as this script 
containing the API key for Alpha Vintage
'''


def get_av_api_key():
    script_path = os.path.dirname(os.path.realpath(__file__))
    with open(script_path + '/alpha_vantage.key', 'r') as f:
        return f.readline()

class AlphaVantage:
    def __init__(self, key):
        self.key =  key

    def get_ticker(self, ticker):
        result = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={ticker}&interval=1min&apikey={self.key}').json()
        return result['Time Series (1min)']


db_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = db_client["stock_db"]
stock_historical_collection = db['stocks_historical']
stock_realtime_collection = db['stocks_real_time']


#Google, Snap, Uber, Twitter, Pinterest, Microsoft, Capital One, Wallmart, Toyota, General Motors
tickers = ['GOOG', 'SNAP', 'UBER', 'TWTR', 'PINS', 'MSFT', 'COF', 'WMT', 'TM', 'GM']


seconds_slept = 0

av_api = AlphaVantage(get_av_api_key())

#when the script is first run, empty all tables and get historical data
stock_historical_collection.drop()
stock_realtime_collection.drop()

stock_historical_collection.create_index(
    [("date", pymongo.ASCENDING), ("symbol", pymongo.ASCENDING)],
    unique=True)

stock_realtime_collection.create_index(
    [("date", pymongo.ASCENDING), ("symbol", pymongo.ASCENDING)],
    unique=True)


print('Getting historical data')

for ticker in tickers:
    tick = yf.Ticker(ticker)

    hist = tick.history(period="max")
    hist.reset_index(inplace=True,drop=False)

    for i in range(len(hist)):
        d = {'symbol': ticker, 
                'close': float(hist['Close'][i]), 
                'high': float(hist['High'][i]), 
                'low': float(hist['Low'][i]), 
                'open': float(hist['Open'][i]), 
                'volume': float(hist['Volume'][i]), 
                'date': str(hist['Date'][i])[:10]}
        try:
            stock_historical_collection.insert_one(d)
        except DuplicateKeyError:
            pass

print('Finished getting historical data')

while True:
    for ticker in tickers:

        print(f'Getting data for {ticker}')

        data = av_api.get_ticker(ticker)

        for key in data:
            d = {'date': key,
                 "symbol":ticker,
                 'open': float(data[key]['1. open']),
                 'high': float(data[key]['2. high']),
                 'low': float(data[key]['3. low']),
                 'close': float(data[key]['4. close']),
                 "volume": int(data[key]['5. volume'])
                 }
            try:
                stock_realtime_collection.insert_one(d)
            except DuplicateKeyError:
                pass
        
        #this is necesary because we're limited to 5 requests per minute with the free key, so lets way 15 seconds between requests
        seconds_slept += 15
        sleep(15)
        
    seconds_slept += 60
    sleep(60)

    #if slept for longer than a day, get historical data for the last day
    if (seconds_slept > 60*60*24):
        seconds_slept = 0
        
        tick = yf.Ticker(ticker)

        hist = tick.history(period="1d")
        hist.reset_index(inplace=True,drop=False)

        for i in range(len(hist)):
            d = {'symbol': ticker, 
                    'close': float(hist['Close'][i]), 
                    'high': float(hist['High'][i]), 
                    'low': float(hist['Low'][i]), 
                    'open': float(hist['Open'][i]), 
                    'volume': float(hist['Volume'][i]), 
                    'date': str(hist['Date'][i])[:10]}
            try:
                stock_historical_collection.insert_one(d)
            except DuplicateKeyError:
                pass

