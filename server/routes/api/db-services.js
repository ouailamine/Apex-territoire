var express = require('express');
var router = express.Router();
var mailer = require("nodemailer");
var generator = require('generate-password');
const bcrypt = require('bcryptjs');
const mariadb = require('mariadb');
require('dotenv').config()
const { URL } = require('url');

const dbConnectionConfig = () => {

    let urlElmts;

    // Developpemnet mode
    if (process.env.DATABASE_URL){
        // in DEV DATABASE_URL="mysql://varmant:varmant@localhost:3306/agrotic_apex" 
        urlElmts = new URL(process.env.DATABASE_URL);
    }
    
    // Production mode
    if (process.env.CLEARDB_DATABASE_URL){ 
        // CLEARDB_DATABASE_URL="TO CREATE"
        urlElmts = new URL(process.env.CLEARDB_DATABASE_URL);
    }

    return {
        user: urlElmts.username,
        password: urlElmts.password,
        host: urlElmts.hostname,
        port: urlElmts.port,
        database: urlElmts.pathname.replace('/', '')
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function execQuery(queryTxt,params=[] ) {
    
    try {
        
        // console.log(dbConnectionConfig())
        let conn = await mariadb.createConnection(dbConnectionConfig())
        let rows = await conn.query(queryTxt, params);

        // console.log(rows);
        if(rows.affectedRows){
            console.log(rows);
        }else{
            console.log("Number of returned rows "+rows.length);
        }
        conn.end();
        return rows;
              
    } catch (err) {
        console.log(" RECONNECTION ")
        console.log(err)

        await delay(500); // wait 0.5 second to execute the code again

        let conn = await mariadb.createConnection(dbConnectionConfig())
        let rows = await conn.query(queryTxt, params);

        // console.log(rows);
        if(rows.affectedRows){
            console.log(rows);
        }else{
            console.log("Number of returned rows "+rows.length);
        }
        conn.end();
        return rows;

    }
}
//Recuperation du mot de passe oublie
router.post('/resetpassword', function(req, res, next) {

    let name ="";

    // const queryTxt = 'SELECT userName FROM authentification WHERE userEMail = "'+req.body.UserEMail+'"';
    // execQuery(queryTxt).then(rows => { 
    //    if (rows !== undefined) { 
    //         name = rows[0].userName
    //         console.log(name);}
            
    //         else{
    //             var name = ''
    //             console.log('no name')
    //         }
    // });
            
    var date = new Date();
             
    var password = generator.generate({
        length: 10,
        numbers: true
    });
   
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {return res.status(500).send({msg: err});} 
        else {
            let hashedPassword = hash  
            
            console.log("hashedPassword: "+hashedPassword);

            let pwdRequire = 1
            let queryTxt = 'UPDATE authentification  SET  password = "'+ hashedPassword+'",passwordRequire= "'+pwdRequire+'" ';

            queryTxt += 'WHERE userEMail = "'+escape(req.body.UserEMail)+'"';
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => res.json(rows));
        }            
    });

    var smtpTransport = mailer.createTransport("smtps://apex.inrae%40gmail.com:"+encodeURIComponent('apex2020') + "@smtp.gmail.com:465"); 
      var mail = {
       
        from: 'apex.inrae@gmail.com',
        to: req.body.UserEMail,
        subject: 'Mot de passe oublié',
        // HTML body
        html: `<p><b>Bonjour `+name+`  </b></p><br>
        <p> Votre mot de passe a bien été réinitialisé le `+date+`</p>
        <p> votre nouveau mot de passe est:<b>  `+password+`</b></p><br>
        <p><b>IMPORTANT </b>: Ce mot de passe vous permet de vous connecter à l'application ApeX Territoire.
        Nous vous invitons à le personnaliser lors de votre prochaine connexion.</p><br>
        <p>Cordialement</p><br>
        <p><b>Merci de ne pas répondre à ce message qui est généré automatiquement.</b></p>`,
        
       
        
      }
      
      smtpTransport.sendMail(mail, function(error, response){
        if(error){
          console.log("Erreur lors de l'envoie du mail!");
          console.log(error);
        }else{
          console.log("Mail envoyé avec succès!")
        }
        smtpTransport.close();
      });

});

