module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const email = require("../controllers/email.controller.js");
  var router = require("express").Router();

 ///////////////////////users table routes//////////////////////////////////////////////

  // Create a new user
  router.post("/", users.create);
  //Check if the username exists
  router.post("/checkUser", users.tempUsers);
  //search for a user
  router.get("/:id", users.findOne);
  //Route to upload user photo
  router.post("/upload", users.upload);

  //Route to email request
  router.post("/sendemail", email.sendEmail);
  
///////////////////////users table routes//////////////////////////////////////////////

 //////////////////////////////////////////////////////////////////////////////////

 app.get('/', function(req, res){
  //  var id=req.query.id;
  // console.log(req.query.id);
  // if(req.query.id=="22")
  // {
  //   res.redirect(301, "https://newco.tap2sos.com/tag?lsflkdfjgkldjdflkgjdfglk");
  // }
  // else if(req.query.id=="23")
  // {
     
  // }
  // else if(req.query.id=="24")
  // {
     
  // }
  // else if(req.query.id=="25")
  // {
     
  // }
  // else if(req.query.id=="26")
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }

  // else if()
  // {
     
  // }
  // else if()
  // {
     
  // }
  // else {
    var id=req.query.id;
    console.log(id);
    res.render('pages/SignUP',{id_new:id})
  // }
  
});

app.get('/about', function(req, res){
  res.render('pages/about');
});

//route to submit page
app.get('/SignUP', function(req, res){
  //var id=req.query.id
  //console.log(id);
   res.render('pages/SignUP')
  //  ,{id_new:id});
});

//route to submit page
app.get('/LogIN', function(req, res){
  res.render('pages/LogIN');
});

//route to find page
app.get('/tag', function(req, res){
  res.render('pages/tag');
});

//post
app.post('/users', function(request, response, next){
  successUser.create().then(()=> {
    response.end()
  }).catch(error => {
    response.status(404).end()
  })
})

  app.use('/api/users', router);
};
