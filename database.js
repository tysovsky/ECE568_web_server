exports.getDataForAllTickers = function(callback){
    data =  [
        {'ticker':'google', 
         'data': [12, 19, 3, 5, 2, 3],
         'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
        },
        {'ticker':'facebook', 
         'data': [10, 12, 9, 16, 20, 15],
         'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
        },
        {'ticker':'uber', 
         'data': [10, 7, 15, 16, 17, 15],
         'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
        }
    ]

    callback(data)
}

exports.getDataForTicker = function(ticker, callback){
    data = {}

    if(ticker == 'google'){
        data = {
            'ticker':'google',  
            'data': [12, 19, 3, 5, 2, 3],
            'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
       }
    }

    else if (ticker == 'facebook'){
        data = {
            'ticker':'facebook', 
            'data': [10, 12, 9, 16, 20, 15],
            'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
       }
    }

    else if (ticker == 'uber'){
        data = {
            'ticker':'uber', 
            'data': [10, 7, 15, 16, 17, 15],
            'labels': ['2015', '2016', '2017', '2018', '2019', '2020']
       }
    }

    callback(data)
}