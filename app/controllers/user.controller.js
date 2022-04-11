//Definitions
const express = require("express");
const app = express();
const db = require("../models");
const User = db.users;
const TempUser = db.tempusers;
const Op = db.Sequelize.Op;
var bs58 = require('bs58');
const multer = require("multer");
// app.use(express.static('./app/public/'))
const upload = multer({limits:{fileSize:50*1024*1024}}).single('file')

const sharp = require('sharp');
// const uuid = require('uuid/v4');

exports.tempUsers = (req,res) =>{
  console.log('into temp controllers');
  console.log(req.body.user);
  var userHashed = bs58.encode(new Buffer(req.body.encrypted, 'hex'));
  const tempuser = {
    username:req.body.user
  }

  
  console.log(tempuser);
  //Check if the hash exists in the DB
  var username = req.body.username;
  TempUser.findAll({
    where:{
      username:req.body.user
      } 
  }).then(data => {
    //Check if data are not empty
    // console.log(encrypted);
    console.log('check if temp username exists');
    // var username=req.body.user
    if (Object.keys(data).length !== 0 && data.constructor !== Object){
      console.log('username is: ' + username)
      console.log('username exists,exiting');
      //if username exist in database send a true response and exit
      res.send(true);
    //else the user does not exist and proceed to create
    }else{
      console.log('username does not exist, proceed');
      console.log('check if data exist in LTO');
       
      console.log('fetch request');
  
      // if (){
      // //Make a fetch request to the LTO network
      // fetch('http://95.217.12.207:62627/hash/'+userHashed+'/encoding/base58')
      //   .then(response => response.json())
      //     .then(data => {
      //       //if the data exist in LTO, send a true response and exit
      //       console.log('fetch request received that data exist in LTO, exiting');
      //       res.send(true);
      //     //if the data do not exist in LTO the search in DB
      //     }).catch(err => {
      //       // console.log(response);
      //       console.log('fetch request received no data, insert temp user into DB');
      //       //Fetch request error handler
      //         //if response is true then create the DB entry
      //         console.log('Creating DB entry');
      //         //DB post request
              TempUser.create(tempuser).then(data => { 
                console.log('The creation of the DB entry is succeed');
                //DB create request 
                res.send(false);
              }).catch(err => {
                console.log(data);
                console.log('An error occured during the creation of the DB entry');
                res.send(true);
              });
            // }).catch(err => {
            //   //Error handling
            //   console.log('error after');
            //   res.status(500).send({
            //     message:
            //     err.message || "Some error occurred while retrieving the hash."
            //   });
            // }); 
            //if fetch doesnot receive a response then send a false response to the frontend
            // res.send(false);
      };
    //Username If function ends    
  //DB data search request error handler  
  }).catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving tutorials."
    });
  }); 


}
// Create and Save a new user
exports.create = (req, res) => {
 // define hash
 console.log("mphkame create");
 console.log(req.body.id);
  var encrypted = req.body.hash;
  console.log(encrypted);
  //encode the hash with base58 encoding
  var password = bs58.encode(new Buffer(encrypted, 'hex'));
  // Construct a user and inserts data from req.body to variables
  var receivedPhoto = req.body.username +'.'+ req.body.extension;
  console.log(receivedPhoto);

  const user = {
    user_id:req.body.id,
    username : req.body.username,
    email : req.body.email,
    surname : req.body.surname,
    name : req.body.name,
    middleName : req.body.middleName,
    sexid : req.body.sexid,
    amka : req.body.amka,
    photo : receivedPhoto,
    birth : req.body.birth,
    address : req.body.address,
    phone : req.body.phone,
    emergencyPhone : req.body.emergencyPhone,
    doctorsPhone : req.body.doctorsPhone,
    medicalCondition : req.body.medicalCondition,
    bloodType : req.body.bloodType,
    medication : req.body.medication,
    allergies : req.body.allergies,
    organDonor : req.body.organDonor,
    hash : password
  };

  //Check if the hash exists in the Blockchain
  User.findAll({
    where:{
      username:req.body.username
      } 
  }).then(data => {
    //Check if data are not empty
    console.log('check if username exists');
    if (Object.keys(data).length !== 0 && data.constructor !== Object){
      console.log('username is: ' + username)
      
      console.log('username exists,exiting');
      //if username exist in database send a true response and exit
      res.send(true);
    //else the user does not exist and proceed to create
    }else{
      console.log('username does not exist, proceed');
      console.log('the photo is: ' + receivedPhoto);
      console.log('check if data exist in LTO');
      //split the credentials to variables accordingly
      var username = req.body.username;
      
      //console.log('the photo is'+req.body.photo);
      console.log('fetch request');
      //Make a fetch request to the LTO network
      // fetch('http://95.217.12.207:62627/hash/'+password+'/encoding/base58')
      //   .then(response => response.json())
      //     .then(data => {
      //       //if the data exist in LTO, send a true response and exit
      //       console.log('fetch request received that data exist in LTO, exiting');
      //       res.send(true);
      //     //if the data do not exist in LTO the search in DB
      //     }).catch(err => {
      //       console.log('fetch request received no data, procceed to search the DB');
            //Inittiate the search within the DB
            User.findAll({
              where:{
                username:username, 
                hash:password
              } 
            }).then(data => {
              console.log('check if data exist in the db');
              //if the received object is not empty the user exists in the DB
              if (Object.keys(data).length !== 0 && data.constructor !== Object){
                //Send true response to the frontend and exit
                console.log('data exist in DB, exiting');
                res.send(data);
              }else{
                ///////////////////////////////////////////////////////////////////
                console.log('data do not exist in DB, creating LTO entry');
                //POST fetch REQUEST TO LTO anchoring service
                // fetch("http://95.217.12.207:62627/hash", {
                //   method: "post",
                //   headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                //   },
                //   //Serialize the JSON body
                //   body: JSON.stringify({
                //     hash: password,
                //     encoding: 'base58'
                //   })
                // })
                // //Get response from fetch request 
                // .then( (response) => { 
                //   //Check if response is true or false
                //   if (response){
                    //if response is true then create the DB entry
                    console.log('Creating DB entry');
                    //create a user in the DB according to the constructor
                    //DB post request
                    User.create(user).then(data => {
                      
                    console.log('The creation of the DB entry is succeed');
                    //DB create request 
                   
                    }).catch(err => {
                      console.log(data);
                      console.log('An error occured during the creation of the DB entry');
                      //res.send(true);
                    });
                  }
                  // else{
                  //   console.log('An error occured during the creation of the LTO entry');
                  // }
                });   
              //Search data in DB If function ends            
              }
            //Fetch request error handler
            }).catch(err => {
              //Error handling
              console.log('error after');
              res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving the hash."
              });
            }); 
            //if fetch doesnot receive a response then send a false response to the frontend
            res.send(false);
        };
    //Username If function ends    
  //   }
  // //DB data search request error handler  
  // }).catch(err => {
  //   res.status(500).send({
  //     message:
  //     err.message || "Some error occurred while retrieving tutorials."
  //   });
  // }); 
