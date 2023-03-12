<template>
  <div class="global">
    <div class="title">
      <hr />
      <h4>Bonjour {{ $store.getters.getDisplayedUserName }}</h4>
      <hr />
    </div>

    <div class="menu">
      <h5 id="menutitle">
        <b
          >Nouveau partage des observations collectées par
          {{ $store.getters.getDisplayedUserName }}
        </b>
      </h5>

     <div id="menuselect">
      <label ><b>Parcelle</b></label>
      <select
        v-model="parcelp"
        class="custom-select"
        style="width:auto;"
      >
        <option
          v-for="(pName, index) in parcelNameListObservedByLoggedUser"
          v-bind:item="pName"
          v-bind:key="index"
        >
          {{ pName }}
        </option>
      </select>
      </div>
      <div id="menuinput">
      <label id="labelinput" for="mail" style="margin-left : 10px"
        ><b>Mail Destinataire </b></label
      >
      <input id="input"
        v-model="mailp"
        type="text"
        name="mailp"
     
      /></div>
      <div id="btn">
      <button
        id="buttonverif"
        class="btn btn-info btn-sm"
        @click="checkEMailAndParcel()"
       
      >
        Vérifier
      </button>
      <button
        id="buttoninsert"
        class="btn btn-success btn-sm"
        @click="insertParcelDataSharedToSomn()"
        style="weight:auto;"
      >
        Ajouter
      </button>
     </div>
    </div>
    
<p>{{ message }}</p>
    <hr />
    <div class="body">
      <div class="obspartager">
        <h5>
          <b>
            Liste des observations partagées par
            {{ $store.getters.getDisplayedUserName }}
          </b>
        </h5>
        <table class="table-striped">
          <thead>
            <tr>
              <th>Observateur</th>
              <th>Destinataire</th>
              <th>Parcelle</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sharedParcelRow, index) in parcelRowsSharedToSomeone"
              v-bind:index="index"
              v-bind:key="index"
            >
              <td>{{ $store.getters.getDisplayedUserEMail }}</td>
              <td>{{ sharedParcelRow.dataUserEMail }}</td>
              <td>{{ sharedParcelRow.parcelName }}</td>
              <td>
                <button
                  @click="
                    deleteParcelDataSharedToSomn(
                      sharedParcelRow.dataOwnerEMail,
                      sharedParcelRow.dataUserEMail,
                      sharedParcelRow.parcelName
                    )
                  "
                  class="btn btn-danger btn-sm"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />

      <div class="obsrecu">
        <h5>
          <b>Liste des observations partagées par un autre utilisateur</b>
        </h5>
        <table class="table-striped">
          <thead>
            <tr>
              <th>Observateur</th>
              <th>Destinataire</th>
              <th>Parcelle</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(sharedParcelRow, index) in parcelRowsSharedBySomeone"
              v-bind:index="index"
              v-bind:key="index"
            >
              <td>{{ sharedParcelRow.dataOwnerEMail }}</td>
              <td>{{ $store.getters.getDisplayedUserEMail }}</td>
              <td>{{ sharedParcelRow.parcelName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
import ApexDataServices from "../services/ApexDataServices";

export default {
  name: "App",
  components: {},

  data() {
    return {
      dataOwnerEMail: "",
      dataUserEMail: "",
      parcelName: "",
      date: "",
      userDataObj: [],
      userDBRows: [],
      error: "",
      text: "",
      pIdx: 0,
      yIdx: "",
      wIdx: "",
      message: "",
      parcelp: "",
      mailp: "",
      parcelRowsSharedToSomeone: [],
      parcelRowsSharedBySomeone: [],
    };
  },

  async created() {
    if (!this.$store.state.loggedUserEmail) {
      this.$router.push("/");
    }

    try {
      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.state.loggedUserEmail,
        }
      );

      console.log("parcelRowsSharedToSomeone");
      console.log(this.parcelRowsSharedToSomeone);

      this.parcelRowsSharedBySomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          userEMail: this.$store.state.loggedUserEmail,
        }
      );

      console.log("parcelRowsSharedBySomeone");
      console.log(this.parcelRowsSharedBySomeone);
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  },

  computed: {
    parcelNameListObservedByLoggedUser() {
      if (this.$store.state.userDataObj !== null) {
        if (this.$store.state.userDataObj.parcels !== null) {
          return this.$store.state.userDataObj.parcels.map((parcel) => {
            if (
              parcel.dataOwnerEMail === this.$store.state.userDataObj.userEMail
            ) {
              return parcel.parcelName;
            }
          });
        }
      }
      return [];
    },
  },

  methods: {
    async checkEMailAndParcel() {
      this.message = "";

      return new Promise((resolve, reject) => {

        if(this.$store.state.demoUserEmail){
          this.message = this.$store.getters.getDisplayedUserEMail
          +" n'est pas authorisé à ajouter de nouveaux partages"
          resolve(false)
        }else{
          let mailAndParcelAlreadyShared = false;
          for (let parcelDataSharingRow of this.parcelRowsSharedToSomeone) {
            if (
              parcelDataSharingRow.dataOwnerEMail ===
                this.$store.state.loggedUserEmail &&
              parcelDataSharingRow.dataUserEMail === this.mailp &&
              parcelDataSharingRow.parcelName === this.parcelp
            ) {
              
              this.message =
                "Les informations de la parcelle sont déjà partagées avec l'utilisateur";
              mailAndParcelAlreadyShared =true;
            }
          }
            if(mailAndParcelAlreadyShared){
              resolve(false)
            }else{
            try {
              ApexDataServices.checkEMail(this.mailp).then((emailIsvalid) => {
                if (emailIsvalid === true) {
                  if (this.parcelp) {
                    this.message = "La parcelle et le mail sont valides";
                    this.parcelName = this.parcelp;
                    resolve(true);
                  } else {
                    this.message = "Choisir la parcelle";
                    resolve(false);
                  }
                } else {
                  this.message = "Mail non valide";
                  this.parcelName = "";
                  resolve(true);
                }
              });
            } catch (err) {
              reject(err);
            }
          }
        }
      });
    },

    async insertParcelDataSharedToSomn() {

      if(this.$store.state.demoUserEmail){
        this.message = this.$store.getters.getDisplayedUserName
        +" n'est pas authorisé à ajouter de nouveaux partages, connectez-vous en tant qu'utilisateur"
        return
      }
      console.log("START insertParcelDataSharedToSomn");

      let mailAndParcelAreValid = await this.checkEMailAndParcel(this.mailp);

      console.log("mailAndParcelAreValid " + mailAndParcelAreValid);

      if(mailAndParcelAreValid){
        
        let resInsert = await ApexDataServices.sendToParcelDataSharing({
          transaction: "insert_parceldatasharing",
          dataUserEMail: this.mailp,
          dataOwnerEMail: this.$store.state.userDataObj.userEMail,
          parcelName: this.parcelp,
        });

        console.log("res insert_parceldatasharing ")
        console.log(resInsert);

        this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
          {
            transaction: "select_parceldatasharing",
            ownerEMail: this.$store.state.userDataObj.userEMail,
          }
        );

        this.message = "La parcelle et le mail destinataire ont été ajoutés";
      }

      console.log("END insertParcelDataSharedToSomn");
    },

    async deleteParcelDataSharedToSomn(OwnerEMail, UserEMail, parcelName) {

      if(this.$store.state.demoUserEmail){
        this.message = this.$store.getters.getDisplayedUserName+" n'est pas authorisé à supprimer les informations de partage"
        return
      }

      await ApexDataServices.sendToParcelDataSharing({
        transaction: "delete_parceldatasharing",

        dataUserEMail: UserEMail,
        dataOwnerEMail: OwnerEMail,
        parcelName: parcelName,
      });

      this.parcelRowsSharedToSomeone = await ApexDataServices.sendToParcelDataSharing(
        {
          transaction: "select_parceldatasharing",
          ownerEMail: this.$store.state.userDataObj.userEMail,
        }
      );
    },
  },

  watch: {
    selectedParcelIdx: function(val) {
      this.$store.commit("updateSelectedParcelIdx", val);
    },
  },
};
</script>
<style scoped>
label{margin-right: 10px;}
  .menu {
    grid-area: me;
    text-align: center;
    margin-right: auto;
    margin-left: auto;
  }
  .body {
    grid-area: bd;
    margin-top: 20px;
    
  }
  
  #menutitle {
    grid-area: mntl;
    margin-top: 20px;
    text-align: center;
  }
  
  #menuselect {
    grid-area: mnsl;
    position: relative;
  
  }
  
  #menuinput {
    grid-area: mnip; 
  }
  #labelinput{grid-area: lbin; }
  #input{grid-area: in; }
  
  #buttonverif {
    grid-area: btnvr;
    margin-right: 20px;
   margin-left: 20px;
  }
  #buttoninsert {
    grid-area: btnva;

  }

