<template>
  <div class="topnav" v-if="$store.state.activedNavbar">
    <div v-if="$store.state.navbarModel === 0">
      <router-link to="/map" class="nav-link"><img src="images/map.png"/> Carte</router-link>
      <router-link to="/edit" class="nav-link"><img src="images/pen1.png"/> Editer</router-link>
      <router-link to="/partage" class="nav-link"><img src="images/import.png"/> Partager</router-link>
      <router-link to="/export" class="nav-link"><img src="images/export.png"/> Exporter</router-link>
      <router-link to="/profil" class="nav-link"><img src="images/profil.png"/> Authentification</router-link>
      <router-link to="/guide" class="nav-link"><img src="images/guid.png"/>Mode d'emploi</router-link>
      <!--
      <router-link to="/legalMentions" class="nav-link"><img src=images/mention.png/>Mentions Légales</router-link>
      -->
       <a id="exit" class="nav-link" href @click="logout"><img src="images/exit.png"/> Déconnexion</a>
    </div>

    <div v-else>
      <b-navbar toggleable type="dark" variant="dark" style="width:100%">
        <b-navbar-brand href="#">Menu</b-navbar-brand>

        <b-navbar-toggle target="navbar-toggle-collapse">
          <template v-slot:default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        <b-collapse id="navbar-toggle-collapse" is-nav >
          <b-navbar-nav class="ml-auto">
          <b-nav-item href="#/map"><b-icon-map></b-icon-map> Carte</b-nav-item>
            <b-nav-item href="#/edit"><b-icon-pen></b-icon-pen> Editer</b-nav-item>
            <b-nav-item href="#/partage"><b-icon-box-arrow-in-up></b-icon-box-arrow-in-up> Partager</b-nav-item>
            <b-nav-item href="#/export"><b-icon-box-arrow-down></b-icon-box-arrow-down> Exporter</b-nav-item>
            <b-nav-item href="#/profil"><b-icon-person></b-icon-person>Authentification</b-nav-item>
            <b-nav-item href="#/guide"><b-icon-book></b-icon-book> Guide</b-nav-item>
            <!--
            <b-nav-item href="#/legalMentions"><b-icon-bookmark></b-icon-bookmark>Mentions Légales</b-nav-item>
            -->
            <b-nav-item href @click="logout"><b-icon-x-circle></b-icon-x-circle>Déconnexion</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  
  async created () {

if( window.innerWidth  < 900 ){
   let navbarModel = 1
   this.$store.commit("initNavbarModel", navbarModel);
    
} if( window.innerWidth >= 900 ){
   let navbarModel = 0
   this.$store.commit("initNavbarModel", navbarModel);
    
} 

 },
  methods: {

    logout() {
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
 @media screen and (min-width: 900px) {
.topnav {overflow: hidden;background-color: #333; width: 100%;}
.topnav a {float: left;display: block;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;}
#exit{float: right}
.topnav a:hover {background-color:rgb(165, 161, 161);color: black;}}

@media screen and (max-width: 900px) {
.topnav a {float: none;width: 35%;}
.topnav {overflow: hidden;background-color: #333; width: 100%;}
.topnav a {float: left;display: block;color: #f2f2f2;text-align: center;padding: 5px 5px;text-decoration: none;}

.topnav a:hover {background-color:rgb(165, 161, 161);color: black;}}





</style>
