import yfinance as yf
import pymongo

db_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = db_client["stock_db"]
stock_historical_collection = db['stocks_historical']


#Google, Snap, Uber, Twitter, Pinterest, Microsoft, Capital One, Wallmart, Toyota, General Motors
tickers = ['GOOG', 'SNAP', 'UBER', 'TWTR', 'PINS', 'MSFT', 'COF', 'WMT', 'TM', 'GM']

for ticker in tickers:
    tick = yf.Ticker(ticker)

    hist = tick.history(period="max")
    hist.reset_index(inplace=True,drop=False)

    for i in range(len(hist)):
        d = {'symbol': ticker, 'close': hist['Close'][i], 'date': str(hist['Date'][i])[:10]}
        stock_historical_collection.insert_one(d)