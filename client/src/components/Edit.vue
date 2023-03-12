<template>
  <div class="global" v-if="$store.state.userDataObj !== null">
    <div class="meta">
      <div class="title">
        <hr />
        <h4>Bonjour  {{ $store.getters.getDisplayedUserName }}</h4>
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

      <div class="table">
        <hr />
        <table class="table-striped">
          <thead>
            <tr>
              <th># Pleine croissance</th>
              <th># Croissance ralentie</th>
              <th># Croissance arrêtée</th>
              <th colspan="2">Operations</th>
            </tr>
          </thead>
          <tbody>
            <td>
               <b-form-input type="number" v-model="selectedWeekMetric.nbObsFullGrowth" style="width:auto; text-align: center;
  margin-left: auto;
  margin-right: auto;"/>
            </td>
            <td>
              <b-form-input type="number" v-model="selectedWeekMetric.nbObsSlowGrowth" style="width:auto; text-align: center;
  margin-left: auto;
  margin-right: auto;" />
            </td>
            <td>
              <b-form-input type= "number" v-model="selectedWeekMetric.nbObsStoppedGrowth" style="width:auto; text-align: center;
  margin-left: auto;
  margin-right: auto;"/>
            </td>
            <td>
              <button
                id="btnsendmodif" style="margin-right:20px"
                @click="updateSelectedWeekMetric()"
                class="btn btn-primary btn-sm"
              >
                Modifier
              </button>
              <button
                id="btnsenddelete"
                @click="reInitSelectedWeekMetric()"
                class="btn btn-warning btn-sm"
              >
                Réinitialiser
              </button>
            </td>
          </tbody>
        </table>
        <hr />
      </div>
      
      <div>
         {{ msg }}
        <div 
          v-for="(error,index) in errors"
          v-bind:key="index"
          v-bind:value="error"
        >
          {{error}}
        </div>

        </div>
    </div>
    

    <div class="btn">
      <hr />
      <router-link
        to="/map"
        tag="button"
        class="btn btn-success btn-sm"
        style="margin-bottom:20px;"
        >Retour à la carte</router-link
      >
      <hr />
    </div>

    <!-- Indicators Components  -->
    <div class="graphe">
      <div id="titlegraphe">
        <p style="font-size:20px">
          Parcelle:
          {{
            this.$store.getters.parcelNameList[
              this.$store.state.selectedParcelIdx
            ]
          }}
        </p>
      </div>

      <hr />

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
        <apex-growth-pie-chart class="item"></apex-growth-pie-chart>
      </div>
      <hr />

      <!-- évolution par rapport à semaine précédente
      <hr> -->
      <div id="graphe2">
        <p style="font-size:15px">
          Evolution de la croissance des apex
          {{
            this.$store.getters.yearNumberList[
              this.$store.state.selectedYearIdx
            ]
          }}
          <apex-growth-line-chart class="item"></apex-growth-line-chart>
        </p>
      </div>
      <hr />
      <div id="graphe3">
       <p style="font-size:15px"> Evolution de la contrainte hydrique
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-hydric-constraint-line-chart
          class="item"
        ></apex-hydric-constraint-line-chart></p>
      </div>
    </div>
  </div>
</template>

<script>



// import subcomponents librairies and

import ApexGrowthPieChart from "./apexMapComponents/ApexGrowthPieChart";
import ApexGrowthLineChart from "./apexMapComponents/ApexGrowthLineChart";
import ApexHydricConstraintLineChart from "./apexMapComponents/ApexHydricConstraintLineChart";


