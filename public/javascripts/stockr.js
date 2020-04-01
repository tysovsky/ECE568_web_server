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
            borderColor: "#1DA1F2",
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

    var snap_data = {
        labels: stock_data["SNAP"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["SNAP"].price,
            borderColor: "#FFFC00",
            backgroundColor: '#000000A0',
            pointRadius: 0
        }]
    }

    var pinterest_data = {
        labels: stock_data["PINS"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["PINS"].price,
            borderColor: "#E60023",
            backgroundColor: '#FEFEFEA0',
            pointRadius: 0
        }]
    }

    var microsoft_data = {
        labels: stock_data["MSFT.MI"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["MSFT.MI"].price,
            borderColor: "#7FBA00",
            backgroundColor: '#F25022A0',
            pointRadius: 0
        }]
    }

    var capitalone_data = {
        labels: stock_data["COF"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["COF"].price,
            borderColor: "#D22E1E",
            backgroundColor: '#004879A0',
            pointRadius: 0
        }]
    }

    var wallmart_data = {
        labels: stock_data["WMT"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["WMT"].price,
            borderColor: "#004c91 ",
            backgroundColor: '#78b9e7A0',
            pointRadius: 0
        }]
    }

    var toyota_data = {
        labels: stock_data["TM"].date,
        datasets: [{
            label: 'Stock price ($)',
            data: stock_data["TM"].price,
            borderColor: "#572d2c ",
            backgroundColor: '#f38698A0',
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
    var snap_chart = $("#snap_chart")
    var pinterest_chart = $("#pinterest_chart")
    var microsoft_chart = $("#microsoft_chart")
    var capitalone_chart = $("#capitalone_chart")
    var wallmart_chart = $("#wallmart_chart")
    var toyota_chart = $("#toyota_chart")
    

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

                case 'btn_snap':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#snap").show()
                    $("#snap").addClass('currently_shown')

                    

                    new Chart(snap_chart, {
                        type: 'line',
                        data: snap_data,
                        options: chart_options
                    })
                    break

                case 'btn_pinterest':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#pinterest").show()
                    $("#pinterest").addClass('currently_shown')

                    

                    new Chart(pinterest_chart, {
                        type: 'line',
                        data: pinterest_data,
                        options: chart_options
                    })
                    break

                case 'btn_microsoft':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#microsoft").show()
                    $("#microsoft").addClass('currently_shown')

                    

                    new Chart(microsoft_chart, {
                        type: 'line',
                        data: microsoft_data,
                        options: chart_options
                    })
                    break
                
                case 'btn_capitalone':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#capitalone").show()
                    $("#capitalone").addClass('currently_shown')

                    

                    new Chart(capitalone_chart, {
                        type: 'line',
                        data: capitalone_data,
                        options: chart_options
                    })
                    break

                case 'btn_wallmart':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#wallmart").show()
                    $("#wallmart").addClass('currently_shown')

                    

                    new Chart(wallmart_chart, {
                        type: 'line',
                        data: wallmart_data,
                        options: chart_options
                    })
                    break

                case 'btn_toyota':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#toyota").show()
                    $("#toyota").addClass('currently_shown')

                    

                    new Chart(toyota_chart, {
                        type: 'line',
                        data: toyota_data,
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