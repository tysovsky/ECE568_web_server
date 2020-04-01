(function($) {
    var data_json = JSON.parse(data);

    var stock_data = {
        "GOOGL.MI": {"date": [], "price": []},
        "SNAP": {"date": [], "price": []},
        "UBER": {"date": [], "price": []},
        "TWTR": {"date": [], "price": []},
        "PINS": {"date": [], "price": []},
        "MSFT.MI": {"date": [], "price": []},
        "COF": {"date": [], "price": []},
        "WMT": {"date": [], "price": []},
        "TM": {"date": [], "price": []},
        "GM": {"date": [], "price": []}

    }

    for (var i = 0; i < data_json.length; i++){
        stock_data[data_json[i]["symbol"]].price.push(data_json[i]["close"])
        stock_data[data_json[i]["symbol"]].date.push(data_json[i]["date"])
    }


    var google_data = {
        labels: stock_data["GOOGL.MI"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["GOOGL.MI"].price,
            borderColor: "#4285f4",
            backgroundColor: '#FBBC05A0',
            pointRadius: 0
        }]
    }

    var twitter_data = {
        labels: stock_data["TWTR"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["TWTR"].price,
            borderColor: "#29487D",
            backgroundColor: '#FEFEFEA0',
            pointRadius: 0
        }]
}

    var uber_data = {
            labels: stock_data["UBER"].date,
            datasets: [{
                label: 'Stock price ($)',
                data: stock_data["UBER"].price,
                borderColor: "#161626",
                backgroundColor: '#C0C0C8A0',
                pointRadius: 0
            }]
    }

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
        responsive: true
    }

    var google_chart = $("#google_chart")
    var twitter_chart = $("#twitter_chart")
    var uber_chart = $("#uber_chart")
    

    var btns = [
        $("#btn_google"),
        $("#btn_twitter"),
        $("#btn_uber")
    ]

    for(var i = 0; i < btns.length; i++){
        btns[i].click(function(event){

            btns.forEach(btn => btn.removeClass('active'))

            $(this).addClass('active')

            switch($(this).attr('id')){
                case 'btn_google':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#google").show()
                    $("#google").addClass('currently_shown')

                    

                    new Chart(google_chart, {
                        type: 'line',
                        data: google_data,
                        options: chart_options
                    })

                    break

                case 'btn_twitter':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#twitter").show()
                    $("#twitter").addClass('currently_shown')

                    

                    new Chart(twitter_chart, {
                        type: 'line',
                        data: twitter_data,
                        options: chart_options
                    })
                    break

                case 'btn_uber':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#uber").show()
                    $("#uber").addClass('currently_shown')

                    

                    new Chart(uber_chart, {
                        type: 'line',
                        data: uber_data,
                        options: chart_options
                    })
                    break
            }

        });
    }


    new Chart(google_chart, {
        type: 'line',
        data: google_data,
        options: chart_options
    })

})(jQuery);