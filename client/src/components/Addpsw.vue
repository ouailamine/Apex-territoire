<template>
  <div class="global">
    <div class="col-md-12">
      <div class="card card-container">
        <form name="form">
          <h4>Ajouter un mot de passe</h4>
          <label for="mail"><b>Mail</b></label>
          <p>{{ $store.state.loggedUserEmail }}</p>
          <label for="password"><b>Password</b></label
          ><input
            type="password"
            class="form-control"
            placeholder="Password"
            v-model="password"
          />
          <label for="password-r"><b>Password repeat</b></label
          ><input
            type="password"
            class="form-control"
            placeholder="Password (repeat)"
            v-model="password_repeat"
          />
          <button
            id="buttoninsert"
            class="btn btn-primary btn-sm"
            @click="updatepws()"
            style="margin-top:10px;"
          >
            Modifier
          </button>
          <p>{{ msg }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import ApexDataServices from "../services/ApexDataServices";

export default {
  data() {
    return {
      mail: "",
      password: "",
      password_repeat: "",
      msg: "",
      UserEMail: "",
    };
  },
  async created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
  },
  methods: {
    async updatepws() {
      let password = this.password;
      let password_repeat = this.password_repeat;
      let userEMail = this.$store.state.loggedUserEmail;
      
      if (password === password_repeat) {
        this.msg = "";
        let pwdRequire =1;
        if (password === "" && password_repeat === "") {
          this.msg = "Le compte utilisateur sera accessible sans mot de passe";
          pwdRequire=0;
        }
        ApexDataServices.pwsadd({
          transaction: "alter_password",
          UserEMail: userEMail,
          password: password,
          passwordRequire: pwdRequire,
        }).then( ()=>{
         
          alert("L'authentification a bien été modifiée, retour à la carte")
          
          console.log("Routing to ApexMap");
          this.$router.push("/map");
        });

      } else {
        this.msg = "les mots de passe saisis ne sont pas identiques";
      }
      
      
    },
  },
};
</script>

<style scoped>
.global {
  background-color: rgb(46, 45, 45);
}
label {
  display: block;
  margin-top: 10px;
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
