const path = require('path');

module.exports ={

   /* Normally on the client side (/client) we execute: npm run build to create the deployment folder "/dist"
    * for heroku deployment we should create a public within server 
    */
    outputDir: path.resolve(__dirname,'../server/public'),
    
    devServer:{
        proxy:{
            '/':{
                target: 'http://localhost:5000'
            }
        }
    }
}