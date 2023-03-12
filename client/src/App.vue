<template>
  <div id="app">
    <div id="header " v-if="($router.currentRoute.path !== '/') && ($router.currentRoute.path !== '/login') ">
      <my-header />
    </div>

    <div id="navbar" v-if="$router.currentRoute.path !== '/'">
      <navbar />
    </div>

    <router-view />

    <div id="footer ">
      <my-footer />
    </div>
  </div>
</template>

<script>
import footer from "./components/Footer";
import header from "./components/Header";
import navbar from "./components/Navbar";

export default {
  name: "App",
  components: {
    "my-footer": footer,
    "my-header": header,
    navbar: navbar,
  },
};
</script>

<style>
#app {
  padding: 1px;
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1px;
}
#header {
  margin: 0px;
}
#footer {
  margin: 0px;
}
#navbar {
  margin: 0px;
}
</style>
