import { Line, mixins } from 'vue-chartjs'

export default {

    extends: Line,

    mixins: [mixins.reactiveData],

    name: "ApexGrowthLineChart",

    data(){
        return{

            chartData: {
                labels: [],
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
                    data: []
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
                    data: []
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
                    data: []
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
                    data: []
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
                            autoSkip: false,
                            fullWidth: true,
                            suggestedMax: 14
                        }
                    }],
                    yAxes: [{
                        id: 'A',
                        type: 'linear',
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            labelString: 'Indice croiss.',
                            fontSize: 11
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
                            fontSize: 11
                        },
                        ticks: {
                            max: 100,
                            min: 0
                            , stepSize: 25
                        }
                    }]
                }
            }
        }
    },

    mounted(){
        
        this.$nextTick(() => {
      
            this.$store.commit("incrementForceComponentUpdateCounter");
      
          });
      },

    
    computed: {
        
        selectedParcelYearWeeksGrowthData :{
            get(){

                let selectedParcelIdx = this.$store.state.selectedParcelIdx;
                let selectedYearIdx = this.$store.state.selectedYearIdx;
                
                let forcedChartUpdateCounter = this.$store.state.forceComponentUpdateCounter;


                let selectedParcelYearWeeksPrctFullGrowth = [];
                let selectedParcelYearWeeksPrctSlowGrowth = [];
                let selectedParcelYearWeeksPrctStoppedGrowth = [];

                let selectedParcelYearWeeksAvgGrowth = [];

                let selectedParcelYearWeekLabelList = this.$store.getters.weekLabelList ;

                
                let nbWeeks = selectedParcelYearWeekLabelList.length;

                for (let wIdx = 0; wIdx < nbWeeks; wIdx++) {


                    let week_metric = this.$store.getters.getWeekMetric(
                        selectedParcelIdx,
                        selectedYearIdx,
                        wIdx
                    );

                    let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
                    let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
                    let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

                    let prctFullGrowth = null
                    let prctSlowGrowth = null
                    let prctStoppedGrowth = null
                    let avgGrowth = null

                    let nbTotalObs = nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;

                    if (nbTotalObs > 0) {
                        prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100)
                        prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100)
                        prctStoppedGrowth = Math.round((nbObsStoppedGrowth / nbTotalObs) * 100)

                        avgGrowth = (prctSlowGrowth * 0.5 + prctFullGrowth) / 100.0;
                    }

                    selectedParcelYearWeeksPrctFullGrowth.push(prctFullGrowth);
                    selectedParcelYearWeeksPrctSlowGrowth.push(prctSlowGrowth);
                    selectedParcelYearWeeksPrctStoppedGrowth.push(prctStoppedGrowth);

                    selectedParcelYearWeeksAvgGrowth.push(avgGrowth);

                }


                let selected_parcel_year_weeks_data = {
                    weekLabelList : selectedParcelYearWeekLabelList,
                    prctFullGrowth: selectedParcelYearWeeksPrctFullGrowth,
                    prctSlowGrowth: selectedParcelYearWeeksPrctSlowGrowth,
                    prctStoppedGrowth: selectedParcelYearWeeksPrctStoppedGrowth,
                    icApex: selectedParcelYearWeeksAvgGrowth,
                    forcedChartUpdateCounter: forcedChartUpdateCounter
                }
                

                // console.log("CALL  selectedParcelYearWeeksGrowthData ");
                // console.log(selected_parcel_year_weeks_data);

                return selected_parcel_year_weeks_data;
            }
        }
    },

    watch: {
        selectedParcelYearWeeksGrowthData(newVal){
            // console.log("WATCH selectedParcelYearWeeksGrowthData");
            // console.log(newVal);
            
            this.chartData.labels = newVal.weekLabelList;
            this.chartData.datasets[0].data = newVal.icApex;
            this.chartData.datasets[1].data = newVal.prctFullGrowth;
            this.chartData.datasets[2].data = newVal.prctSlowGrowth;
            this.chartData.datasets[3].data = newVal.prctStoppedGrowth;

            this.renderChart(this.chartData,this.options)
            
        },
    },    
}

