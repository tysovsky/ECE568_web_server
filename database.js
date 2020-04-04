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
                .sort({"date": 1})
                .toArray()
                .then((stock_data) => resolve(stock_data))
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}

exports.getDataForTicker = function(ticker, from = null, to = null){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            var find_clause = {'symbol': ticker}
            var date_clause = {}
            
            if (from != null && from.length > 0)
                date_clause['$gte'] = from
            if (to != null && to.length > 0)
                date_clause['$lte'] = to
            
            if ((from != null && from.length > 0) || (to != null && to.length > 0))
                find_clause['date'] = date_clause

            db.collection(historicalStockCollection)
                .find(find_clause)
                .sort({"date": 1})
                .toArray()
                .then((stocks) => resolve(stocks))
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}