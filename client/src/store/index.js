import Vue from "vue";
import Vuex from "vuex";
import ApexDataServices from '../services/ApexDataServices';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/*
Todo:
   

   affichage de map -> icon color does not work when routing psswd ->map check mouted

   update to intial weekmetric value does work (values in text area are not updated)

   creer un utilisateur demo
      - creer une constante utilisateur demo dans index
         ajouter proprietes
            demoUserEMail: " baptiste.oger@supagro.fr"
            demoUserName:  baptiste.oger@supagro.fr
            - conserver loggedUserEmail loggedUser 
            - userDataObj

            
            lors du chargement des données le
      - ne pas permettre d'enregistrer les données dans la base de données
         partiel update week metric
         inqctive

   creer une page Info et Guide



   baptiste.oger@supagro.fr (userId:14 userId:47 )  
   Toto@tu.ti (userId:35), 
   Pichon.leo@gmail.com (userId:35)


*/

const getDefaultState = () => {
   return {

      activedNavbar: "",
      navbarModel: '',
      mailpresent: '',
      PasswordRequire: '',
      loggedUserEmail: "",
      demoUserEMail:"",
      userDataObj: null,
      selectedParcelIdx: 0,
      selectedYearIdx: 0,
      selectedWeekIdx: 0,
      userModifiedWeekMetrics: new Map(),
      forceComponentUpdateCounter:0,
      viewMode: "developpement",
      strict: true,
      plugins: [createPersistedState()]

   };
};