export default {
  
  components: {
    // other apex indicators sub components
    ApexGrowthPieChart,
    ApexGrowthLineChart,
    ApexHydricConstraintLineChart,
  },

  data() {
    return {
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,

      selectedWeekMetric: {},


      msg: "",
      errors: []

    };
  },

  

  created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    this.selectedWeekMetric = this.$store.getters.getSelectedWeekMetric;

  },

  mounted() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    this.msg = "";
    this.errors= [];

    this.selectedWeekMetric = this.$store.getters.getSelectedWeekMetric;
    this.$store.commit("incrementForceComponentUpdateCounter");

    
  },

  methods:{


    formIsValid: function () {

      let isValid = true;
      
      if(isNaN(parseInt(this.selectedWeekMetric.nbObsFullGrowth))) {
        this.errors.push("# Pleine croissance : '"+this.selectedWeekMetric.nbObsFullGrowth+"' n'est pas un entier ");
        isValid=false;
      }else{
        if(parseInt(this.selectedWeekMetric.nbObsFullGrowth)>=0){
          this.selectedWeekMetric.nbObsFullGrowth =parseInt(this.selectedWeekMetric.nbObsFullGrowth)
        }else{
          this.errors.push("# Pleine croissance : '"+this.selectedWeekMetric.nbObsFullGrowth+"' n'est pas un entier positif ");
          isValid=false;
        }
      }
      
      if (isNaN(parseInt(this.selectedWeekMetric.nbObsSlowGrowth))) {
        this.errors.push("# Croissance ralentie : '"+this.selectedWeekMetric.nbObsSlowGrowth+"' n'est pas un entier");
        isValid=false
      }else{
        if(parseInt(this.selectedWeekMetric.nbObsSlowGrowth)>=0){
          this.selectedWeekMetric.nbObsSlowGrowth =parseInt(this.selectedWeekMetric.nbObsSlowGrowth);
        }else{
          this.errors.push("# Croissance ralentie  : '"+this.selectedWeekMetric.nbObsSlowGrowth+"' n'est pas un entier positif ");
          isValid=false;
        }
      }

      if (isNaN(parseInt(this.selectedWeekMetric.nbObsStoppedGrowth))) {
        this.errors.push("# Croissance arretée : '"+this.selectedWeekMetric.nbObsStoppedGrowth+"' n' est pas un entier ");
        isValid=false;
      }else{
        if(parseInt(this.selectedWeekMetric.nbObsStoppedGrowth)>=0){
          this.selectedWeekMetric.nbObsStoppedGrowth =parseInt(this.selectedWeekMetric.nbObsStoppedGrowth);
         }else{
          this.errors.push("# Croissance arretée : '"+this.selectedWeekMetric.nbObsStoppedGrowth+"' n'est pas un entier positif ");
          isValid=false;
        }
      }

      this.msg="Les données de la semaine n'ont pas été modifiées";

      return isValid;
    },

    updateSelectedWeekMetric(){
      this.msg="";
      this.errors=[];


      console.log("START updateSelectedWeekMetric")

      if(this.formIsValid()){
        
        // console.log("Before save this.selectedWeekMetric")
        // console.log("weekNumber: "+this.selectedWeekMetric.weekNumber + " nbObsFullGrowth: "+this.selectedWeekMetric.nbObsFullGrowth)

        this.$store.dispatch("saveSelectedWeekMetric",this.selectedWeekMetric).then(()=>{
          
          this.selectedWeekMetric= this.$store.getters.getSelectedWeekMetric;

          // console.log("After save and get this.selectedWeekMetric")
          // console.log("weekNumber: "+this.selectedWeekMetric.weekNumber + " nbObsFullGrowth: "+this.selectedWeekMetric.nbObsFullGrowth + "dateInMS: "+this.selectedWeekMetric.dateTimeInMs )


          this.$store.commit("incrementForceComponentUpdateCounter");

      
          this.errors = []
          this.msg = "Les données de la semaine ont bien été modifiées, "
          if(this.$store.state.demoUserEmail){
             this.msg += " pour le "
              +this.$store.getters.getDisplayedUserName
              +" ces modifications sont effectives que le temps de la session"
          }
        
          
        
        });

      }

      console.log("END updateSelectedWeekMetric")
    },


    reInitSelectedWeekMetric: function(){
      
      this.msg = ""
      this.errors = []

      let weekmetric = this.$store.getters.getSelectedWeekMetric;

      let pIdx_yIdx_wIdx_mapkey = `pIdx:${this.selectedParcelIdx} yIdx:${this.selectedYearIdx} wIdx:${this.selectedWeekIdx}`;

      if (this.$store.state.userModifiedWeekMetrics.has(pIdx_yIdx_wIdx_mapkey)) { 
        this.$store.dispatch("deleteSelectedWeekMetric",weekmetric).then(()=>{
        this.selectedWeekMetric= this.$store.getters.getSelectedWeekMetric;
        

        this.$store.commit("incrementForceComponentUpdateCounter");

        this.errors = []
        this.msg = "Les données de la semaine ont été réinitialisées aux valeurs collectées dans ApeX Vignes"
         if(this.$store.state.demoUserEmail){
             this.msg += " pour l'"
              +this.$store.getters.getDisplayedUserName
              +" ces modifications sont effectives que le temps de la session"
          }

      })
      
      }
    }


  },

  watch: {

    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);

      this.selectedWeekMetric = this.$store.getters.getSelectedWeekMetric;
      this.msg="";
      this.errors=[];
    },

    selectedYearIdx: function(val) {
      this.$store.commit("updateSelectedYearIdx", val);

      this.selectedWeekMetric = this.$store.getters.getSelectedWeekMetric;
      this.msg="";
      this.errors=[];
    },

    selectedWeekIdx: function(val) {
      this.$store.commit("updateSelectedWeekIdx", val);

      this.selectedWeekMetric = this.$store.getters.getSelectedWeekMetric;
      this.msg="";
      this.errors=[];
    },
  },


};
</script>

