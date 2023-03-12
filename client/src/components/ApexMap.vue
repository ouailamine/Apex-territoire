<template>
  <div
    id="ApexMap"
    class="global"
    v-if="$store.state.userDataObj !== null"
  >
    
      <div class="menu">
        <!-- Selecting Year Parcel -->
        
          <div id="campagne ">
            <b>Campagne :</b>
            <select v-model="selectedYearIdx" class="custom-select"
            style="width:auto;">
              <option
                v-for="(elmt, index) in $store.getters.yearNumberList"
                v-bind:key="index"
                v-bind:value="index"
              >
                {{ elmt }}
              </option>
            </select>
          </div>

          <div id="semaine">
            <b>Semaine :</b>
            <select v-model="selectedWeekIdx" class="custom-select"
            style="width:auto;">
              <option
                v-for="(elmt, index) in $store.getters.weekLabelList"
                v-bind:key="index"
                v-bind:value="index"
              >
                {{ elmt }}
              </option>
            </select>
          </div>
        
        <div id=" parcelle">
          <b>Parcelle :</b>
          <select v-model="selectedParcelIdx" class="custom-select"
            style="width:auto;">
            <option
              v-for="(pName, index) in $store.getters.parcelNameList"
              v-bind:key="index"
              v-bind:value="index"
            >
              {{ pName }} 
              ({{
                $store.getters.getDisplayedUserNameIfNeeded(
                $store.state.userDataObj.parcels[index].dataOwnerEMail,
                $store.state.userDataObj.parcels[index].dataOwnerName
              )
              }})
            </option>
          </select>
        </div>

        <!-- Previous year -->
        <div id="campagnepr">
          <button class="btn btn-dark"
            id="viewPrevYear"
            @mouseover="showPrevYear(true)"
            @mouseout="showPrevYear(false)"
          >
            <i class="far fa-eye"></i> campagne précédente
          </button>
          <p><label v-if="msgPrevYear !== null">
            {{ msgPrevYear }}
          </label></p>
        </div>
      </div>

      <hr />

      <div class="map">
        <div class="headermap" v-if="$store.state.viewMode === 'debug'">
          <p class="text">
            {{
              `nbObsFullGrowth: ${$store.getters.getSelectedWeekMetric.nbObsFullGrowth}, nbObsSlowGrowth: ${$store.getters.getSelectedWeekMetric.nbObsSlowGrowth}, nbObsStoppedGrowth: ${$store.getters.getSelectedWeekMetric.nbObsStoppedGrowth}, (modified: ${$store.getters.getSelectedWeekMetric.modified})`
            }}
          </p>
          <p class="text">
            {{
              `currentzoom: ${currentZoom}, currentCenter: ${currentCenter})`
            }}
          </p>
        </div>

        <div class="bodymap">
          <l-map
            ref="parcelInfoMap"
            :zoom="currentZoom"
            :center="currentCenter"
            :options="mapOptions"
            style=" height: 90%; "
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
            @click="createMarker"

          >

          

            <l-tile-layer :url="url" :attribution="attribution" />

            <l-marker
              v-if="currentMarker !== null"
              :lat-lng="currentMarker"
              :icon="createNewParcelIcon()"
              @click="removeMarker()">
            </l-marker>
            

            <div
              class="parcels"
              v-for="(parcel, index) in $store.state.userDataObj.parcels"
              v-bind:item="parcel"
              v-bind:index="index"
              v-bind:key="index"
            >
              <l-marker
                :lat-lng="getLatLng(parcel.parcelCoord)"
                :icon="createIcon(index)"
                @click="parcelMarkerClick(index)"
              >
                <l-popup>
                  <div>
                    <p class="text" style="text-align:left">
                      <b> parcelle</b> : {{ parcel.parcelName }} <br />
                      <b>observateur</b> : 
                      ({{
                        $store.getters.getDisplayedUserNameIfNeeded(
                        $store.state.userDataObj.parcels[index].dataOwnerEMail,
                        $store.state.userDataObj.parcels[index].dataOwnerName
                      )}})
                       <br />

                      <b>semaine du </b>:
                      {{ $store.getters.weekLabelList[selectedWeekIdx] }}
                      {{ $store.getters.yearNumberList[selectedYearIdx] }}<br />

                      <template 
                        class="text"
                        v-if="
                          $store.getters.getSelectedWeekMetricTotalNbObs > 0
                        "
                      >
                        <b>Contrainte hydrique</b> :
                        {{
                          $store.getters.getSelectedWeekMetricHydricConstraint
                        }}
                        <br />
                        <b>Indice de croissance</b> :
                        {{ $store.getters.getSelectedWeekMetricAvgGrowth }}
                        <br />
                        <b>observations</b> :
                        {{ $store.getters.getSelectedWeekMetricTotalNbObs }}
                        <br />
                        # Pleine croissance :
                        {{
                          $store.getters.getSelectedWeekMetric.nbObsFullGrowth
                        }}
                        <br />
                        # Croissance ralentie :
                        {{
                          $store.getters.getSelectedWeekMetric.nbObsSlowGrowth
                        }}
                        <br />
                        # Croissance arrêtée :
                        {{
                          $store.getters.getSelectedWeekMetric
                            .nbObsStoppedGrowth
                        }}
                        <br />
                      </template>
                      <template v-else> (pas d'observations)<br /> </template>
                      <a href="#/edit" style="text-align:center">éditer</a>
                    </p>
                  </div>
                </l-popup>
              </l-marker>
            </div>
          </l-map>
        </div>
      </div>
    

    <!-- Indicators Components  -->
    <div class="graphe">
      <div id="title">
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
        <apex-growth-pie-chart class="item" ></apex-growth-pie-chart>
      </div>
      <hr />

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
      <hr />
      <div id="graphe3">
        <p style="font-size:15px;">
        Evolution de la contrainte hydrique
        {{
          this.$store.getters.yearNumberList[this.$store.state.selectedYearIdx]
        }}
        <apex-hydric-constraint-line-chart
          class="item"
        ></apex-hydric-constraint-line-chart>
         </p>
      </div>
      <hr />
      <router-link to="/edit" class="nav-link" >éditer</router-link>
    </div>
  </div>

</template>

<script>
// import map libraries and components
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import ApexMapServices from "../services/ApexMapServices";

// import subcomponents librairies and

import ApexGrowthPieChart from "./apexMapComponents/ApexGrowthPieChart";
import ApexGrowthLineChart from "./apexMapComponents/ApexGrowthLineChart";
import ApexHydricConstraintLineChart from "./apexMapComponents/ApexHydricConstraintLineChart";

// import styles librairies

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "ApexMap",

  components: {
    // map components
    LMap,
    LTileLayer,
    LMarker,
    LPopup,

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

      // url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      // url: "'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      url:
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",

      currentZoom: 18,
      currentCenter: latLng(43.6452, 3.87189),

      mapOptions: {
        zoomSnap: 0.5,
      },

      prevYearIsShowned: false, // flag for previous year
      msgPrevYear: null,

      currentMarker:null,

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


    this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    this.selectedYearIdx = this.$store.state.selectedYearIdx;
    this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    this.parcelMarkerClick(this.selectedParcelIdx);



    this.$store.commit("incrementForceComponentUpdateCounter");
    
    // this.$nextTick(() => {
      
    //   this.selectedParcelIdx = this.$store.state.selectedParcelIdx;
    //   this.selectedYearIdx = this.$store.state.selectedYearIdx;
    //   this.selectedWeekIdx = this.$store.state.selectedWeekIdx;

    //   this.$store.commit("incrementForceComponentUpdateCounter");

    // });
  },

  watch: {
    selectedParcelIdx: function(val) {
      // console.log(" watch update selectedParcelIdx val");
      // console.log(val);

      this.$store.commit("updateSelectedParcelIdx", val);
      this.parcelMarkerClick(val);
    },

    selectedYearIdx: function(val) {
      // console.log(" watch update selectedYearIdx val");
      // console.log(val);

      this.$store.commit("updateSelectedYearIdx", val);
    },

    selectedWeekIdx: function(val) {
      // console.log(" watch update selectedWeekIdx val");
      // console.log(val);

      this.$store.commit("updateSelectedWeekIdx", val);
    },

    currentCenter: function(val) {
      this.$refs.parcelInfoMap.setCenter(val);
    },
  },

  methods: {


    createMarker(event){
      console.log(event.latlng)
      // this.currentMarker = event.latlng
    },

    createNewParcelIcon() {
      let avgGrowth = -1;

      let color = ApexMapServices.avgGrowthToGreenColor(avgGrowth);

      return new Icon({
        iconUrl: "images/my_" + color + "_pin.png",
        iconSize: [22, 35],
        iconAnchor: [11, 34],
        popupAnchor: [0, -34],
      });
    },

    removeMarker(){
       this.currentMarker =null
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },

    centerUpdate(center) {
      this.currentCenter = center;
    },


    getLatLng(coord) {
      return latLng(coord.lat, coord.lng);
    },

    parcelMarkerClick(pIdx) {
      console.log("parcelMarkerClick pIdx: " + pIdx);

      if (pIdx !== this.selectedParcelIdx) {
        this.selectedParcelIdx = parseInt(pIdx);
      }

      let lat = this.$store.state.userDataObj.parcels[pIdx].parcelCoord.lat;
      let lng = this.$store.state.userDataObj.parcels[pIdx].parcelCoord.lng;

      this.currentCenter = latLng(lat, lng);

      // console.log("this.$refs.parcelInfoMap");
      // console.log(this.$refs.parcelInfoMap);
    },

    showPrevYear(show) {
      if (show) {
        if (this.selectedYearIdx === 0) {
          this.msgPrevYear =
            "pas d'observations avant " +
            this.$store.getters.yearNumberList[this.selectedYearIdx];
        } else {
          this.selectedYearIdx = this.selectedYearIdx - 1;
          this.prevYearIsShowned = show;
        }
      } else {
        if (this.prevYearIsShowned) {
          this.selectedYearIdx = this.selectedYearIdx + 1;
          this.prevYearIsShowned = show;
        }
        this.msgPrevYear = null;
      }
    },

    createIcon(pIdx) {
      let avgGrowth = -1;
      let nbTotalObs = this.$store.getters.getTotalNbObs(
        pIdx,
        this.selectedYearIdx,
        this.selectedWeekIdx
      );
      if (nbTotalObs > 0) {
        avgGrowth = this.$store.getters.getAvgGrowth(
          pIdx,
          this.selectedYearIdx,
          this.selectedWeekIdx
        );
        avgGrowth = Math.round(avgGrowth *100)/100.0
      }

      // console.log("createIcon pIdx: " + pIdx + " avgGrowth: " + avgGrowth);

      let color = ApexMapServices.avgGrowthToGreenColor(avgGrowth);

      if (this.prevYearIsShowned === true) {
        console.log(" color pin border : ");
        color = color + "_bordered";
      }else{
        if(pIdx === this.selectedParcelIdx){
          color = color + "_spotted";
        }
      }

      return new Icon({
        iconUrl: "images/my_" + color + "_pin.png",
        iconSize: [22, 35],
        iconAnchor: [11, 34],
        popupAnchor: [0, -34],
      });
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
.menu{ grid-area: me ;height: 100%;width: 100%;margin-top: 10px;padding: 3px;}
#campagne{grid-area: ca ;}
#semaine{grid-area: se;}
#parcelle{grid-area: pa;}
#campagnepr{grid-area: cap;}


.graphe{grid-area: gr;
  margin: 20px;
  margin-right: 10px;
}
#graphe1{grid-area: gr1;}
#graphe2{grid-area: gr2;}
#graphe3{grid-area: gr3;}
#title{grid-area: ti;}


.map{ grid-area: map;text-align : center; padding: 1px;}
.headermap{grid-area:hdm;}
.item {text-align : center; margin-left: auto ;  margin-right: auto;margin-bottom: 0px; margin-top: 0px; width: 300px ;height: 200px; padding: 0px;}
.bodymap{grid-area: bdm;}

@media (max-width: 900px) {
.map{ grid-area: map;} 
.bodymap{grid-area: bdm;height: 400px ; width: 100%;text-align: center;margin-left: auto ;  margin-right: auto;padding: 10px;}
#campagne{grid-area: ca ;position: relative;align-self: left ;}
#semaine{grid-area: se;margin-top: 10px;position: relative;}
#parcelle{grid-area: pa;margin-top: 10px;position: relative;}
#campagnepr{grid-area: cap;margin-top: 10px;position: relative;}
.global {display: grid;
        grid-template-columns: auto 1fr;
         grid-template-columns: repeat(1,1fr);
         grid-template-rows: auto 1fr;
         grid-template-rows: repeat(1fr, 10fr,10fr);
         grid-template-areas: 
          "me"
          "map"
          "gr"}

.map{display: grid;
         grid-template-columns: repeat(1,1fr);
         grid-template-rows: auto 1fr;
         grid-template-rows: repeat(1fr, 10fr);
         grid-template-areas:
          "hdm"
          "bdm" } 

.menu{display: grid;
         grid-template-columns: auto 1fr; 
         grid-template-rows: auto 1fr;
         grid-template-columns: repeat(1,1fr);
         grid-gap: 10px;
         grid-template-rows: repeat(1fr,1fr,1fr,2fr);
         
         grid-template-areas: 
          "ca" 
          "se"
          "pa"
          "cap"
          }   
  
    }

@media (min-width: 900px) {

#campagnepr{margin-left: 30px;position: relative;}

.global {display: grid;
         grid-template-columns: repeat(3fr, 1fr);
         grid-template-rows: auto 1fr;
         grid-template-rows: repeat(1fr, 10fr);
         grid-template-areas: 
 
           "me me gr"
           "map map gr"
           }
          

.map{display: grid;
        grid-template-columns: auto 1fr; 
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: auto 1fr; 
        grid-template-rows: repeat(0, 1fr);
         grid-template-areas:
          "hdm"
          "bdm" 
          }

.menu{display: grid;
         grid-template-columns: auto 1fr; 
         grid-template-rows: auto 1fr;
         grid-template-columns: repeat(1fr, 1fr,2fr, 2fr);
         grid-template-rows: repeat(2,1fr,1fr);
         grid-template-areas: 
          "ca se pa cap " 
          "ca se pa p" 
          }   
  
    }
</style>