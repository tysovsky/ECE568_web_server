(function($) {
    var data_json = JSON.parse(data);


    var google_data = {
        labels: data_json[0]['labels'],
        datasets: [{
            label: 'Stock price ($)',
            data: data_json[0]['data'],
            borderColor: "#4285f4",
            backgroundColor: '#FBBC05A0'
        }]
    }

    var facebook_data = {
        labels: data_json[1]['labels'],
        datasets: [{
            label: 'Stock price ($)',
            data: data_json[1]['data'],
            borderColor: "#29487D",
            backgroundColor: '#FEFEFEA0'
        }]
}

    var uber_data = {
            labels: data_json[2]['labels'],
            datasets: [{
                label: 'Stock price ($)',
                data: data_json[2]['data'],
                borderColor: "#161626",
                backgroundColor: '#C0C0C8A0'
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
            }]
        },
        responsive: true
    }

    var google_chart = $("#google_chart")
    var facebook_chart = $("#facebook_chart")
    var uber_chart = $("#uber_chart")
    

    var btns = [
        $("#btn_google"),
        $("#btn_facebook"),
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

                case 'btn_facebook':
                    $(".currently_shown").hide()
                    $(".currently_shown").removeClass('currently_shown')

                    $("#facebook").show()
                    $("#facebook").addClass('currently_shown')

                    

                    new Chart(facebook_chart, {
                        type: 'line',
                        data: facebook_data,
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