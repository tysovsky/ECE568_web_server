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

router.post('/predict/:ticker', function(req, res, next) {


    var ticker = req.params.ticker;
    var num_days = req.body.days;

    console.log(path.resolve(__dirname));

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

module.exports = router;
