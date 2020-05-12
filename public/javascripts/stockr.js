(function($) {

    function onChartLegendClicked(e, legendItem){
        var index = legendItem.datasetIndex;
        
        switch(index){
            case 0:
                stock_hidden = !stock_hidden;
                break;
            case 1:
                prediction_hidden = !prediction_hidden;
                break;
            case 2:
                sma_hidden = !sma_hidden;
                break;
            case 3:
                cci_hidden = !cci_hidden;
                break;
            case 4:
                mfi_hidden = !mfi_hidden;
                break;
        }

        Chart.defaults.global.legend.onClick.call(this, e, legendItem);
    }

    var stock_data = {
        "GOOG": {
            chart: $("#google_chart")
        },
        "SNAP": {
            chart: $("#snap_chart")
        },
        "UBER": {
            chart: $("#uber_chart")
        },
        "TWTR": {
            chart: $("#twitter_chart")
        },
        "PINS": {
            chart: $("#pinterest_chart")
        },
        "MSFT": {
            chart: $("#microsoft_chart")
        },
        "COF": {
            chart: $("#capitalone_chart")
        },
        "WMT": {
            chart: $("#wallmart_chart")
        },
        "TM": {
            chart: $("#toyota_chart")
        },
        "GM": {
            chart: $("#google_chart")
        }

    }  

    var btns = [
        $("#btn_google"),
        $("#btn_twitter"),
        $("#btn_uber"),
        $("#btn_snap"),
        $("#btn_pinterest"),
        $("#btn_microsoft"),
        $("#btn_capitalone"),
        $("#btn_wallmart"),
        $("#btn_toyota")
    ]

    var range_btns = [
        $("#btn_range_real_time"),
        $("#btn_range_one_week"),
        $("#btn_range_six_months"),
        $("#btn_range_one_year"),
        $("#btn_range_five_years"),
        $("#btn_range_all"),
    ]

    var btn_ticker_map = {
        "btn_google": "GOOG",
        "btn_twitter": "TWTR",
        "btn_uber": "UBER",
        "btn_snap": "SNAP",
        "btn_pinterest": "PINS",
        "btn_microsoft": "MSFT",
        "btn_capitalone": "COF",
        "btn_wallmart": "WMT",
        "btn_toyota": "TM"
    }

    var ticker_panel_map = {
        "GOOG": $('#google'),
        "TWTR": $('#twitter'),
        "UBER": $('#uber'),
        "SNAP": $('#snap'),
        "PINS": $('#pinterest'),
        "MSFT": $('#microsoft'),
        "COF": $('#capitalone'),
        "WMT": $('#wallmart'),
        "TM": $('#toyota')
    }

    var activeTicker = 'GOOG'
    var stock_hidden = false;
    var prediction_hidden = false;
    var sma_hidden = true;
    var cci_hidden = true;
    var mfi_hidden = true;

    var activeRange = 'six_months'
    var chart_options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    id: 'A',
                    display: true,
                    position: 'left',
                    ticks: {
                        suggestedMin: 0
                    }
                 },
                 {
                    id: 'B',
                    display: true,
                    position: 'right',
                    ticks: {
                        suggestedMin: -250,
                        suggestedMax: 250
                    }
                }  
            ],
            xAxes: [{
                ticks: {
                    callback: function(tick, index, array) {
                        return (!(index % 3) || index == array.length - 1)? tick : "";
                    }
                }
            }]
        },
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        animation:{
            easing: "easeOutQuart"
        },
        legend: {
            onClick: onChartLegendClicked
        }
    }

    var getAll = function(ticker, from, to, prediction_days, indicator_range){

        if(activeRange == 'real_time'){
            $.get("/api/stock/" + ticker + "/realtime", function(data, status){

                var labels = [];
                var realtime_data = [];
    
                for(var i = 0; i < data.length; i++){
                    realtime_data.push(data[i]["close"])
                    labels.push(data[i]["date"])
                }

                showChart(ticker,
                    {
                        'labels': labels,
                        'datasets': [
                            {
                                label: 'Stock price ($)',
                                'data': realtime_data,
                                borderColor: "#424242",
                                fill: false,
                                yAxisID: 'A',
                                pointRadius: 0
                            }
                        ]
                    });

            });
        }
        else{

            $.post("/api/stock/" + ticker + '/all', {"from": from, "to": to, "days": prediction_days, "range": indicator_range}, function(data, status){

                var historical_data = [];
                var predicted_data = []
                var sma_data = []
                var cci_data = []
                var mfi_data = []
                var labels = []


                //Stock

                for(var i = 0; i < data.stock.length; i++){
                    historical_data.push(data.stock[i]["close"])
                    labels.push(data.stock[i]["date"])
                }

                
                //Predicted
                for(var i = 0; i < historical_data.length-1; i++){
                    predicted_data.push(NaN);
                }

                predicted_data.push(historical_data[historical_data.length - 1])

                last_date = new Date(labels[labels.length-1])

                for(var i = 0; i < data.predictions.length; i++){
                    predicted_data.push(data.predictions[i])
                    historical_data.push(NaN)

                    last_date.setDate(last_date.getDate() + 1);
                    labels.push(last_date.toISOString().substring(0, 10))
                }

                //SMA
                if(data.indicators.sma.length < data.stock.length){
                    for(var i = 0; i < data.stock.length - data.indicators.sma.length; i++)
                        sma_data.push(NaN);
                }

                for(var i = 0; i < data.indicators.sma.length; i++){
                    sma_data.push(data.indicators.sma[i]);
                }

                //CCI
                if(data.indicators.cci.length < data.stock.length){
                    for(var i = 0; i < data.stock.length - data.indicators.cci.length; i++)
                        cci_data.push(NaN);
                }
                for(var i = 0; i < data.indicators.cci.length; i++){
                    cci_data.push(data.indicators.cci[i]);
                }

                //MFI
                if(data.indicators.mfi.length < data.stock.length){
                    for(var i = 0; i < data.stock.length - data.indicators.mfi.length; i++)
                        mfi_data.push(NaN);
                }

                for(var i = 0; i < data.indicators.mfi.length; i++){
                    mfi_data.push(data.indicators.mfi[i]);
                }

                showChart(ticker,
                    {
                        'labels': labels,
                        'datasets': [
                            {
                                label: 'Stock price ($)',
                                data: historical_data,
                                borderColor: "#424242",
                                fill: false,
                                hidden: stock_hidden,
                                yAxisID: 'A',
                                pointRadius: 0
                            },
                            {
                                label: 'Predicted Stock price ($)',
                                data: predicted_data,
                                borderColor: "#E60023",
                                fill: false,
                                hidden: prediction_hidden,
                                yAxisID: 'A',
                                pointRadius: 0
                            },
                            {
                                label: 'Simple Running Average ($)',
                                data: sma_data,
                                borderColor: "#2e7d32",
                                fill: false,
                                pointRadius: 0,
                                yAxisID: 'A',
                                hidden: sma_hidden
                            },
                            {
                                label: 'Commodity Channel Index',
                                data: cci_data,
                                borderColor: "#1565c0",
                                fill: false,
                                pointRadius: 0,
                                yAxisID: 'B',
                                hidden: cci_hidden
                            },
                            {
                                label: 'Money Flow Index',
                                data: mfi_data,
                                borderColor: "#ff8f00",
                                fill: false,
                                pointRadius: 0,
                                yAxisID: 'B',
                                hidden: mfi_hidden
                            },
                            

                        ]
                    });

            });
        }
    }

    var showChart = function(ticker, data){
        if(ticker != activeTicker){
            $(".currently_shown").hide()
            $(".currently_shown").removeClass('currently_shown')

            ticker_panel_map[ticker].show()
            ticker_panel_map[ticker].addClass('currently_shown')
        }

        if (stock_data[ticker].chart_obj)
            stock_data[ticker].chart_obj.destroy()
        
        stock_data[ticker].chart_obj = new Chart(stock_data[ticker].chart, {
            'type': 'line',
            'data': data,
            'options': chart_options
        })
        
        activeTicker = ticker;
    }

    var getFrom = function(type){
        var from = new Date()
        switch(type){
            
            case 'one_day':
                from.setDate(from.getDate() - 1)
                from = from.toISOString().substring(0, 10);
                return from
            case 'one_week':
                from.setDate(from.getDate() - 7)
                from = from.toISOString().substring(0, 10);
                return from
            case 'six_months':
                from.setMonth(from.getMonth() - 6)
                from = from.toISOString().substring(0, 10);
                return from;
            case 'one_year':
                from.setFullYear(from.getFullYear() - 1)
                from = from.toISOString().substring(0, 10);
                return from;
            case 'five_years':
                from.setFullYear(from.getFullYear() - 5)
                from = from.toISOString().substring(0, 10);
                return from;
            case 'all':
                return null
        }
    }


    for(var i = 0; i < btns.length; i++){
        btns[i].click(function(event){

            btns.forEach(btn => btn.removeClass('active'))

            $(this).addClass('active')
            
            var ticker = btn_ticker_map[$(this).attr('id')];
            
            if(activeRange != null){
                to = new Date().toISOString().substring(0, 10);
                from = getFrom(activeRange);
            }


            getAll(ticker, from, to, 5, 10);
        
        });
    }


    for(var i = 0; i < range_btns.length; i++){
        range_btns[i].click(function(event){

            range_btns.forEach(btn => btn.parent().removeClass('style3'))
            $(this).parent().addClass('style3')

            var to = new Date().toISOString().substring(0, 10);
            var from = null;

            switch($(this).attr('id')){
                case 'btn_range_real_time':
                    activeRange = 'real_time'
                    from = null;
                    to = null;
                    break;

                case 'btn_range_one_week':
                    activeRange = 'one_week'       
                    from = getFrom(activeRange)
                    break;
                
                case 'btn_range_six_months':
                    activeRange = 'six_months'  
                    from = getFrom(activeRange)
                    break

                case 'btn_range_one_year':
                    activeRange = 'one_year'  
                    from = getFrom(activeRange)
                    break;

                case 'btn_range_five_years':
                    activeRange = 'five_years'  
                    from = getFrom(activeRange)
                    break;
                default:
                    activeRange = 'all'  
                    from = null;
                    to = null;
            }

            getAll(activeTicker, from, to, 5, 10);

            //getData(activeTicker, from, to);
            //if(activeRange != 'real_time')
                //getPredictionData(activeTicker, 5);
        });
    }


    getAll(activeTicker, getFrom(activeRange), new Date().toISOString().substring(0, 10), 5, 10);

    setInterval(function() {
        if(activeRange == 'real_time'){
            getAll(activeTicker, getFrom(activeRange), new Date().toISOString().substring(0, 10), 5, 10);
        }
    }, 60 * 1000); // 60 * 1000 milsec

})(jQuery);