export default new Vuex.Store({

   state: {

      
      navbarModel: "",
      activedNavbar: ""
      , mailpresent: ''
      , PasswordRequire: ''

      /* corresponding user email  ex:
         baptiste.oger@supagro.fr (userId:14 userId:47 )  
         Toto@tu.ti (userId:35), 
         Pichon.leo@gmail.com (userId:35)
      */
      , loggedUserEmail: ""

      // user e-mail in demo mode (for visitor)
      , demoUserEmail:""

      // MonitoredUser Object computed and reorganised logged-in user data pour from the database 
      , userDataObj: null // in a component call: this.$store.state.userDataObj

      // selected index mapping to the MonitoredParcel object in state.userDataObj.parcels[selectedYearIdx] 
      , selectedParcelIdx: 0

      // selected index mapping to the MonitoredYear state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx]
      , selectedYearIdx: 0

      // selected index mapping to the MonitoredWeek state.userDataObj.parcels[selectedYearIdx].parcelYears[selectedYearIdx].yearWeeks[selectedWeekIdx]
      , selectedWeekIdx: 0 // 

      , userModifiedWeekMetrics: new Map()

      , forceComponentUpdateCounter:0

      , viewMode: "developpement" // viewMode in debug, developpement, production

      , strict: true

      , plugins: [createPersistedState()]

   },




   // userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]
   getters: { // computed methods

      getDisplayedUserEMail: (state) => {
         if (state.demoUserEmail) {
            return "visiteur.demo@apex-territoire.fr"
         } else {
            return state.loggedUserEmail
         }
      },

      getDisplayedUserName: (state) => {
         if (state.demoUserEmail) {
            return "Visiteur"
         } else {
            if(state.userDataObj)
               return state.userDataObj.userName
            else
               return "No userName"
         }
      },

      getDisplayedUserNameIfNeeded: (state) => (email,name)=>{
         if (state.demoUserEmail) {
            if(email===state.demoUserEmail){
               return "Visiteur"
            } 
         } 
         return name;
      },


      parcelNameList: (state) => {
         if (state.userDataObj !== null) {
            if (state.userDataObj.parcels !== null) {
               return state.userDataObj.parcels.map(parcel => parcel.parcelName)
            }
         } else {
            return [];
         }
      },



      yearNumberList: (state) => {
         if (state.userDataObj !== null
            && state.userDataObj.parcels[state.selectedParcelIdx] !== null) {
            return state.userDataObj.parcels[state.selectedParcelIdx].parcelYears.map(year => year.yearNumber)
         } else {
            return [];
         }
      },

      weekLabelList: (state) => {
         if (state.userDataObj !== null
            && state.userDataObj.parcels[state.selectedParcelIdx] !== null
            && state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx] !== null
            && state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx].yearWeeks !== null
         ) {

            return state.userDataObj
               .parcels[state.selectedParcelIdx]
               .parcelYears[state.selectedYearIdx]
               .yearWeeks.map(week => week.weekLabel)
         } else {
            return [];
         }
      },

      getParcelIdx: (state) => (parcelName, dataOwnerEMail) => {
         if (state.userDataObj !== null) {
            return state.userDataObj.parcels.findIndex(p => (p.parcelName === parcelName && p.dataOwnerEMail === dataOwnerEMail))
         } else {
            return null;
         }

      },

      getYearIdx: (state) => (yearNumber) => {
         if (state.userDataObj !== null) {
            // recall that  all parcels in userDataObj  are uniform and have equal list of sorted years
            return state.userDataObj.parcels[0].parcelYears.findIndex(y => y.yearNumber === yearNumber);
         } else {
            return -1;
         }
      },

      getWeekIdx: (state) => (weekNumber) => {
         if (state.userDataObj !== null) {
            // recall that  all years in userDataObj are uniform and have equal list of sorted weeks
            return state.userDataObj.parcels[0].parcelYears[0].yearWeeks.findIndex(w => w.weekNumber === weekNumber);
         } else {
            return -1;
         }
      },


      getSelectedWeekMetric: (state, getters) => {
         return getters.getWeekMetric(state.selectedParcelIdx, state.selectedYearIdx, state.selectedWeekIdx)
      },

      getWeekMetric: (state) => (pIdx, yIdx, wIdx) => {

         let pIdx_yIdx_wIdx_mapkey = `pIdx:${pIdx} yIdx:${yIdx} wIdx:${wIdx}`;

         // console.log("pIdx_yIdx_wIdx_mapkey")
         // console.log(pIdx_yIdx_wIdx_mapkey);

         if (state.userModifiedWeekMetrics.has(pIdx_yIdx_wIdx_mapkey)) {

            // console.log("modified week metrics");
            // console.log(state.userModifiedWeekMetrics.get(pIdx_yIdx_wIdx_mapkey));

            return state.userModifiedWeekMetrics.get(pIdx_yIdx_wIdx_mapkey);
         } else {

            state.userDataObj.parcels[state.selectedParcelIdx].parcelYears[state.selectedYearIdx]
            let date = new Date(state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekFullDate);

            let weekmetric = {
               dataUserEMail: state.userDataObj.userEMail
               , dataOwnerEMail: state.userDataObj.parcels[pIdx].dataOwnerEMail
               , parcelName: state.userDataObj.parcels[pIdx].parcelName
               , yearNumber: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearNumber
               , weekNumber: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNumber
               , nbObsFullGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsFullGrowth
               , nbObsSlowGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsSlowGrowth
               , nbObsStoppedGrowth: state.userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekNbObsStoppedGrowth
               , dateTimeInMs: date.getTime()
               , modified: false
            }

            //   console.log("initially computed week metrics");
            //   console.log(weekmetric);

            return weekmetric;

         }

      },



      getSelectedWeekMetricTotalNbObs: (state, getters) => {
         return getters.getTotalNbObs(state.selectedParcelIdx, state.selectedYearIdx, state.selectedWeekIdx)
      },


      getTotalNbObs: (state, getters) => (pIdx, yIdx, wIdx) => {

         let week_metric = getters.getWeekMetric(pIdx, yIdx, wIdx);
         let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
         let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
         let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

         return nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;

      },

      getSelectedWeekMetricAvgGrowth: (state, getters) => {
         return getters.getAvgGrowth(state.selectedParcelIdx, state.selectedYearIdx, state.selectedWeekIdx);
      },

      getAvgGrowth: (state, getters) => (pIdx, yIdx, wIdx) => {

         let week_metric = getters.getWeekMetric(pIdx, yIdx, wIdx);
         let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
         let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
         let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

         let totalNbObs = nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;
         if (totalNbObs == 0) {
            return 0;
         } else {
            return Math.round((nbObsFullGrowth + nbObsSlowGrowth * 0.5) * 100 / totalNbObs)/100.0;
         }

      },

      getSelectedWeekMetricHydricConstraint: (state, getters) => {
         return getters.getHydricConstraint(state.selectedParcelIdx, state.selectedYearIdx, state.selectedWeekIdx);
      },

      getHydricConstraint: (state, getters) => (pIdx, yIdx, wIdx) => {

         let week_metric = getters.getWeekMetric(pIdx, yIdx, wIdx);
         let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
         let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
         let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

         let nbTotalObs = nbObsFullGrowth + nbObsSlowGrowth + nbObsStoppedGrowth;
         let prctFullGrowth = 0
         let prctSlowGrowth = 0
         let avgGrowth =0

         if (nbTotalObs > 0) {
            prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100)
            prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100)
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

         if (nbTotalObs == 0) {
            return 0;
         } else {
            return hydricConstraint;
         }

      }



   },

   mutations: { // synchronous  commit of changes of state

      RESET: state => {
         Object.assign(state, getDefaultState());
      },

      initNavbarModel(state, navbarModel) {
         state.navbarModel = navbarModel;
      },

      initActivedNavbar(state, activedNavbar) {
         state.activedNavbar = activedNavbar;
      },

      initPasswordRequire(state, PasswordRequire) {
         state.PasswordRequire = PasswordRequire;
      },

      initmailpresent(state, mailpresent) {
         state.mailpresent = mailpresent;
      },

      initLoggedUserEmail(state, userMail) {
         state.loggedUserEmail = userMail;
      },

      initDemoUserEmail(state, userMail) {
         state.demoUserEmail = userMail;
      },

      // in component uses: this.$store.commit("initUserDataObj", usrDataObj);
      initUserDataObj(state, usrDataObj) {
         state.userDataObj = usrDataObj;
      },

      // TODO chack that pIdx is not out of range
      updateSelectedParcelIdx(state, pIdx) {
         state.selectedParcelIdx = pIdx;

         console.log(" store updated state.selectedParcelIdx " + state.selectedParcelIdx)
      },

      // in a component uses:  this.$store.commit("changeSelectedYear", yearNumber);
      updateSelectedYearIdx(state, yIdx) {
         state.selectedYearIdx = yIdx;

         console.log(" store updated state.selectedYearIdx " + state.selectedYearIdx)
      },

      updateSelectedWeekIdx(state, wIdx) {
         state.selectedWeekIdx = wIdx;

         console.log(" store updated state.selectedWeekIdx " + state.selectedWeekIdx)
      },

      incrementForceComponentUpdateCounter(state){
         state.forceComponentUpdateCounter=  state.forceComponentUpdateCounter +1;
      }
   },

   actions: { // assynchronous commit of changes
      login({ commit }, { loggedUserEmail }) {

         commit('initLoggedUserEmail', loggedUserEmail);
         


      },

      logout: ({ commit }) => {
         commit('RESET', '');
      },

      async initUserModifiedWeekMetrics({state}){
         // console.log('START DISPATCH initUserModifiedWeekMetrics')

         let modifiedWeekMetricsDBrows = await ApexDataServices.sendToModifiedWeekMetrics(
            {
               transaction: "select_modifiedweekmetrics",
               dataUserEMail: state.userDataObj.userEMail
            }
         )

         // console.log("modifiedWeekMetricsDBrows");
         // console.log(modifiedWeekMetricsDBrows)

         for (let row of modifiedWeekMetricsDBrows) {

            // let pIdx <=> getters.getParcelIdx(row.parcelName, row.dataOwnerEMail); unfortunately  getters are not accessible
            let pIdx = state.userDataObj.parcels.findIndex(p => (p.parcelName === row.parcelName && p.dataOwnerEMail === row.dataOwnerEMail))

            // let yIdx <=> getters.getYearIdx(row.yearNumber) unfortunately  getters are not accessible
            let yIdx = state.userDataObj.parcels[0].parcelYears.findIndex(y => y.yearNumber === row.yearNumber);

            // let wIdx = getters.getWeekIdx(row.weekNumber) unfortunately  getters are not accessible
            let wIdx = state.userDataObj.parcels[0].parcelYears[0].yearWeeks.findIndex(w => w.weekNumber === row.weekNumber);

            // WARNING TO DO NOT DEFINE OBJECT EQUALITY each key in modifiedWeekMetrics map is a composed String
            row.modified = true;

            state.userModifiedWeekMetrics.set(`pIdx:${pIdx} yIdx:${yIdx} wIdx:${wIdx}`, row)
            //

         }

         console.log("state.userModifiedWeekMetrics")
         console.log(state.userModifiedWeekMetrics)
         // console.log('END DISPATCH initUserModifiedWeekMetrics' )
      },

      async saveSelectedWeekMetric({state}, week_metric) {

         // console.log("START saveSelectedWeekMetric");
         // console.log("weekNumber: "+week_metric.weekNumber + " nbObsFullGrowth: "+week_metric.nbObsFullGrowth + " dateInMS: "+week_metric.dateTimeInMs )

         // WARNING NOTE THAT  week_metric should corresponds to the result of state.getters.getSelectedWeekMetric
         // Weird things in vuex we connot acces getters from mutations
         week_metric.modified = true;

         
         // console.log(`inserted to userModifiedWeekMetrics key pIdx:${state.selectedParcelIdx} yIdx:${state.selectedYearIdx} wIdx:${state.selectedWeekIdx}`)
         // console.log(`before insertion userModifiedWeekMetrics`)

         // local recording
         // for( let [k,v] of state.userModifiedWeekMetrics ){
         //    console.log("k: "+k+" v:");
         //    console.log(v);
         // }
         
         state.userModifiedWeekMetrics.set(`pIdx:${state.selectedParcelIdx} yIdx:${state.selectedYearIdx} wIdx:${state.selectedWeekIdx}`, week_metric)
         if(state.demoUserEmail){
            console.log(" saveSelectedWeekMetric: update are kept only for the time of the user session");
            return
         }

         // console.log(`after insertion userModifiedWeekMetrics`)
         // for( let [k,v] of state.userModifiedWeekMetrics ){
         //    console.log("k:"+k+" v:");
         //    console.log(v);
         // }

         // console.log("state.userModifiedWeekMetrics");
         // console.log(state.userModifiedWeekMetrics);

         // record in database
         week_metric.transaction = "alter_modifiedweekmetrics";
         ApexDataServices.sendToModifiedWeekMetrics(week_metric).then(res => {
            console.log("Inserted or Updated affectedRows in TABLE modifiedWeekMetrics"+ res);
         });

         // console.log("END saveSelectedWeekMetric");
      },

      async deleteSelectedWeekMetric({state}, week_metric) {

         // console.log("START deleteSelectedWeekMetric ");
         // console.log(week_metric);
         // WARNING NOTE THAT week_metric should corresponds to the result of getter.getSelectedWeekMetric
         // Weird things in vuex we cannot acces getters from mutations

      
         if (week_metric.modified) {

            state.userModifiedWeekMetrics.delete(`pIdx:${state.selectedParcelIdx} yIdx:${state.selectedYearIdx} wIdx:${state.selectedWeekIdx}`, week_metric)

            if(state.demoUserEmail){
               console.log(" deleteSelectedWeekMetric: delete are considered only for the time of the user session");
               return
            }

            week_metric.transaction = "delete_modifiedweekmetrics";
            ApexDataServices.sendToModifiedWeekMetrics(week_metric).then(res => {
               console.log("Deleted affectedRows in TABLE modifiedWeekMetrics"+ res);
            });

            // console.log("CONFIRM delete ");
            // console.log(state.userModifiedWeekMetrics);

         } else {
            console.log(" week metric have not been modified it will deleted userModifiedWeekMetrics or in BD ");
         }



      }
   }
});

