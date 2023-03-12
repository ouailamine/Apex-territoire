<template>
<div class="footer">
      <div class="icones">
        <!--
          <a href= "https://play.google.com/store/apps/details?id=ag.GB.apex&hl=en" target="_blank" class="btn-floating btn-sm btn-fb mx-1" ><i><img src=images/apexvignes.png class="icone" ></i></a>
        -->
        
        <a href= "https://www.montpellier-supagro.fr/ " target="_blank" class="btn-floating btn-sm btn-fb mx-1" ><i><img style="max-width: 12%" src="images/logoLInstitutAgro-MontpellierSupAgro.png"></i></a>
        <a href= "https://www.hdigitag.fr/fr/ " target="_blank" class="btn-floating btn-sm btn-fb mx-1" ><i><img src="images/logoDigitAg-reserve.png" ></i></a>
        <a href="http://www.inrae.fr" target="_blank" class="btn-floating btn-sm btn-fb mx-1"><i><img src="images/Logo-INRAE_Transparent.png"  target="_blank"></i></a>
        <a href= "https://muse.edu.umontpellier.fr/" target="_blank" class="btn-floating btn-sm btn-fb mx-1"><i><img src="images/Logo_MUSE.png"></i></a>
      </div>
      <div class="copyright ">
        Copyright &copy; 2020: <a href="https://inrae.fr" target="_blank">  www.inrae.fr </a> | <a href="https://www.hdigitag.fr/fr/" target="_blank"> www.hdigitag.fr</a> et <a  href="#/legalMentions" target="_blank">  Mentions Légales | Crédits | Confidentialité</a>
      </div>
</div>
</template>

<script>
  export default {
    name: 'Footer',
    components: {
    }
  }
</script>

<style scoped>

.copyright{background: black; padding: 5px;
  text-align: center;
  font-size: 11px;
  color: white;
  height: 30px;}
img {
  border-radius: 5%;
}
@media screen and (min-width: 900px) {  

.icones{background: gray;padding: 7px; height: 70px;}
.icones p {text-align:center;}
.icones img {max-width: 6%;margin-left: 100px;}
.icones img:hover {max-width: 12%;height: 70px;}
.icone{height: 40px;}}
.icone:hover{height: 60px;}

@media screen and (max-width: 900px) {
.icones{background: gray;padding: 7px; height: 70px;}
.icones p {text-align:center;}
.icones img {max-width: 9%;margin-left: 5px;}
.icone{height: 25px;}
.icones img:hover {max-width: 18%;height: 50px;margin-left: 5px;}
.icone :hover{height: 60px;}
}

</style>