// };

//find document private access
exports.findOne = (req,res) => {
  //require variables from front-end
  //Receive username & password from frontend
  
  var string = req.params.id;
  var username = string.split("username=")[1].split("&")[0];
  var encrypted = string.split("password=")[1].split("=")[0];
  var password = encrypted;
  console.log(password);
  //Make a fetch request to the LTO network
  //fetch('http://95.216.156.118:8082/hash/'+password+'/encoding/base58')
    //.then(response => response.json())
   //   .then(data => {
        //if the data exist in LTO, search the user's credentials within the DB
        User.findAll({
          where:{
            username:username, 
            hash:password
          } 
        }).then(data => {
          //if the received object is not empty the user exists in the DB
          if (Object.keys(data).length !== 0 && data.constructor !== Object){
            //Send true response to the frontend
            // console.log(data);
            res.send(data);
          }else{
            //Send false response to the Backend
            res.send(false);
          }}).catch(err => {
            //Error handling
            res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving the hash."
          });
        }); 
    //   }).catch(err => {
    //     //if fetch does not receive a response then send a false response to the frontend
    //     res.send(false);
    //   });
};
                 

//find document private access
exports.upload = (req,res) => {
  //console.log(req.name);
      // Multer single file parser
      console.log("mphkame upload");

      upload(req, res, async function(err){ 
      // check for error thrown by multer- file size etc
      if( err|| req.file === undefined){
          console.log(err)
          res.send("error occured")
      }else{
          console.log('the username is '+ req.body.username);
          var extension = req.body.extension;
          // everything worked fine // req.body has text fields, req.file has the file 
          let fileName = req.body.username +'.'+ extension
          var image = await sharp(req.file.buffer) //.resize({ width: 400, height:400 }) Resize if you want
          .jpeg({
              quality: 40,
          }).toFile('./app/public/uploads/'+fileName)
          .catch( err => { console.log('error: ', err) })
          res.send(req.body)
      }
      })
        
};

//========================================================================================                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        