// passeword login , ajout  et modiffication password
router.post('/password', function(req, res, next) {
    if (req.body.transaction === "check_passwordLogin") {
        const queryTxt = 'SELECT * FROM authentification WHERE userEMail = "'+req.body.UserEMail+'"';
        execQuery(queryTxt).then(rows => { 
           if (rows !== undefined) { 
                var hashedPassword = rows[0].password
                console.log("check_passwordLogin result form DB");
                // console.log(rows);
                bcrypt.compare(req.body.password,hashedPassword,(bErr, bResult) => {
                    if (bErr) {throw bErr}
                    if (!bResult) {
                        console.log(bResult),console.log('non pareil')
                    }
                    if (bResult) {
                        console.log('ok');
                        console.log(bResult);
                        res.json(bResult)
                    }else{
                        res.json(false)
                    }
                })
            }else{
                console.log('rows n existe pas')
                res.json(false)
            }
            // res.json(false)
        })
    }
                   
    if (req.body.transaction === "alter_password") { 
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {return res.status(500).send({msg: err});} 
            else {
                let hashedPassword = hash   
                let pwd = req.body.password === ''?null:'"'+hashedPassword+'"'
                let pwdRequire = req.body.password === ""?0:req.body.passwordRequire

                let queryTxt = 'UPDATE authentification  SET  password = '+ pwd+' ,passwordRequire= "'+pwdRequire+'" ';
                queryTxt += 'WHERE userEMail = "'+escape(req.body.UserEMail)+'"';
                console.log(queryTxt);
                execQuery(queryTxt).then(rows => res.json(rows));
            }            
    });
}})


//verification de l'existance  du mail et passeword dans la table authentification 
router.post('/checkAuth', function(req, res, next) {
        
     //verification de mail a auth
            if (req.body.transaction === "select_useremailAuth"){
                console.log(req.body)
            let useremail = req.body.userEMail.replace("'").replace('"');
            const queryTxt = 'SELECT userEMail, passwordRequire, userName FROM authentification WHERE userEMail = "'+useremail+'"';
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => {
                return res.json(rows)
                });
            }
            
    //ajout mail a auth
        if (req.body.transaction === "insert_userEmail") {
            console.log(req.body);
            pwd = req.body.password===null? null:"'" + req.body.password+"'";
            let queryTxt = `INSERT INTO authentification (userEMail, passwordRequire, password, userName) `;

            queryTxt += " VALUES ('"+req.body.userEMail+"', '" +req.body.passwordRequire+"',  " + pwd+",  '" + req.body.userName+"')";
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => res.json(rows));}
            
    //verification du passwordRequire
        if (req.body.transaction === "select_passwordRequireAuth"){
                console.log(req.body)
            let useremail = req.body.userEMail.replace("'").replace('"');
            const queryTxt = 'SELECT passwordRequire FROM authentification WHERE userEMail = "'+useremail+'"';
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => {
                return res.json(rows)
                });
            }
            
});


router.post('/login', function(req, res, next) {

    if (req.body.transaction === "select_useremail"){
        /*
        req.body = 
        {
	        "transaction": "select_useremail",
	        "userEMail": "baptiste.oger@supagro.fr"
        }
        */
       let useremail = req.body.userEMail
        const queryTxt = 'SELECT * FROM user WHERE email = "'+useremail+'"';
        
        console.log(queryTxt);

        execQuery(queryTxt).then(rows => {
            // console.log(rows);
            return res.json(rows)
        });

    }
});



router.get('/',  function(req, res, next) {

    if(req.query.userEMail === undefined){
        res.send(" Please define a userEMail to get request");
    }else{

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = '+req.query.userEMail;

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }
});

