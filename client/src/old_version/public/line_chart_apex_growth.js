// LINE CHART TIME EVOLUTION OF GROWTH INDICATORS




var weekDatesGrowth = [];
var weekDatesPrctFullGrowth = [];
var weekDatesPrctSlowGrowth = [];
var weekDatesPrctStoppedGrowth = [];



function init(line_chart_growth_dom_elmt){
    reinitWeekDatesGrowthIndicators();
    new Chart(line_chart_growth_dom_elmt, config_line_chart_growth_indicators);
}



function reinitWeekDatesGrowthIndicators() {

    for (var idxWeekDate = 0; idxWeekDate < weekDates.length; idxWeekDate++) {
        var weekDateObservations = campIdx_semIdx_parclIdx_obsIdx[selectedCampIdx][idxWeekDate][selectedParclIdx];
        var nbObsNiv0 = 0;
        var nbObsNiv1 = 0;
        var nbObsNiv2 = 0;
        for (var ob of weekDateObservations) {
            console.log("ob: " + ob.niveau);
            if (ob.niveau == 0) {
                nbObsNiv0++;
            }
            if (ob.niveau == 1) {
                nbObsNiv1++;
            }
            if (ob.niveau == 2) {
                nbObsNiv2++;
            }
        }
        // console.log(" selectedCampIdx: " + selectedCampIdx+" selectedWeekIdx: " + selectedWeekIdx);
        // console.log("   "+weekDates[idxWeekDate]+" nbObsNiv0: " + nbObsNiv0+" nbObsNiv1: " + nbObsNiv1+" nbObsNiv2: " + nbObsNiv2);
        weekDatesPrctFullGrowth.push(Math.round((nbObsNiv2 / weekDateObservations.length) * 100));
        weekDatesPrctSlowGrowth.push(Math.round((nbObsNiv1 / weekDateObservations.length) * 100));
        weekDatesPrctStoppedGrowth.push(Math.round((nbObsNiv0 / weekDateObservations.length) * 100));
        weekDatesGrowth.push(Math.round(((nbObsNiv2 + 0.5 * nbObsNiv1) / weekDateObservations.length)));

    }

    for (var idxWeekDate = 0; idxWeekDate < weekDates.length; idxWeekDate++) {
        console.log("   " + weekDates[idxWeekDate]
            + " prctObsNiv0: " + weekDatesPrctFullGrowth[idxWeekDate]
            + " prctObsNiv1: " + weekDatesPrctSlowGrowth[idxWeekDate]
            + " prctObsNiv2: " + weekDatesPrctStoppedGrowth[idxWeekDate]
            + " growthIndic: " + weekDatesGrowth[idxWeekDate]
        );
    }

}

var config_line_chart_growth_indicators = {
    type: 'line',
    data: {
        labels: weekDates,
        datasets: [{
            label: 'Indice croiss.',
            yAxisID: 'A',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(242, 142, 146, 0.2)',
            borderColor: 'rgb(242, 142, 146)',
            borderCapStyle: 'square',
            borderDash: [], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "black",
            pointBackgroundColor: "white",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(242, 142, 146)',
            pointHoverBorderColor: "white",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: weekDatesGrowth
        },
        {
            label: '% pleine',
            yAxisID: 'B',
            fill: true,
            hidden: true,
            lineTension: 0.1,
            backgroundColor: "rgba(247, 201, 161, 0.2)",
            borderColor: 'rgb(247, 201, 161)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "black",
            pointBackgroundColor: "white",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(247, 201, 161)',
            pointHoverBorderColor: "white",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: weekDatesPrctFullGrowth
        },
        {
            label: '% ralentie',
            yAxisID: 'B',
            fill: true,
            hidden: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(144, 190, 184, 0.2)',
            borderColor: 'rgb(144, 190, 184)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "black",
            pointBackgroundColor: "white",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(144, 190, 184)',
            pointHoverBorderColor: "white",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: weekDatesPrctSlowGrowth
        },
        {
            label: '% arrétée',
            yAxisID: 'B',
            fill: true,
            hidden: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(105, 134, 143, 0.2)',
            borderColor: 'rgb(105, 134, 143)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "black",
            pointBackgroundColor: "white",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(105, 134, 143)',
            pointHoverBorderColor: "white",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: weekDatesPrctStoppedGrowth
        }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'bottom'
        },
        scales: {
            xAxes: [{
                ticks: {
                    suggestedMax: 5
                }
            }],
            yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Indice croiss.',
                    fontSize: 15
                },
                ticks: {
                    max: 1,
                    min: 0
                    , stepSize: 0.25
                }
            }, {
                id: 'B',
                type: 'linear',
                position: 'right',
                scaleLabel: {
                    display: true,
                    labelString: '% Apex',
                    fontSize: 15
                },
                ticks: {
                    max: 100,
                    min: 0
                    , stepSize: 25
                }
            }]
        }
    }
};

