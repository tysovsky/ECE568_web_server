var express = require('express');
var router = express.Router();
var db = require('../database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.getDataForAllTickers(function(data){
    res.render('index', {data: data});
  })  
});

module.exports = router;
