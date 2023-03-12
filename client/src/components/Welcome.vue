<template>
  <div
    class="global"
    style="background-image:url(images/2-Vignoble-Herault-Apex-jackmac34-Pixabay-LDD-1367095-1920x1285px.jpg) ;background-size: 2200px 800px;padding:30px;margin: 1px;height: 800px"
  >
  <div id="title"><h1>ApeX Territoire</h1></div>

     <div id="btnVisiteur">
          <button @click="continueToNextStep()" class="btn btn-secondary btn-block"  style="width:120px;">
              <b-avatar  size="100px"><img src="images/3.png"/>
              </b-avatar>
            <span><b>Visiteur</b></span>
          </button>
         
         
    </div>

    <div id="btnUtilisateur">
    <router-link class="btn btn-secondary btn-block" to="/login" style="margin-top:15px; width:120px; ">
      <b-avatar  size="100px" ><img src="images/utilisateur.png"/>
      </b-avatar><b>Utilisateur</b></router-link>
          <p>{{ msg }}</p>
    </div>
     

    <div id="btnGuide">
      <b-button id="btnGuide" class="bg-secondary" style="opacity:90%" v-b-toggle.sidebar-footer><b-icon-book></b-icon-book>
        <span><b> Mode d'emploi</b></span></b-button>
    </div>
    <b-sidebar id="sidebar-footer" aria-label="Sidebar with custom footer" no-header shadow>
      <template v-slot:footer="{ hide }">
        <b-button size="sm" @click="hide">Fermer</b-button>
      </template>
      <div class="px-3 py-2" style="font-size:small;">
        
      
        
        <h5>Guide d'utilisation Apex Territoire</h5>

        
        
          
        <router-link to="/map" class="nav-link">Carte</router-link>
        <p style="text-align:center"> 
          <b> Localiser par des icônes, à la fois, les parcelles observées par l'utilisateur et les parcelles pour lesquelles l'utilisateur est destinataire d'un partage d'observations</b><br/>
        </p>
        <p>
          <b> * Sélectionner une campagne, une semaine  </b> à l'aide des menus de contrôle situés en haut de page pour recentrer la carte sur une parcelle d'intérêt. <br/>
          
          <b> * Accéder aux informations résumés sur la croissance des Apex </b>  en cliquant sur l'icone représentant la parcelle. Chaque icone localisée sur la carte prend une couleur du vert pale au vert foncé en fonction de son indice de croissance, ou grise si il n y a pas d observations.<br/>
          
          
          <b> *  Comparer la croissance des Apex de la campagne précédente </b>  en passant le curseur sur le bouton campagne précédente. <br/>
          
          <b> * Visualiser les indicateurs de croissance de la parcelle </b> pour la semaine et la campagne séletionnées, dans le panneau de droite.
          Ces indicateurs de croissance  proviennent de l'application Apex Vigne et sont instantannément recalculés en fonction des nouvelles données mises-à-jour par l'utilisateur.
        </p>

        <router-link  to="/edit" class="nav-link">Editer</router-link>

        <p style="text-align:center"> 
          <b> Ajouter ou  mettre à jour le résumé des observations  sur l'état des Apex   collectées dans les parcelles </b>
        </p>
        <p>
          Les informations mises à jour peuvent concerner à la fois, les résumés d'observations collectées par l'utilisateur, ou encore
          les résumés d'observations reçus d'autres utilisateurs.
          Les mises à jour effectuées par un utilisateur sur les résumés d'observations reçus restent privées.
          Les mises à jour concernant les résumés d'observations collectés par l'utilisateur sont visibles aux autres utilisateurs destinataires d'un partage d'information sur la parcelle.
          En cliquant sur <b>Réinitialiser</b>, tout utilisateur a la posibilité d' <b> effacer ses mises à jour afin de retrouver les résumés d'observations initialement collectées </b>.
        </p>


        <router-link  to="/partage" class="nav-link">Partager</router-link>

        <p style="text-align:center"> 
          <b>  Partager les observations collectées par un utilisateur sur une parcelle  avec un autre utilisateur </b>
        </p>
        <p>
          Les observations partagées ne concernent que le résumé des observations qui ont été collectées sur le terrain avec l'application Apex Vigne et éventuellent mises-à-jour avec ApeX Territoire.
          Afin de controler le partage d'observations entre utilisateurs, un utilisateur ne peut partager que les résumés des observations qu'il a lui meme collecté.
          Un utilisateur ne peut pas re-partager les résumés d'observations qu'il a reçu d'un autre utilisateur.
          Un utilisateur peut décider d'<b>arrêter le partage des informations sur une parcelle avec un autre utilisateur </b> en cliquant sur supprimer.
          
        </p>

        <router-link  to="/partage" class="nav-link">Exporter</router-link>
        
        <p style="text-align:center"> 
          <b>Exporter au format pdf ou csv les résumés d'observations collectés et reçus par l'utilisateur</b>
        </p>
        <p>
          Les résumés d'observations se composent les indicateurs de croissances des apex et de contraintes hydriques d'une campagne sélectionnée.
          L'export de données présente en plus dans un tableau récapitulatif contenant la valeur de tous les indicateurs calculés pour chaque semain de la campagne.
        </p>
         
        <router-link  to="/profil" class="nav-link">Authentification</router-link>

        
        <p>
          <b> Protéger l'accès aux données de l'utilisateur </b> par un mot de passe. 
          Cette fonctionalité accompagne le partage des résumés d'observations collectées par les utilisateurs.
        </p>

      


        
       
      </div>
    </b-sidebar>

    


    <div id="objective" class="card bg-secondary text-white" style="opacity:90%">
      
      <div class="card-body" >
        <p>
          <b>ApeX Territoire : Visualiser la croissance végétative à l’échelle du territoire</b>
        </p>
        <p>
          ApeX Territoire est une application vitrine permettant de visualiser des observations collectées à l’aide d’ApeX-Vigne. ApeX-Vigne est une application mobile gratuite développée par l’Institut Français de la Vigne et du vin et l’institut Agro permettant de suivre l’évolution de la croissance végétative de la vigne et d’estimer le niveau de contrainte hydrique. Elle est basée sur la méthode des apex, une méthode simple pour caractériser la croissance végétative de la vigne. Basée sur l’observation de l’extrémité des rameaux, les apex, elle est couramment utilisée au vignoble par les techniciens, particulièrement en région méditerranéenne, où l’on essaye de relier l’arrêt précoce de la croissance à des niveaux de contrainte hydrique importants.
        </p>
        <p>
          ApeX Territoire propose une visualisation géolocalisée des indicateurs de croissance des apex et une analyse spatio-temporelle de leur croissance observée dans les parcelles de vignes. Cette application vitrine permet d’ajouter, de mettre à jour, de partager et d’exporter les résumés de ses observations. L’application est conçue pour une utilisation sur ordinateur, mobile et tablette. Apex Territoire fait partie des démonstrateurs de la vitrine numérique #DigitAg.
        </p>
        <b> contact: leo.pichon@supagro.fr </b>

        <p>Développeur(s) : Vincent Armant et Amin Ouail, INRAE</p>
      </div>
    </div>
      


        <div v-if="authorizedToContinue" id="chargement">
          <p> 
            <b style="color:white;">Chargement</b> 
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
          </p>
        </div>
      </div>
   
