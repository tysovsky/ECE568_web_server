var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    ISODate = require('mongodb').ISODate;

const dbURL = "mongodb://localhost:27017";
const dbName = 'stock_db'
const historicalStockCollection = 'stocks_historical';
const realTimeStockCollection = 'stocks_real_time';

const SMA = require('technicalindicators').SMA;
const CCI = require('technicalindicators').CCI;
const MFI = require('technicalindicators').MFI;


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


exports.getSimpleMovingAverages = function(ticker, period = 10, from = null, to = null){
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
                .then((stocks) => {

                    period = (period < stocks.length) ? period : stocks.length;

                    var result = SMA.calculate({period : period, values : stocks.map(x => x['close'])});
                    var x = result[0];
                    
                    for(var i = 0; i < period - 1; i++)
                        result.splice(i, 0, x);

                    resolve(result.map(x => parseFloat(x.toFixed(2))));
                })
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}

exports.getCommodityChannelIndex = function(ticker, period = 10, from = null, to = null){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            var find_clause = {'symbol': ticker}
            var date_clause = {}
            
            new_from = null;

            if(from != null && from.length != 0){
                new_from = new Date(from);
                new_from.setDate(new_from.getDate() - 3 * period);
                new_from = new_from.toISOString().substring(0, 10);
            }

            if (from != null && from.length > 0)
                date_clause['$gte'] = from
            if (to != null && to.length > 0)
                date_clause['$lte'] = to
            
            if ((from != null && from.length > 0) || (to != null && to.length > 0))
                find_clause['date'] = date_clause

            db.collection(historicalStockCollection)
                .find(find_clause)
                .count()
                .then((count) => {

                    if(new_from != null)
                        find_clause.date['$gte'] = new_from

                    db.collection(historicalStockCollection)
                    .find(find_clause)
                    .sort({"date": 1})
                    .toArray()
                    .then((stocks) => {

                        period = (period < stocks.length) ? period : stocks.length;

                        var input = {
                            period: parseInt(period),
                            open: stocks.map(x=>x['open']),
                            high: stocks.map(x=>x['high']),
                            low: stocks.map(x=>x['low']),
                            close: stocks.map(x=>x['close']),
                        }

                        var result = CCI.calculate(input).map(x => parseFloat(x.toFixed(2)));
                        
                        if(result.length > count)
                            result = result.slice(result.length - count)

                        resolve(result);
                    })
                    .catch((err) => reject(err))
                    .finally(() => client.close())
                })
                .catch((err) => reject(err))

            
        });
    })
}

exports.getMoneyFlowIndex = function(ticker, period = 10, from = null, to = null){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            new_from = null;

            if(from != null && from.length != 0){
                new_from = new Date(from);
                new_from.setDate(new_from.getDate() - 3 * period);
                new_from = new_from.toISOString().substring(0, 10);
            }

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
                .count()
                .then((count) => {

                    if(new_from != null)
                        find_clause.date['$gte'] = new_from

                    db.collection(historicalStockCollection)
                    .find(find_clause)
                    .sort({"date": 1})
                    .toArray()
                    .then((stocks) => {

                        period = (period < stocks.length) ? period : stocks.length;

                        var input = {
                            period: parseInt(period),
                            open: stocks.map(x=>x['open']),
                            high: stocks.map(x=>x['high']),
                            low: stocks.map(x=>x['low']),
                            close: stocks.map(x=>x['close']),
                            volume: stocks.map(x=>x['volume'])
                        }
    
                        var result = MFI.calculate(input).map(x => parseFloat(x.toFixed(2)));
                        
                        if(result.length > count)
                            result = result.slice(result.length - count)

                        resolve(result);
                    })
                    .catch((err) => reject(err))
                    .finally(() => client.close())
                })
                .catch((err) => reject(err))
        });
    })
}

//Always gets the last two hours of realt time data
exports.getRealTimeDataForTicker = function(ticker){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            db.collection(realTimeStockCollection)
                .find({'symbol': ticker})
                .sort({"date": -1})
                .limit(120)
                .toArray()
                .then((stocks) => {
                    resolve(stocks.reverse())
                })
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}

exports.getStats = function(ticker){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbURL, (err, client) => {
            
            if(err) reject(err)

            var db = client.db(dbName);

            db.collection(historicalStockCollection)
                .find({'symbol': ticker})
                .sort({"date": -1})
                .limit(365)
                .toArray()
                .then(function(stocks){
                    if(stocks.length == 0)
                        reject({error: 'No stocks for ticker'})
                    
                    var ten_day_highest = 0;
                    var yearly_average = 0;
                    var yearly_lowest = 1000000;

                    var n = (stocks.length >= 365) ? 365 : stocks.length;

                    for(var i = 0; i < n; i++){

                        if(isNaN(stocks[i].close))
                            continue;

                        if(i < 10 && stocks[i].close > ten_day_highest)
                            ten_day_highest = stocks[i].close

                        yearly_average += stocks[i].close

                        if(yearly_lowest > stocks[i].close)
                            yearly_lowest = stocks[i].close

                    }

                    resolve({'highest': ten_day_highest, 'average': parseFloat((yearly_average/n).toFixed(2)), 'lowest': yearly_lowest})
                })
                .catch((err) => reject(err))
                .finally(() => client.close())
        });
    })
}