/*

userDataObj is MonitoredUser Ojject

userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]

MonitoredUser(uEMail,uId, uName) {
        this.userEMail = uEMail;
        this.userId = uId;
        this.userName = uName;
        parcels= [];

        this.toString = () => `user: email ${this.userEMail} id: ${this.userId} name ${this.userName}`;
}

 MonitoredParcel(pName, ownerEMail, ownerName, ownerId, pCoord) {
        this.parcelName = pName;

        this.dataOwnerEMail = ownerEMail;
        this.dataOwnerName = ownerName;
        this.dataOwnerId = ownerId;

        this.parcelCoord = pCoord;
        this.parcelYears = [];

        this.toString = () => 'parcel: ' + this.parcelName;
}

MonitoredYear{
        this.yearNumber = yNumber;
        this.yearWeeks = [];
        this.toString = function () { return `year: ${this.yearNumber}`; };
    }

MonitoredWeek{

        this.weekNumber = 0 ;
        this.weekLabel = ""; // e.g. 10/02 - 17/02
        this.weekFullDate = new Date();
        this.weekSessions = [];


        this.weekNbObservations = 0;

        this.weekNbObsFullGrowth = 0;
        this.weekNbObsSlowGrowth = 0;
        this.weekNbObsStoppedGrowth = 0;

        this.weekPrctFullGrowth = 0.0;
        this.weekPrctSlowGrowth = 0.0;
        this.weekPrctStoppedGrowth = 0.0;

        this.weekAVGrowth = 0;

        this.weekICApex = 0;
}



 */