var express = require('express');
var router = express.Router();
var db = require('../database.js');

const tickerToName = {
  'GOOG': 'Google',
  'TWTR': 'Twitter',
  'UBER': 'Uber',
  'SNAP': 'Snap',
  'PINS': 'Pinterest',
  'MSFT': 'Microsoft',
  'COF': 'Capital One',
  'TM': 'Toyota Motors',
  'GM': 'General Motors',
  'WMT': 'Wallmart'
}

/* GET home page. */
router.get('/', function (req, res, next) {

  //I'm sorry this is due in an hour and I just need it to work

  db.getAllStats()
    .then(stock_data => {
      res.render('index', { data: [], stats: stock_data })
    })
    .catch(err => res.render('error'))

});

router.get('/query/:ticker', function (req, res, next) {
  ticker = req.params.ticker

  db.getAllStats()
    .then(stock_data => {
      var companies = []
      var current_lowest = stock_data[ticker].lowest;

      for (var key in stock_data) {
        if (key === ticker)
          continue;

        if (current_lowest > stock_data[key].average)
          companies.push({ 'ticker': key, 'name': tickerToName[key], 'average': stock_data[key].average })
      }

      res.render('query', { 'company_data': {'ticker': ticker, 'name': tickerToName[ticker], 'lowest': current_lowest}, 'companies': companies })

    })
    .catch(err => res.render('error'))
});

module.exports = router;
