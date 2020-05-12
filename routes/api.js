var express = require('express');
var router = express.Router();
var db = require('../database.js');
var path = require('path');
var spawn = require("child_process").spawn; 

//Return all data stored in the database
router.get('/stock', function(req, res, next) {

    db.getDataForAllTickers()
        .then(data => res.json(data))
        .catch(err => res.json({error: err}))

});

//Return all data for the particular ticker
router.get('/stock/:ticker', function(req, res, next) {
    ticker = req.params.ticker

    db.getDataForTicker(ticker)
        .then(data => res.json(data))
        .catch(err => res.json({error: err}))
    
});

router.get('/stock/:ticker/realtime', function(req, res, next) {
    ticker = req.params.ticker

    db.getRealTimeDataForTicker(ticker)
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({error: err});
        })
    
});

router.post('/stock/:ticker', function(req, res, next) {
    var ticker = req.params.ticker;
    var from = req.body.from;
    var to = req.body.to;
    

    db.getDataForTicker(ticker, from, to)
        .then(data => {

            res.json(data);
        })
        .catch(err => res.json({error: err}))
    
});

router.post('/stock/:ticker/sma', function(req, res, next) {
    var ticker = req.params.ticker;
    var from = req.body.from;
    var to = req.body.to;
    var days = req.body.days;

    db.getSimpleMovingAverages(ticker, days, from, to)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json({error: err}))
    
});

router.post('/stock/:ticker/cci', function(req, res, next) {
    var ticker = req.params.ticker;
    var from = req.body.from;
    var to = req.body.to;
    var days = req.body.days;

    db.getCommodityChannelIndex(ticker, days, from, to)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json({error: err}))
    
});



//Return all data for the particular ticker and particular date
router.get('/stock/:ticker/:date', function(req, res, next) {
    ticker = req.params.ticker
    date = req.params.date

    //This should be pulled form the database
    example_json = {
        'ticker' : ticker,
        'data': [
            {'date': date,
            'close': '1000'}
        ]
    }

    res.json(example_json)
});

router.get('/stats/:ticker', function(req, res, next) {
    ticker = req.params.ticker

    db.getStats(ticker)
    .then((stats) => res.json(stats))
    .catch((err) => res.json(err))

});

router.post('/predict/:ticker', function(req, res, next) {


    var ticker = req.params.ticker;
    var num_days = req.body.days;


    var child = spawn('python3', 
        [path.resolve(__dirname) + "/../scripts/predict.py", 
        "--ticker", ticker, 
        "--days", num_days]
    );

    child.stdout.on('data', function(data) {
        var arr = data.toString().split('\n');

        if(arr[0] == 'ERROR'){
            res.json({status: "error", message: arr[1]});
        }
        else{
            res.json({status: "success", predictions: arr.slice(1, arr.length-1)});
        }
    });

});

router.post('/stock/:ticker/all', function(req, res, next) {
    var ticker = req.params.ticker;
    var from = req.body.from;
    var to = req.body.to;
    var indicator_range = req.body.range;
    var num_days = req.body.days;

    var response = {stock: null, predictions: null, indicators: {sma: null, cci: null, mfi: null}}

    db.getDataForTicker(ticker, from, to)
        .then(data => {
            response.stock = data;

            db.getCommodityChannelIndex(ticker, indicator_range, from, to)
            .then(data => {

                response.indicators.cci = data;

                db.getSimpleMovingAverages(ticker, indicator_range, from, to)
                .then(data => {
                    response.indicators.sma = data;

                    db.getMoneyFlowIndex(ticker, indicator_range, from, to)
                    .then(data => {
                        response.indicators.mfi = data;

                        var child = spawn('python3', 
                        [path.resolve(__dirname) + "/../scripts/predict.py", 
                        "--ticker", ticker, 
                        "--days", num_days]
                        );
                    
                        child.stdout.on('data', function(data) {
                            var arr = data.toString().split('\n');
                    
                            if(arr[0] == 'ERROR'){
                                res.json({status: "error", message: arr[1]});
                            }
                            else{
                                response.predictions = arr.slice(1, arr.length-1);
                                res.json(response);
                            }
                        });
                    })
                    .catch(err => res.json({error: err}));

                })
                .catch(err => res.json({error: err}))

                
            })
            .catch(err => res.json({error: err}))

            
        })
        .catch(err => res.json({error: err}))

    
});

module.exports = router;