</template>
<script>
import ApexDataServices from "../services/ApexDataServices";
export default {
  data() {
    return {
      EMail: "",
      msg: "",
      message: "",
      password: "",
      activedNavbar: "",
      mailpresent: "",
      PasswordRequire: "",

      authorizedToContinue:false,
      userInfo: null
    };
  },

  methods: {
    

    async continueToNextStep() {
      if (this.EMail === "") {

        let loggedUserEmail = "visiteur.demo@apex-territoire.fr"; // baptiste.oger@supagro.fr visiteur.demo@apex-territoire.fr
        this.authorizedToContinue =true

        this.$store.commit("initDemoUserEmail", loggedUserEmail);
        await this.initLoggedUserIfNeeded(loggedUserEmail)
        await this.loadUserData(loggedUserEmail);

        console.log("Routing to map");
        this.$router.push("/map");
      
      } else {
        let loggedUserEmail = this.EMail;

        await this.initLoggedUserIfNeeded(loggedUserEmail)

        // userInfo ={
        //     userEMail:loggedUserEmail,
        //     userName:loggedUserEmail,
        //     userId: -1,
        //     userExistsInUserTable :false,
        //     userExistsInAuthTable: false,
        //     userRequiredPassword:false,
        // };

        if(this.userInfo.userExistsInAuthTable){

          if(!this.userInfo.userRequiredPassword){
            this.authorizedToContinue =true
            await this.loadUserData(loggedUserEmail);
            console.log("Routing to ApexMap");
            this.$router.push("/map");
          }else{
            // document.getElementById("div1").style.display = "none";
            // document.getElementById("p").style.display = "none";
            let PasswordRequire = "true";
            this.$store.commit(
              "initPasswordRequire",
              PasswordRequire
            );
          }
          
        }else{

          if(this.userInfo.userExistsInUserTable){

            // await this.loadUserData(loggedUserEmail)
            // document.getElementById("div1").style.display ="none";
            // document.getElementById("p").style.display = "none";
            let mailpresent = "true";
            this.$store.commit("initmailpresent", mailpresent);
            let mailad = await ApexDataServices.mailAddToAuth(loggedUserEmail,this.userInfo.userName)
            if (mailad) {
              console.log(" mail added to authentification");
            } else {
              console.log("WARNING mail NOT added to authentification");
            }
         }else{
           this.msg = "mail inconnu, vérifier que le mail est enregistré dans ApeX Vignes";
         }
        }

      }
    },


    async initLoggedUserIfNeeded(loggedUserEmail){
      if(!this.$store.loggedUserEmail){
        this.$store.commit("initLoggedUserEmail", loggedUserEmail);
      }
      
      if(!this.userInfo){
        this.userInfo = await ApexDataServices.getUserInfo(loggedUserEmail);
      }
      
    },

    async loadUserData(loggedUserEmail){

      console.log('loadUserData')

      await this.initLoggedUserIfNeeded(loggedUserEmail)

      console.log('this.userInfo')
      console.log(this.userInfo)

      let tmpUserDataObj = new ApexDataServices.MonitoredUser(
        this.userInfo.userEMail,
        this.userInfo.userId,
        this.userInfo.userName
      );

      console.log('tmpUserDataObj after userInfo')
      console.log(tmpUserDataObj)

      await ApexDataServices.addParcelObservations(tmpUserDataObj);


      console.log('tmpUserDataObj after addParcelObservations')
      console.log(tmpUserDataObj)

      await ApexDataServices.addSharedParcelObservations(tmpUserDataObj);

      console.log('tmpUserDataObj after addSharedParcelObservations')
      console.log(tmpUserDataObj)


      await ApexDataServices.addInitializedWeekMetrics(tmpUserDataObj);

      console.log('tmpUserDataObj after addInitializedWeekMetrics')
      console.log(tmpUserDataObj)


      ApexDataServices.addWeeksToUserDataObj(tmpUserDataObj);
      ApexDataServices.enforceConsistencyOfUserDataObj(tmpUserDataObj);
      ApexDataServices.sortUserDataObjByYearByWeek(tmpUserDataObj);

      this.$store.commit("initUserDataObj", tmpUserDataObj);

      console.log("updated $store.state.userDataObj: ");
      console.log(this.$store.state.userDataObj);

      await this.$store.dispatch("initUserModifiedWeekMetrics")
      
      this.$store.commit("initActivedNavbar", "true");

    },


      
    },
  
};
</script>

