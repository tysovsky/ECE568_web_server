var express = require('express');
var router = express.Router();
var db = require('../database.js');

//Return all data stored in the database
router.get('/stock', function(req, res, next) {
    db.getDataForAllTickers(function(data){
        res.json(data)
    })
});

//Return all data for the particular ticker
router.get('/stock/:ticker', function(req, res, next) {
    ticker = req.params.ticker

    db.getDataForTicker(ticker, function(data){
        res.json(data)
    })
    
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

module.exports = router;
