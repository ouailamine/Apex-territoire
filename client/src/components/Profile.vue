<template>
  <div class="global">
    <br />
    <div class="menu">
      <hr />
      <h4 class="title" style="background-color:grey">
        Bonjour {{ $store.getters.getDisplayedUserName }}
      </h4>
      <hr />
      <p><b>Email:</b> {{ $store.getters.getDisplayedUserEMail }}</p>
      <div v-if="!$store.state.demoUserEmail">
        <router-link
          to="/addpsw"
          tag="button"
          class="btn btn-success btn-sm"
          style="margin-bottom:20px;"
          >Ajouter/Modifier un mot de passe
        </router-link>
      </div>
      <div v-else>
        {{ $store.getters.getDisplayedUserName }} ne peut pas changer ses données d'authentification
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},

  props: {
    userId: String,
  },

  computed: {},

  data() {
    return {};
  },

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
.global{padding: 10px;}
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
</style>