<style scoped>


h1{color:white;}

.global{text-align: center;margin-left: auto;margin-right: auto;padding: 5px;}
button {
  margin-top: 15px;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-top: 10px;
}
.col {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100%;
}


.card-body {  
  overflow-y: scroll; 
  width: 100%; 
  text-align: justify; 
  margin-top: 0px;
  font-size: small;
  }


#title{grid-area:ti;}
#btnVisiteur{grid-area: btnv; width: 100px; }
#btnUtilisateur{grid-area: btnu;width: 100px;}
#btnGuide{grid-area: btng;}



@media screen and (min-width: 900px) {
.global {
  display: grid;
  
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
 #title {
  grid-column: 2/9;
  grid-row: 1 ;
}
#btnVisiteur { 
  grid-column: 4;
  grid-row: 2 ;
}

#btnUtilisateur {
  grid-column: 6;
  grid-row: 2 ;
}

#btnGuide {
  grid-column: 5;
  grid-row: 3;
}

#objective{
  grid-column: 2/9;
  grid-row: 4/5;
}

#chargement{color: honeydew;font-size: 20px;
  grid-column: 2/9;
  grid-row: 6;
}}


@media screen and (max-width: 900px) {

.global {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows:  minmax(100px, auto);
}
 #title {
  grid-column: 2;
  grid-row: 1;
}
#btnVisiteur { 
  grid-column: 1;
  grid-row: 2;
}
#btnUtilisateur {
  grid-column: 3;
  grid-row: 2;
}

#btnGuide {
  grid-column: 2/3;
  grid-row: 3;
}

#objective{
  grid-column: 1/4;
  grid-row: 4;
}

#chargement{color: honeydew;font-size: 20px;
    grid-column: 2;
    grid-row: 5;
}





}

</style>