<style scoped>
p{grid-area: p;font-weight: bold;
  width: auto;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;}
.global{padding: 10px;}
.btn {
  grid-area: btn;
}
.meta {
  grid-area: meta;
  margin-right: 20px;
}
.table {
  grid-area: ta;
  position: relative;
  margin: 10px;
}
.menu {
  grid-area: me;
  height: 50%;
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

.graphe {
  grid-area: gr;
  margin: 20px;
  margin-right: 10px;
}
#graphe1 {
  grid-area: gr1;
}
#graphe2 {
  grid-area: gr2;
}
#graphe3 {
  grid-area: gr3;
}
#titlegraphe {
  grid-area: ti;
}


.item {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  width: 300px;
  height: 200px;
 
}

.title {
  grid-area: tl;
  margin: 0px;
}
h4 {
  background: gray;
}

#label {
  margin-right: 20px;
  font-weight: bold;
}

@media screen and (min-width: 900px) {
  .global {
    display: grid;
    grid-template-columns: repeat(3fr, 1fr);
    grid-template-areas:
      "meta meta  gr "
      "meta meta  gr "
      "btn btn  gr ";
  }
  .meta {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "me"
      "ta "
      "ta "
      "btn";
  }
  .menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-template-areas: "co se pa pa";
  }

  table {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
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



@media screen and (max-width: 900px) {
  #campagne {
    margin-top: 15px;
  }
  #semaine {
    margin-top: 15px;
  }
  #parcelle {
    margin-top: 15px;
  }
  .title {
    grid-area: tl;
    margin-top: 0px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .table{
    grid-area: tl;
    margin-top: 20px;
    
  }
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "meta "
      "gr"
      "btn ";
  }

  .menu {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "co"
      "se"
      "pa"
      "cap";}
  
  table,
  thead,
  tbody,
  th,
  td,
  b-form-input,
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
    padding-left: 0%;
    height: 80px;
  }
  
  td:before {
    position: relative;
    top: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding-right: 1px;
    white-space: nowrap;
    margin-right: 20px;
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
  
}
</style>