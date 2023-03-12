<template>
  <div class="global" v-if="$store.state.userDataObj !== null">
    <br />

    <div class="title">
      <hr />
      <h4>Bonjour {{ $store.getters.getDisplayedUserName }}</h4>
      <hr />
    </div>

    <div class="menu">
        <div id="compagne">
          <b>Campagne :</b>
          <select
            v-model="selectedYearIdx"
            class="custom-select"
            style="width:auto;"
          >
            <option
              v-for="(elmt, index) in $store.getters.yearNumberList"
              v-bind:key="index"
              v-bind:value="index"
              >{{ elmt }}
            </option>
          </select>
        </div>

        <div id="semaine">
          <b>Semaine :</b>
          <select
            v-model="selectedWeekIdx"
            class="custom-select"
            style="width:auto;"
          >
            <option
              v-for="(elmt, index) in $store.getters.weekLabelList"
              v-bind:key="index"
              v-bind:value="index"
              >{{ elmt }}
            </option>
          </select>
        </div>
        <div id="parcelle">
          <b>Parcelle :</b>
          <select
            v-model="selectedParcelIdx"
            class="custom-select"
            style="width:auto;"
          >
            <option
              v-for="(pName, index) in $store.getters.parcelNameList"
              v-bind:key="index"
              v-bind:value="index"
              >{{ pName }} 
              ({{
              $store.getters.getDisplayedUserNameIfNeeded(
                $store.state.userDataObj.parcels[index].dataOwnerEMail,
                $store.state.userDataObj.parcels[index].dataOwnerName
              )
            }})
            </option>
          </select>
      </div>
    </div>



    <div class="graphe">

      <div id="graphe1">
        <p style="font-size:15px">
          Croissance des apex semaine du
          {{
            this.$store.getters.weekLabelList[this.$store.state.selectedWeekIdx]
          }}
          {{
            this.$store.getters.yearNumberList[
              this.$store.state.selectedYearIdx
            ]
          }}
        </p>
        <apex-growth-pie-chart class="item" ></apex-growth-pie-chart>
      </div>
      
      <!-- évolution par rapport à semaine précédente
      <hr> -->
      <div id="graphe2">
        <p style="font-size:15px;"> 
          
          Evolution de la croissance des apex
          {{
            this.$store.getters.yearNumberList[
              this.$store.state.selectedYearIdx
            ]
          }}
          <apex-growth-line-chart class="item"></apex-growth-line-chart>
        </p>
      </div>
      

      <div id="graphe3">
        <p style="font-size:15px;">
        Evolution de la contrainte hydrique
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-hydric-constraint-line-chart
          class="item" id="graphe33"
        ></apex-hydric-constraint-line-chart>
         </p>
      </div>

    </div>

<div class="export" style="margin-top:10px">


    <hr />

    <div class="export" style="margin-top:10px">

        <hr />
        <button id="expdf" @click="exportPDF()" class="btn btn-danger btn-sm">
         <img src="images/pdf.png"/> Export en PDF
        </button>
        <button id="excsv" @click="exportCSV()" class="btn btn-success btn-sm">
         <img src="images/excel.png"/> Export en CSV
        </button>
        <hr />

    </div>
    
  </div>

      </div>
      
    
    
</template>

<script>

// import subcomponents librairies and
import ApexGrowthPieChart from "./apexMapComponents/ApexGrowthPieChart";
import ApexGrowthLineChart from "./apexMapComponents/ApexGrowthLineChart";
import ApexHydricConstraintLineChart from "./apexMapComponents/ApexHydricConstraintLineChart";

// import styles librairies
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

