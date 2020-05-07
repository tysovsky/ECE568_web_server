import argparse
import pymongo
import numpy as np
import yfinance as yf
import math as mt
from numpy.polynomial.polynomial import Polynomial

parser = argparse.ArgumentParser(description = "Predict stock price")

parser.add_argument('-t', '--ticker', dest='ticker', type=str, default=None,
					help="Ticker for which to predict price (default: %(default)s)")

parser.add_argument('-d', '--days', dest='days', type=int, default=5, 
					help="How many days in the future to predict (default: \'%(default)s\')")

args = parser.parse_args()

ticker = args.ticker
days = args.days

if not ticker:
    print("ERROR")
    print("Ticker is required")
    exit()


def importValues(ticker):

    db_client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = db_client["stock_db"]
    stocks_collection = db['stocks_historical']

    close = []

    for x in stocks_collection.find({"symbol": ticker}).sort("date", pymongo.DESCENDING):
        close.append(float(x['close']))

        if len(close) == 100:
            break
    
    
    close.reverse()

    n = len(close)
    
    #adjust
    trainPercentage= 0.65
    testPercentage = 0.2
    valPercentage = 0.1
    
    trainLowerLimit = 0
    trainHigherLimit = mt.floor(n*trainPercentage)
    
    y_train = close[trainLowerLimit+1:trainHigherLimit+1]
    x_train = close[trainLowerLimit:trainHigherLimit]
    
    m= mt.floor(n*testPercentage)
    h = mt.floor(n*valPercentage)
    x_test= close[trainHigherLimit+2:trainHigherLimit+2+m]
    y_test= close[trainHigherLimit+3:trainHigherLimit+3+m]
    
    valLowerLimit = trainHigherLimit+3+m+1
    valHigherLimit = valLowerLimit+h
    
    x_val= close[valLowerLimit:valHigherLimit]
    y_val = close[valLowerLimit+1:valHigherLimit+1]
    
    return (x_train,y_train, x_test,y_test, x_val, y_val)

def errorfunc(rV, pV):
    return ((rV[:len(pV)] - pV)**2).mean(axis=None)

def findA(x, M):
    A = np.zeros((M, M))
    for i in range (0, M):
        for k in range (0, M):
            A[i][k] = sum([x[j] ** (i+k) for j in range(len(x))])
    return A

def findB(x, y, M):
    b= np.zeros((M,1))
    n = len(y)
    for i in range(M): #rows
        b[i][0] = sum([y[j] * (x[j]**i) for j in range(len(y))])
    return b

def findCoeff(x,y,M):
    a = np.linalg.inv(findA(x, M))
    b = findB(x, y, M)
    result = np.matmul(a, b)
    return result.flatten()

def expectedStockValue(p, x_test, days):

    poly = Polynomial(p)

    results=[poly(num) for num in x_test]

    for i in range(days-1):
        results.append(poly(results[-1]))

    return np.array(results)

def bestM(x_train,y_train,x_val,y_val,n):
    error=[]
    for i in range(2,10):
        p = findCoeff(x_train, y_train, i)
        results = expectedStockValue(p,x_val,n)
        error.append(errorfunc(results, y_val))
    M = error.index(min(error))+2
    return M

def a2(x_train, y_train, x_test, x_val, y_val, n):
    M = bestM(x_train, y_train, x_val, y_val, n)
    p = findCoeff(x_train, y_train,M)
    return expectedStockValue(p, x_test, n)

def polyReg(tickerName,n):
    data = importValues(tickerName)
    
    x_train = np.array(data[0])
    y_train = np.array(data[1])
    x_test = np.array(data[2])
    x_val= np.array(data[4])
    y_val = np.array(data[5])
    
    return a2(x_train,y_train,x_test,x_val,y_val,n)

def predict(ticker, days):
    x = polyReg(ticker, days+1)
    return [x[-i] for i in range(days, 0, -1)]


results = predict(ticker, days)

print('SUCCESS')
for result in results:
    print(f'{result:.2f}')
