<template>
  <div class="global">
    
      <hr />
      <h4 class="title" style="background-color:grey">
        Bonjour {{ $store.getters.getDisplayedUserName }}
      </h4>
      <hr />
      
      <!-- User Demo Guide-->
      <div v-if="$store.state.loggedUserEmail">
        
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

 
    </div>

</template>

<script>
export default {
  
  name: "Guide",
  

  created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
  },

  mounted() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }
  },

  methods: {},
};
</script>
<style scoped>
.global{padding: 5px;width: auto;height: auto;}
 .title {
    grid-area: tl;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    
    
  }

p{
  text-align: justify;padding-left: 40px;padding-right: 40px;
}
.nav-link{
  text-align: center;
}

</style>