export default {

  name: "Export",
  components: {
    ApexGrowthPieChart,
    ApexGrowthLineChart,
    ApexHydricConstraintLineChart,
  },
  

  data() {
    return {
      userDataObj: [],
      userDBRows: [],
      error: "",
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,
      parceld: "",
      hydricConstraint: 3,
      prctSlowGrowth: 0,
      prctFullGrowth: 0,
      avgGrowth: 0,
    };
  },

  async created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;
  },

  mounted() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    this.$nextTick(() => {
      this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
      this.selectedYearIdx = this.$store.state.selectedYearIdx;
      this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

      this.$store.commit("incrementForceComponentUpdateCounter");
    });
  },

  methods: {

    getDataFrame(){

      let columns = [
        "Parcelle",
        "Campagne",
        "Semaine",

        "Nb Obs.",
        "Nb Pleine croiss.",
        "Nb Croiss. ralentie",
        "Nb Croiss. arrêtée",

        "% Pleine croiss.",
        "% Croiss. ralentie",
        "% Croiss. arrêtée",
        "ic-Apex",

        "Contrainte hydrique",
      ];

      let rows = [];

      let selectedParcelYearWeekLabelList = this.$store.getters.weekLabelList;
      let nbWeeks = selectedParcelYearWeekLabelList.length;
      for (let wIdx = 0; wIdx < nbWeeks; wIdx++) {
        let week_metric = this.$store.getters.getWeekMetric(
          this.selectedParcelIdx,
          this.selectedYearIdx,
          wIdx
        );

        let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
        let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
        let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

        let nbTotalObs = nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;

        let prctFullGrowth = 0;
        let prctSlowGrowth = 0;
        let prctStoppedGrowth = 0
        let avgGrowth = 0;


        if (nbTotalObs > 0) {
          prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100);
          prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100);
          prctStoppedGrowth = Math.round((nbObsStoppedGrowth / nbTotalObs) * 100)

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
        if (nbTotalObs <= 0) {
          hydricConstraint = 0;
        }

        let row = [];
        
        row.push(this.$store.getters.parcelNameList[this.selectedParcelIdx]);
        row.push(this.$store.getters.yearNumberList[this.selectedYearIdx]);
        row.push(this.$store.getters.weekLabelList[wIdx]);

        row.push(nbTotalObs);
        row.push(nbObsFullGrowth);
        row.push(nbObsSlowGrowth);
        row.push(nbObsStoppedGrowth);

        row.push(prctFullGrowth)
        row.push(prctSlowGrowth)
        row.push(prctStoppedGrowth)

        row.push(avgGrowth)
        row.push(hydricConstraint)

        rows.push(row);
        
      }

      let result = {
        columns : columns,
        rows: rows
      }
      console.log("DataFrame")
      console.log(result)

      return result;
    },

    exportPDF() {
      
      var pdf = new jsPDF("landscape");

      var graphe1 = document.getElementById("pie-chart");
      var graphe2 = document.getElementById("line-chart");
      var graphe3 = document.getElementById("graphe33").children[1];

      var graphe1Img = graphe1.toDataURL();
      var graphe2Img = graphe2.toDataURL();
      var graphe3Img = graphe3.toDataURL();


      pdf.text(90, 20, 
        " Parcelle : "+ this.$store.getters.parcelNameList[this.selectedParcelIdx]
        +", Observateur : "+ this.$store.getters.getDisplayedUserNameIfNeeded(
                this.$store.state.userDataObj.parcels[this.selectedParcelIdx].dataOwnerEMail,
                this.$store.state.userDataObj.parcels[this.selectedParcelIdx].dataOwnerName
              )
      );
      pdf.text(60, 40, " Indicateurs d'évolution de croissance des Apex pour la campagne "+ this.$store.getters.yearNumberList[this.selectedYearIdx]);

      //                    colonne ligne  largueur hauteur
      pdf.addImage(graphe1Img, "NPG", 10, 60, 60, 60);
      pdf.addImage(graphe2Img, "NPG", 90, 60, 90, 60);
      pdf.addImage(graphe3Img, "NPG", 210, 60, 60, 60);

      pdf.text(10, 130, "semaine du "+this.$store.getters.weekLabelList[this.selectedWeekIdx]);
      pdf.text(90, 130, "évolution de la croissance ");
      pdf.text(200, 130, "évolution de la contrainte hydrique");
      
      

      pdf.addPage("a4", "l");
      pdf.text(60, 10, "Table des indicateurs de croissance calculés pour la campagne "
      + this.$store.getters.yearNumberList[this.selectedYearIdx]);

      let dataFrame = this.getDataFrame();
      
      pdf.autoTable(dataFrame.columns, dataFrame.rows, {
        margin: { top: 20, halign: "center" },
        rowStyles: { 0: { halign: "center" } },
      });

      pdf.save("table.pdf");
    },

    exportCSV() {


      let dataFrame = this.getDataFrame();

      let csvContent = "data:text/csv;charset=utf-8,\n";
      dataFrame.columns.forEach(
        (cName,index,array)=> csvContent=  csvContent + '"'+cName+'"'+ ((index<array.length-1)?",":"\n")
      );
      dataFrame.rows.forEach( 
        row=> row.forEach( 
          (val,index,array) => csvContent= csvContent +val+ ((index<array.length-1)?",":"\n") 
        )
      );

      console.log("csvContent")
      console.log(csvContent)

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },
  },

  watch: {
    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);
      this.parcelMarkerClick(val);
    },
    selectedYearIdx: function(val) {
      this.$store.commit("updateSelectedYearIdx", val);
    },
    selectedWeekIdx: function(val) {
      this.$store.commit("updateSelectedWeekIdx", val);
    },
  },
};
</script>
<style scoped>

