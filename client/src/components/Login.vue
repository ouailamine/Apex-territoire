<template>
  <div
    class="login"
    style="background-image:url(images/2-Vignoble-Herault-Apex-jackmac34-Pixabay-LDD-1367095-1920x1285px.jpg) ;background-size: 2200px 800px;padding:30px;margin: 1px;"
  >
  <div><h1>ApeX Territoire</h1></div>
    <div class="col-md-12">
      <div class="card card-container">
        <!--
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />
        <h2>Login</h2>
        -->

        <center>
          <b-avatar  size="100px">
            <img src="images/utilisateur.png"/>
          </b-avatar>
        </center>

        <div class="form-group">
          
          <label for="EMail"><b>Mail</b></label>
          <input
            v-if="!$store.state.loggedUserEmail"
            v-model="EMail"
            type="text"
            class="form-control"
            name="EMail"
          />
          <label v-if="$store.state.loggedUserEmail"> 
            {{$store.state.loggedUserEmail}}
          </label>


          <p id="p" 
            v-if="!$store.state.loggedUserEmail"
            style="display:block">
             
          </p>
          <button

            v-if="!$store.state.loggedUserEmail"

            id="div1"
            @click="continueToNextStep()"
            class="btn btn-primary btn-block"
            style="display:block"
          >
          
            <span>Continuer</span>
          </button>
          <p>{{ msg }}</p>
        </div>

        <div class="form-group" v-if="$store.state.mailpresent">
          <label for="password"><b>Mot de passe</b></label>
          <p>Voulez vous enregistrer un mot de passe</p>
          <button @click="Oui" class="btn btn-primary btn-block">
            <span>Oui</span>
          </button>
          <button @click="Non" class="btn btn-primary btn-block">
            <span>Non</span>
          </button>
        </div>

        <div class="form-group" v-if="$store.state.PasswordRequire">
          <label for="password"><b>Mot de passe</b></label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            name="password"
          />
          <button @click="login()" class="btn btn-primary btn-block">
            <span>Se connecter</span>
          </button>

          <p>Mot de passe oublié <a href="#/resetp">cliquer ici</a></p>
          <p>{{ message }}</p>
        </div>

        <div
          v-if="authorizedToContinue"
        >
          <p> 
            <b>Chargement</b> 
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
            <b-spinner small label="Small Spinner" type="grow"></b-spinner>
          </p>
        </div>
      </div>
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
           this.msg = "mail inconnu, vérifier que le mail est enregistré dans ApeX Vigne";
           alert("Mail inconnu, vérifier que le mail est enregistré dans ApeX Vigne, vous allez être déconnecté")
           this.logout();
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
      try{
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
      }catch(error){
        this.logout()
      }
    },

    

    async Non() {
      let loggedUserEmail = this.EMail;
      this.authorizedToContinue =true
      await this.loadUserData(loggedUserEmail)
      console.log("Routing to ApexMap");
      this.$router.push("/map");
      
    },

    async Oui() {
      let loggedUserEmail = this.EMail;
      this.authorizedToContinue =true
      await this.loadUserData(loggedUserEmail)
      console.log("Routing to addpsw");
      this.$router.push("/addpsw");
    },

    async login() {
      try {
        let password = this.password;
        let loggedUserEmail = this.EMail;
        this.message =""
        // console.log("password");
        // console.log(password);

        this.authorizedToContinue = await ApexDataServices.checkPassword(password, loggedUserEmail)
        if (this.authorizedToContinue ) {
           this.message = "mot de passe valide";
          await this.loadUserData(loggedUserEmail)
          console.log("Routing to ApexMap");
          this.$router.push("/map");
          
        } else {
          console.log("mot de passe non valide");
          this.message = "mot de passe non valide";
        }
          
        
      } catch (error) {
        this.error = error.message;
      }
    },

    async logout() {
      this.$store.dispatch("logout");
      let mailpresent = "";
      this.$store.commit("initmailpresent", mailpresent);
      let PasswordRequire = "";
      this.$store.commit("initPasswordRequire", PasswordRequire);
      let activedNavbar = "";
      this.$store.commit("initActivedNavbar", activedNavbar);
      let navbarModel = 0;
      this.$store.commit("initNavbarModel", navbarModel);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>

h1{color:white;}

.login{text-align: center;margin-left: auto;margin-right: auto;padding: 5px;}
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
.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
