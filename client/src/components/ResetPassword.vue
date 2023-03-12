<template>
  <div class="container" style="margin-bottom: 50px;margin-top:20px;">
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card card-default">
          <div class="card-header">Mot de passe oublie</div>
          <div class="card-body">
            <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
              <div class="form-group">
                  <label for="email">E-mail</label>
                  
              </div>
              <label v-if="$store.state.loggedUserEmail"> 
                {{$store.state.loggedUserEmail}}
              </label>

              <button type="submit" class="btn btn-primary">Réinitialiser le mot de passe </button>
            </form>
           
          </div>
           <p id="message"><b>{{message}}</b></p><p id="msg"><b>{{msg}}</b></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import ApexDataServices from '../services/ApexDataServices';
export default {
    data() {
      return {
        email: null,
        has_error: false,
        message:'',
        msg:''
       

      }
    },

    methods: {
      requestResetPassword() {
        console.log("START requestResetPassword");
        let loggedUserEmail = this.$store.state.loggedUserEmail
            
        console.log(loggedUserEmail);
              
        ApexDataServices.ResetPassword(loggedUserEmail).then(resetPass => {
          if(resetPass===true){
            console.log('Mot de passe envoyé')
            this.msg='Mot de passe envoyé'
            this.message=''
            alert("Mot de passe envoyé, Vous allez être réorienté vers la page d'accueil ")
            this.logout();
          }else{
              this.message='Mot de passe non envoyé'
              this.msg=''
              console.log('mot de passe non envoyé') }
        })
                          
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

}
</script>
<style>
#message{color:red}
#msg{color:green}
</style>