p{grid-area: p;
  font-weight: bold;
  width: auto;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 00px;}

.menu {
  padding: 5px;
  grid-area: me;
  height: 100%;
  width: auto;
 

}

#compagne {
  grid-area: co;
  
}
#semaine {
  grid-area: se;
 
}
#parcelle {
  grid-area: pa;

}

.item {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  width: 300px;
  height: 200px;
  padding: 00px;
}


.graphe{grid-area: gr;
  margin: 20px;
  margin-right: 10px;
}

#grT{grid-area: grT;
  
}
#graphe1{grid-area: gr1;
  
}
#graphe2{grid-area: gr2;
  
}
#graphe3{grid-area: gr3;
  
}



.title {
  grid-area: tl;
  padding: 0px;
}

#expdf {
  margin-right: 20px;
}

h4 {
  background: gray;
}

.export{grid-area: ex; }

@media screen and (min-width: 1100px) {
  .menu {margin-top: 80px;

}
 .global {display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(1,1fr);

    grid-template-rows: auto 1fr;
    grid-template-rows: repeat(4, 1fr,1fr,1fr,1fr);

    grid-template-areas:
      "tl"
      "me"
      "gr"
      "ex";
  }

  .menu {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(3, 1fr,1fr,2fr);

    grid-template-rows: auto 1fr;
    grid-template-rows: repeat(1,1fr);
    grid-template-areas: 
    "co se pa";
  }

  .graphe{
    display:grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(3, 1fr,1fr,1fr);

    grid-template-rows: auto 1fr;
    grid-template-rows: repeat(2,1fr,1fr);
    grid-template-areas: 
    "grT grT grT"
    "gr1 gr2 gr3";

  }

  table {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    border-collapse: collapse;
  }
  tr:nth-of-type(odd) {
    background: #eee;
  }
  th {
    background: #333;
    color: white;
    font-weight: bold;
  }
  td,
  th {
    padding: 6px;
    border: 1px solid #ccc;
    text-align: left;
  }
}


@media screen and (max-width: 1100px) {
#compagne {
  margin-top: 10px;
  
}
#semaine {
 margin-top: 10px;
 
}
#parcelle {
  margin-top: 10px;

}

  .title {
    grid-area: tl;
    margin-top: 0px;
   
  }
  .global {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(1, 1fr);

     grid-template-rows: auto 1fr;
    grid-template-rows: repeat(3, 1fr,1fr,1fr);

    grid-template-areas:
      "tl"
      "me"
      "gr"
      "ex";
  }
  .menu {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: auto 1fr;
    grid-template-rows: repeat(3, 1fr,1fr,1fr);
    grid-template-areas:
      "co"
      "se"
      "pa";
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }
  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
  td:nth-of-type(1):before {
    content: "Pleine croissance ";
  }
  td:nth-of-type(2):before {
    content: "Croissance ralentie";
  }
  td:nth-of-type(3):before {
    content: "Croissance arrêtée";
  }
  td:nth-of-type(4):before {
    content: "Operation";
  }
}
</style>