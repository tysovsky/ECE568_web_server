(function($) {
    var stock_data = {
        "GOOG": {
            chart: $("#google_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#4285f4",
                backgroundColor: '#FBBC05A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "SNAP": {
            chart: $("#snap_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#FFFC00",
                backgroundColor: '#000000A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "UBER": {
            chart: $("#uber_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#161626",
                backgroundColor: '#C0C0C8A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "TWTR": {
            chart: $("#twitter_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#1DA1F2",
                backgroundColor: '#FEFEFEA0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "PINS": {
            chart: $("#pinterest_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#E60023",
                backgroundColor: '#FEFEFEA0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "MSFT": {
            chart: $("#microsoft_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#7FBA00",
                backgroundColor: '#F25022A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "COF": {
            chart: $("#capitalone_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#D22E1E",
                backgroundColor: '#004879A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "WMT": {
            chart: $("#wallmart_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#004c91 ",
                backgroundColor: '#78b9e7A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "TM": {
            chart: $("#toyota_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#572d2c ",
                backgroundColor: '#f38698A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
        },
        "GM": {
            chart: $("#google_chart"),
            labels: [],
            datasets: [{
                label: 'Stock price ($)',
                data: [],
                borderColor: "#572d2c ",
                backgroundColor: '#f38698A0',
                pointRadius: 0
            },
            {
                label: 'Predicted Stock Price ($)',
                data: [],
                borderColor: "#FF0000",
                pointRadius: 0
            }]
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
    var activeRange = 'six_months'
    var chart_options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    // OR //
                    beginAtZero: true   // minimum value will be 0.
                }
            }],
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
        }
    }

    var getPredictionData = function(ticker, days){
        $.post("/api/predict/" + ticker, {"days": days}, function(data, status){

            if(data.status == 'success'){
                
                historical_data = stock_data[ticker].datasets[0].data;
                predicted_data = stock_data[ticker].datasets[1].data;

                predicted_data.length = 0
                
                for(var i = 0; i < historical_data.length-1; i++){
                    predicted_data.push(NaN)
                }

                predicted_data.push(historical_data[historical_data.length - 1])

                last_date = new Date(stock_data[ticker].labels[stock_data[ticker].labels.length-1])

                for(var i = 0; i < data.predictions.length; i++){
                    predicted_data.push(data.predictions[i])
                    stock_data[ticker].datasets[0].data.push(NaN)

                    last_date.setDate(last_date.getDate() + 1);

                    stock_data[ticker].labels.push(last_date.toISOString().substring(0, 10))
                }

                showChart(ticker);
            }
            

          });
    }

    var getData = function(ticker, from, to){
        $.post("/api/stock/" + ticker, {"from": from, "to": to}, function(data, status){

            stock_data[ticker].datasets[0].data = []
            stock_data[ticker].labels = []

            for(var i = 0; i < data.length; i++){
                stock_data[ticker].datasets[0].data.push(data[i]["close"])
                stock_data[ticker].labels.push(data[i]["date"])
            }

            //showChart(ticker);

          });
    }

    var showChart = function(ticker){
        if(ticker != activeTicker){
            $(".currently_shown").hide()
            $(".currently_shown").removeClass('currently_shown')

            ticker_panel_map[ticker].show()
            ticker_panel_map[ticker].addClass('currently_shown')
        }

        if (stock_data[ticker].chart_obj)
            stock_data[ticker].chart_obj.destroy()
        
        stock_data[ticker].chart_obj = new Chart(stock_data[ticker].chart, {
            type: 'line',
            data: stock_data[ticker],
            options: chart_options
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
                var to = new Date().toISOString().substring(0, 10);
                var from = getFrom(activeRange);

                getData(ticker, from, to);
            }
            else{
                getData(ticker, from, to);
            }

            getPredictionData(ticker, 5);
        
        });
    }


    for(var i = 0; i < range_btns.length; i++){
        range_btns[i].click(function(event){

            range_btns.forEach(btn => btn.parent().removeClass('style3'))
            $(this).parent().addClass('style3')

            var to = new Date().toISOString().substring(0, 10);
            var from = null;

            switch($(this).attr('id')){
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

            getData(activeTicker, from, to);
            getPredictionData(activeTicker, 5);
        });
    }


    getData(activeTicker, getFrom(activeRange), new Date().toISOString().substring(0, 10), );
    getPredictionData(activeTicker, 5);

})(jQuery);