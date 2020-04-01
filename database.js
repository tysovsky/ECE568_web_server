var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    ISODate = require('mongodb').ISODate;

const dbURL = "mongodb://localhost:27017";
const dbName = 'stock_db'
const historicalStockCollection = 'stocks_historical';

exports.getDataForAllTickers =  function(){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            db.collection(historicalStockCollection)
                .find()
                .toArray()
                .then((stock_data) => resolve(stock_data))
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}

exports.getDataForTicker = function(ticker){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            db.collection(historicalStockCollection)
                .find({"symbol":ticker})
                .toArray()
                .then((stocks) => resolve(stocks))
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}