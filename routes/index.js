var express = require('express');
var router = express.Router();
var db = require('../database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.getDataForAllTickers()
      .then((data) => res.render('index', {data: data}))
      .catch((err) => res.render('index', {data: []  }))
});

module.exports = router;
