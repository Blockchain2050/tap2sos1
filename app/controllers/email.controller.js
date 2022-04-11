//Controller to send emails after sign up with info.
//Email controller requiments
var nodemailer = require('nodemailer'); 
require('dotenv').config(); //this file defines the sending email and its credentials
var bs58 = require('bs58')

//function for sending emails
exports.sendEmail = (req, res) => {
  var encrypted = req.body.hash;
 console.log(encrypted);
  //encode the hash with base58 encoding
  var password = bs58.encode(new Buffer(encrypted, 'hex'));
  //defines the information about the email service
  var transporter = nodemailer.createTransport({
      host: "mail.tap2sos.com",
      port: 465,
    //  if true the connection will use TLS when connecting to server. If false (the 
    // default) then TLS is used if server supports the STARTTLS extension. In most 
    // cases set this value to true if you are connecting to port 465. For port 587 or 
    // 25 keep it false
    secure: true, // use TLS
    auth: {
        // Your full email address
        user: "newco@tap2sos.com",
        // Your Gmail password or App Password
        pass: "OyF2elcnE_3F"
    }
  });
    
    // create encoded tagID
    var credentialString = Buffer.from('?' + req.body.username + '?' + password,'binary').toString('base64');
    var tagID = 'https://newco.tap2sos.com/tag'+ '?' + credentialString;

    //defines the message of the email
    var info = 'Welcome to the Tap2Sos platform supported be the LTO network\n'+
    'You have Signed up in the Tap2Sos system with the credentials below: \n'+ 
    'Your Username is: ' + req.body.username +'\n'+
    '\n' +
    'Your Blockchain ID is: ' + password+'\n'+
    '\n'+
    'Your Login URL is: ' + tagID +'\n'+
    
    'This is an automatic email, do not answer it back'
    console.log("tagid"+tagID);
    //defines the sender, the recipient and the subject of the email
    var mailOptions = {
      from: 'newco@tap2sos.com',
      to: req.body.email,
      subject: 'Tap2sos - Blockchain ID',
      text: info
    };

    var info1 = 'There has been a new purchase for TAP2SOS\n'+
    'The mail is: ' + req.body.email +'\n'+
    '\n' +
    'The Blockchain ID is: ' + password+'\n'+
    '\n'+
    'The Login URL is: ' + tagID +'\n'+
    'The URL id is: ' + req.body.id +'\n'+
    
    'This is an automatic email, do not answer it back\n'
    'Please contact person to register its tag'

    var mailOptions1 = {
      from: 'newco@tap2sos.com',
      to: 'info@aratos.gr',
      subject: 'Tap2sos - Purchase ID',
      text: info1
    };





    //Notification in case something goes wrong
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        transporter.close();
      }

    });

    transporter.sendMail(mailOptions1, function(error1, info1){
      if (error1) {
        console.log(error1);
      } else {
        console.log('Email sent: ' + info1.response);
        transporter.close();
      }

    });





}
