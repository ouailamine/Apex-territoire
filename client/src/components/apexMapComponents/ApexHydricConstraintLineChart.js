import { Line, mixins } from 'vue-chartjs'

export default {

    extends: Line,

    mixins: [mixins.reactiveData],

    name: "ApexHydricConstraintLineChart",

    data(){
        return{

            chartData: {
                labels: [],
                datasets: [{
                    label: 'Niveau contrainte hydrique',
                    yAxisID: 'CH',
                    fill: true,
                    steppedLine: "middle",
                    lineTension: 0.1,
                    backgroundColor: 'rgba(151, 162, 191, 0.2)',
                    borderColor: 'rgb(151, 162, 191)',
                    borderCapStyle: 'square',
                    borderDash: [], // try [5, 15] for instance
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "black",
                    pointBackgroundColor: "white",
                    pointBorderWidth: 1,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: 'rgb(151, 162, 191)',
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
                            suggestedMax: 14
                        }
                    }],
                    yAxes: [{
                        id: 'CH',
                        type: 'linear',
                        position: 'left',
                        /*scaleLabel: {
                          display: true,
                          labelString: 'Classes',
                          fontSize: 15
                        },*/
                        ticks: {
                            max: 3,
                            min: 0,
                            stepSize: 1,
                            callback: function (label) {
                                switch (label) {
                                    case 0:
                                        return 'Absente';
                                    case 1:
                                        return 'Modérée';
                                    case 2:
                                        return 'Forte';
                                    case 3:
                                        return 'Sévère';
                                }
                            }
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
        
        selectedParcelYearWeeksHydricConstraint :{
            get(){

                let forcedChartUpdateCounter = this.$store.state.forceComponentUpdateCounter ;

                let hydricConstraints = [];

                let selectedParcelIdx = this.$store.state.selectedParcelIdx;
                let selectedYearIdx = this.$store.state.selectedYearIdx;

                let selectedParcelYearWeekLabelList = this.$store.getters.weekLabelList ;
                let nbWeeks = selectedParcelYearWeekLabelList.length;

                for( let wIdx =0; wIdx<nbWeeks; wIdx++ ) {

                    let week_metric = this.$store.getters.getWeekMetric(
                        selectedParcelIdx,
                        selectedYearIdx,
                        wIdx
                    );

                    let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
                    let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
                    let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

                    let prctFullGrowth = 0
                    let prctSlowGrowth = 0
                    // let prctStoppedGrowth = 0
                    let avgGrowth = 0

                    let nbTotalObs = nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;

                    if (nbTotalObs > 0) {
                        prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100)
                        prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100)
                        // prctStoppedGrowth = Math.round((nbObsStoppedGrowth / nbTotalObs) * 100)

                        avgGrowth = (prctSlowGrowth * 0.5 + prctFullGrowth) / 100.0;
                    }
                    
                    let hydricConstraint = 3;
                    if (avgGrowth >= 0.75) {
                        hydricConstraint = 0;
                    } else {
                        if (prctSlowGrowth >= 5) {
                            hydricConstraint = 1;
                        } else {
                            if (prctSlowGrowth <= 90) {
                                hydricConstraint = 2;
                            }
                        }
                    }
                    if (nbTotalObs <= 0){
                        hydricConstraint = 0;
                        hydricConstraint = null;
                    }

                    hydricConstraints.push(hydricConstraint);
                    
                }


                let selected_parcel_year_weeks_hydric_constraints = {
                    weekLabelList : selectedParcelYearWeekLabelList,
                    hydricContraintList: hydricConstraints,
                    forcedChartUpdateCounter : forcedChartUpdateCounter
                }
                

                // console.log("CALL  selectedParcelYearWeeksHydricConstraint ");
                // console.log(selected_parcel_year_weeks_hydric_constraints);

                return selected_parcel_year_weeks_hydric_constraints;
            }
        }
    },

    watch: {
        selectedParcelYearWeeksHydricConstraint(newVal){

            // console.log("WATCH selectedParcelYearWeeksData");
            // console.log(newVal);
            
            this.chartData.labels = newVal.weekLabelList;
            this.chartData.datasets[0].data = newVal.hydricContraintList;

            this.renderChart(this.chartData,this.options)
            
        },
    },    
}

