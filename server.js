//Definitions
const express = require("express");
const bodyParser = require("body-parser");
const successUser = require('./app/models/user.model.js');
var path = require('path');
const cors = require("cors");
const app = express();
const fs = require('fs');
const https=require('https');
const http=require('http');
//Image definitions
const multer  = require('multer');
const sharp = require('sharp');
// const uuid = require('uuid/v4');
run().catch(error => console.error(error.stack));
async function run() {
}
//define the origin of the server
var corsOptions = {
  origin: "https://newco.tap2sos.com/"
};

// Multer single file parser
const upload = multer({limits:{fileSize:50*1024*1024}}).single('avatar')
// Multer multiple files parser
const uploads = multer({limits:{fileSize:50*1024*1024}}).array('photos', 12)

//
const nodeFetch = require('node-fetch')
global.fetch = nodeFetch;

//Use origin of the server
app.use(cors(corsOptions));

//Set the path to static sources (css,js files)
app.use(express.static('./app/public'));
//app.use(express.static('./app/public/uploads'))

// parse requests of content-type - application/json
app.use(bodyParser.json());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//set view engine to ejs
app.set('views', path.join(__dirname,'app/views'));

//app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// define and sync database
const db = require("./app/models");
db.sequelize.sync();

//Set the path of routes
require("./app/routes/user.routes")(app);

// var https = require('https');

// const sslServer=https.createServer({
//   key: fs.readFileSync('e1cb4_249df_2c70104fa541d006852e8ce172e2c183.key','utf-8'),
//   cert: fs.readFileSync('newco_tap2sos_com_e1cb4_249df_1647993599_c9f16ded1ce6a9fb8531ac9dc4a22629.crt','utf-8'),
//   rejectUnauthorized: true
    
// },app);

//const PORT = process.env.PORT || 8080;

// sslServer.listen( PORT,() => {
//     console.log('HTTP Server running on port '+PORT);
// });


// require("./app/routes/employee.routes")(app);

// //Set the port of the server and run
//  const PORT = process.env.PORT || 443;
// app.listen(PORT, function () {
//   console.log(`Server is running on port ${PORT}`);
// });

  const privateKey = fs.readFileSync('/etc/letsencrypt/live/newco.tap2sos.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/newco.tap2sos.com/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/newco.tap2sos.com/fullchain.pem', 'utf8');
  const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
  };

  https.createServer( credentials,app).listen(443, () => {
      console.log('HTTPS Server running on port 443');
  });
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
//  else if (process.env.NODE_ENV === "development") {
// app.listen(9000);
// } else 
// app.listen(9000);
// }
