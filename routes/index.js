var express = require('express');
var router = express.Router();
var db = require('../database.js');

/* GET home page. */
router.get('/', function(req, res, next) {


  stock_data = {}

  //I'm sorry this is due in an hour and I just need it to work

  db.getStats('GOOG').then(function(s){

    stock_data['GOOG'] = s;

    db.getStats('TWTR')
    .then(function(s){
      stock_data['TWTR'] = s;

      db.getStats('UBER')
      .then(function(s){
        stock_data['UBER'] = s;

        db.getStats('SNAP')
        .then(function(s){
          stock_data['SNAP'] = s;

          db.getStats('PINS')
          .then(function(s){
            stock_data['PINS'] = s;

            db.getStats('MSFT')
            .then(function(s){
              stock_data['MSFT'] = s;

              db.getStats('COF')
              .then(function(s){
                stock_data['COF'] = s;

                db.getStats('WMT')
                .then(function(s){
                  stock_data['WMT'] = s;

                  db.getStats('GM')
                  .then(function(s){
                    stock_data['GM'] = s;

                    db.getStats('TM')
                    .then(function(s){
                      stock_data['TM'] = s;

                      res.render('index', {data: [], stats: stock_data})

                    })
                    .catch((err) => res.render('error'))

                  })
                  .catch((err) => res.render('error'))

                })
                .catch((err) => res.render('error'))

              })
              .catch((err) => res.render('error'))

            })
            .catch((err) => res.render('error'))

          })
          .catch((err) => res.render('error'))

        })
        .catch((err) => res.render('error'))

      })
      .catch((err) => res.render('error'))

    })
    .catch((err) => res.render('error'))
  })
  .catch((err) => res.render('error'))
  
});

module.exports = router;