.title {
  grid-area: tl;
  margin-top: 0px;
}

.body {
  grid-area: bd;
  margin-top: 20px;
}
h4 {
  background: gray;
}
p {
 
  font-weight: bold;
  width: auto;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}
#btn{grid-area: btn;}

/*Phone*/
@media screen and (min-width: 900px) {
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "me"
      "p"
      "bd";
  }

  .menu{display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(3, 1fr,1fr,1fr);
    grid-template-rows: auto 1fr;
    grid-template-rows: repeat(2, 1fr,1fr);
    grid-template-areas:
      "mntl mntl mntl "
      "mnsl mnip btn";}

  table {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    border-collapse: collapse;
  }
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
}


@media screen and (max-width: 900px) {
  .body {
    grid-area: bd;
    margin-top: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  
  #menuselect {
    margin-top: 10px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  
  }
  
  #menuinput {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
   margin-bottom: 10px;
   display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "lbin in in"
      ;
  }

  #btn{margin-top: 20px;
    text-align: center;
    margin-left: auto;
     margin-right: auto;
  }
  .global {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-areas:
      "tl"
      "me"
      "p"
      "bd";
  }

  .menu {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: auto, 1fr;
    grid-template-rows: repeat(3, 1fr,1fr,1fr);
    grid-template-areas:
     "mntl"
     "mnsl"
    "mnip "
    "btn";
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tr {
    border: 1px solid #ccc;
  }
  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }
  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
  td:nth-of-type(1):before {
    content: "Emetteur";
  }
  td:nth-of-type(2):before {
    content: "Distinataire";
  }
  td:nth-of-type(3):before {
    content: "Parcelles";
  }
  td:nth-of-type(4):before {
    content: "Operation ";
  }
  
}
</style>