router.post('/', function(req, res, next) {

    // OBSERVATIONS

    if (req.body.transaction === "select_observations"){
 
        /*
         {
             "transaction": "select_observations",
             "userEMail": "baptiste.oger@supagro.fr"
         }
         */
       
        console.log(req.body);

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = "'+req.body.userEMail+'"';

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }

    if (req.body.transaction === "select_sharedobservations"){
 
        /*
         {
             "transaction": "select_sharedobservations",
             "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
         }
         */
       
        console.log(req.body);

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = "'+req.body.dataOwnerEMail+'"';
        queryTxt +=' and s.nomParcelle = "'+req.body.parcelName+'"';

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }

    // INITIALIZED WEEK METRICS

    if (req.body.transaction === "select_initializedweekmetrics"){
        
        console.log(req.body);

        let queryTxt;
        if(req.body.dataOwnerEMail && Object.keys(req.body).length==2 ){
            /*
            req.body = 
            {
                "transaction": "select_initializedweekmetrics",
                "dataOwnerEMail": "baptiste.oger@supagro.fr"
            }
            */

            queryTxt = " SELECT * FROM initializedweekmetrics WHERE dataOwnerEMail = '"+req.body.dataOwnerEMail+"'";;

        }

        if(req.body.dataOwnerEMail && req.body.parcelName){
            /*
            req.body = 
            {
                transaction: "select_initializedweekmetrics",
                , dataOwnerEMail: "baptiste.oger@supagro.fr"
                , parcelName: " dummy parcel"
            }
            */

           queryTxt = " SELECT dataOwnerEMail,"
           +" parcelName, parcelLat, parcelLng,"
           +" yearNumber, weekNumber,"
           +" nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth,"
           +" dateTimeInMs, userName as dataOwnerName"
           +" FROM initializedweekmetrics,  authentification"
           +" WHERE userEMail = dataOwnerEMail"
           +" and dataOwnerEMail = '"+req.body.dataOwnerEMail+"' and parcelName = '"+req.body.parcelName+"'";;
        }

        if(queryTxt){
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => res.json(rows));
        }
    }

    if (req.body.transaction === "alter_initializedweekmetrics") {
        /*
        req.body = 
        {
            "transaction": "alter_modifiedweekmetrics"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
            , "nbObsFullGrowth": 25
            , "nbObsSlowGrowth": 15
            , "nbObsStoppedGrowth": 10
            , "dateTimeInMs": 1585269934625
        }
        */

    //    console.log(req.body);

        let queryTxt = "INSERT INTO initializedweekmetrics (dataUserEMail, dataOwnerEMail, parcelName, yearNumber, weekNumber, nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth, dateTimeInMs) ";
        queryTxt += " VALUES ('"+req.body.dataUserEMail+"', '" +req.body.dataOwnerEMail+"',  '" + req.body.parcelName+"', " + req.body.yearNumber+", " + req.body.weekNumber+",  " + req.body.nbObsFullGrowth+", " + req.body.nbObsSlowGrowth+", " + req.body.nbObsStoppedGrowth+", " +  req.body.dateTimeInMs+")" 
                +" ON DUPLICATE KEY UPDATE"
                +" parcelLat = " +req.body.parcelLat
                +" parcelLng = " +req.body.parcelLng
                +" nbObsFullGrowth = " +req.body.nbObsFullGrowth
                +" , nbObsSlowGrowth = "+req.body.nbObsSlowGrowth
                +" , nbObsStoppedGrowth = "+req.body.nbObsStoppedGrowth
                +", dateTimeInMs = "+req.body.dateTimeInMs+" ;";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
            
    }

    if (req.body.transaction === "delete_initializedweekmetrics") {
        /*
        {
            "transaction": "delete_initializedweekmetrics"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
        }
        */
    //    console.log(req.body);
    
        const queryTxt ="DELETE FROM initializedweekmetrics WHERE" 
            "  dataOwnerEMail =  '"+req.body.dataOwnerEMail+"'"
            +" and parcelName = '" +req.body.parcelName+"'"
            +" and yearNumber = " +req.body.yearNumber
            +" and weekNumber = " +req.body.weekNumber ;
    
        console.log(queryTxt);
        
        execQuery(queryTxt).then(rows => res.json(rows));
    
    }




    // MODIFIED WEEK METRICS

    if (req.body.transaction === "select_modifiedweekmetrics"){
        

       console.log(req.body);
       let queryTxt = '';

       if(req.body.dataUserEMail && Object.keys(req.body).length==2){
           /*
        req.body = 
        {
	        "transaction": "select_modifiedweekmetrics",
	        "dataUserEMail": "baptiste.oger@supagro.fr"
        }
        */
        queryTxt = " SELECT * FROM modifiedweekmetrics WHERE dataUserEMail = '"+req.body.dataUserEMail+"'";
       }

       if(req.body.dataUserEMail 
            &&  req.body.dataOwnerEMail 
            && req.body.parcelName ){
            /*
                req.body = 
                {
                    "transaction": "select_modifiedweekmetrics",
                    "dataUserEMail": "baptiste.oger@supagro.fr"
                    "dataOwnerEMail": "baptiste.oger@supagro.fr"
                    "parcelName": "baptiste.oger@supagro.fr"
                }
            */
            queryTxt = " SELECT m.dataUserEMail, m.dataOwnerEMail,"
                +" parcelName,"
                +" yearNumber, weekNumber,"
                +" nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth,"
                +" m.dateTimeInMs, a.userName as dataOwnerName"
                +" FROM modifiedweekmetrics m, authentification a "
                + " WHERE  m.dataOwnerEMail = a.userEMail"
                +" and dataUserEMail = '"+req.body.dataUserEMail+"' "
                +" and dataOwnerEMail = '"+req.body.dataOwnerEMail+"' "
                +" and parcelName = '"+req.body.parcelName+"'"
                ;
        }

        if(queryTxt){
            console.log(queryTxt);
            execQuery(queryTxt).then(rows => res.json(rows));
        }
    }

    if (req.body.transaction === "alter_modifiedweekmetrics") {
        /*
        req.body = 
        {
            "transaction": "alter_modifiedweekmetrics"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
            , "nbObsFullGrowth": 25
            , "nbObsSlowGrowth": 15
            , "nbObsStoppedGrowth": 10
            , "dateTimeInMs": 1585269934625
        }
        */

    //    console.log(req.body);

        let queryTxt = "INSERT INTO modifiedweekmetrics (dataUserEMail, dataOwnerEMail, parcelName, yearNumber, weekNumber, nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth, dateTimeInMs) ";
        queryTxt += " VALUES ('"+req.body.dataUserEMail+"', '" +req.body.dataOwnerEMail+"',  '" + req.body.parcelName+"', " + req.body.yearNumber+", " + req.body.weekNumber+",  " + req.body.nbObsFullGrowth+", " + req.body.nbObsSlowGrowth+", " + req.body.nbObsStoppedGrowth+", " +  req.body.dateTimeInMs+")" 
                +" ON DUPLICATE KEY UPDATE"
                +" nbObsFullGrowth = " +req.body.nbObsFullGrowth
                +" , nbObsSlowGrowth = "+req.body.nbObsSlowGrowth
                +" , nbObsStoppedGrowth = "+req.body.nbObsStoppedGrowth
                +", dateTimeInMs = "+req.body.dateTimeInMs+" ;";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
            
    }

    if (req.body.transaction === "delete_modifiedweekmetrics") {
        /*
        {
            "transaction": "delete_modifiedweekmetrics"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
        }
        */
    //    console.log(req.body);
    
        const queryTxt ="DELETE FROM modifiedweekmetrics WHERE" 
            +" dataUserEMail = '"+req.body.dataUserEMail+"'"
            +" and dataOwnerEMail =  '"+req.body.dataOwnerEMail+"'"
            +" and parcelName = '" +req.body.parcelName+"'"
            +" and yearNumber = " +req.body.yearNumber
            +" and weekNumber = " +req.body.weekNumber ;
    
        console.log(queryTxt);
        
        execQuery(queryTxt).then(rows => res.json(rows));
    
    }

    

    // PARCELDATASHARING

    if (req.body.transaction === "select_parceldatasharing"){
        /*
        req.body = 
        {
	        "transaction": "select_parceldatasharing",
	        "userEMail": "baptiste.oger@supagro.fr"
        }
    
        or 
       req.body = 
       {
           "transaction": "select_parceldatasharing",
           "ownerEMail": "baptiste.oger@supagro.fr"
       }
       */

       console.log(req.body);

        let queryTxt =""
        if(req.body.userEMail!==undefined){
             queryTxt = " SELECT * FROM parceldatasharing WHERE dataUserEMail = '"+req.body.userEMail+"'";
        }

        if(req.body.ownerEMail!==undefined){
            queryTxt = " SELECT * FROM parceldatasharing WHERE dataOwnerEMail = '"+req.body.ownerEMail+"'";
        }


        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
    }

    if (req.body.transaction === "insert_parceldatasharing") {
        /*
        req.body = 
        {
            "transaction": "insert_parceldatasharing"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "Toto@tu.ti"
            , "parcelName": " dummy parcel"
        }
        */

    //    console.log(req.body);

        let queryTxt = "INSERT INTO parceldatasharing (dataUserEMail, dataOwnerEMail, parcelName) ";
        queryTxt += " VALUES ('"+req.body.dataUserEMail+"', '" +req.body.dataOwnerEMail+"',  '" + req.body.parcelName+"')";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
            
    }

    if (req.body.transaction === "delete_parceldatasharing") {
        /*
        {
            "transaction": "delete_parceldatasharing"
            , "dataUserEMail": "Toto@tu.ti"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
        }
        */
    //    console.log(req.body);

        const queryTxt ="DELETE FROM parceldatasharing WHERE" 
            +" dataUserEMail = '"+req.body.dataUserEMail+"'"
            +" and dataOwnerEMail =  '"+req.body.dataOwnerEMail+"'"
            +" and parcelName = '" +req.body.parcelName+"'"
        ;

        console.log(queryTxt);
        
        execQuery(queryTxt).then(rows => res.json(rows));

    }

});

router.delete('/', function(req, res, next) {

   
    

});





module.exports = router;
