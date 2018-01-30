var passport = require("../config/passport");
var db = require("../models");
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));



module.exports = function(app) {
    
// route to get all the users
app.get("/api/users", function(req, res) {
    var query = {};
   // find all of them
    db.User.findAll({
      where: query, 
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
  
  app.put("/api/userPhoto", function(req, res) {
      console.log("+++++++++++++++++++")
      console.log(req.body.path)
      console.log(req.body.email)
      db.User.update({
        userImage: req.body.path
      }, {
      where: {
        email: req.body.email
      }
    })
  })
  
  //get user by username
  app.get("/api/users/username/:username", function(req, res) {
  
    db.User.findOne({
      where: {
        username: req.params.username
      } 
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
  
  
  // update password when user forgets theirs
  app.put("/api/users/email/:email", function(req, res) {
    console.log("beginning of email put route: " + JSON.stringify(req.body));
    db.User.update({ // update password
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }, { // update it by email provided
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      console.log("working inside password update in api/routes: " + dbUser);
      res.json(dbUser);
    })
    .catch(function(err) {
      console.log("in the catch in email put route   " + err);
      res.json(err);
    });
  });
  
  
  
// Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  
  
   // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        username: req.user.username,
        userFirstName: req.user.userFirstName,
        userLastName: req.user.userLastName,
        isBand: req.user.isBand,
        instrumentsPlayed: req.user.instrumentsPlayed,
        searchingFor: req.user.searchingFor,
        genre: req.user.genre,
        about: req.user.about,
        userImage: req.user.userImage,
        faceBook: req.user.faceBook,
        reverbNation: req.user.reverbNation,
        soundCloud: req.user.soundCloud
        
        
      });
    }
  });
  
  
  
   app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
      // console.log("-------------------------- " + JSON.stringify(res));
    res.redirect("/search");
  
  });

// create new user
 app.post("/api/users", function(req, res) {
   console.log("at begining of api/users");
   console.log(req.body)
   // take all this info
    db.User.create({ 
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      isBand: req.body.isBand,
      instrumentsPlayed: req.body.instrumentsPlayed,
      searchingFor: req.body.searchingFor,
      genre: req.body.genre,
      about: req.body.about,
      userLocation: req.body.userLocation,
      userImage: req.body.userImage,
      faceBook: req.body.faceBook,
      reverbNation: req.body.reverbNation,
      soundCloud: req.body.soundCloud
    }).then(function(dbUser) {
           console.log("at the end of api/users");
      res.json(dbUser);
        // res.redirect("/login");
   
    })// if an error happends catch it
    .catch(function(err) { // then throw some json
         console.log("at the catch of api/users  " + err);
      res.json(err);
    });
  });
  
// route to delete use account (should probably be only for admin or user)
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({ 
      where: { 
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });

  });


 // PUT route for updating user profile
  app.put("/api/users/username", function(req, res) {
    console.log("begining of PUT: " + JSON.stringify(req.body));
    db.User.update({ // allow them to update these fields
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      username: req.body.username,
      isBand: req.body.isBand,
      instrumentsPlayed: req.body.instrumentsPlayed,
      searchingFor: req.body.searchingFor,
      genre: req.body.genre,
      about: req.body.about,
      faceBook: req.body.faceBook,
      reverbNation: req.body.reverbNation,
      soundCloud: req.body.soundCloud
    }, { // update it by id
      where: {
        username: req.body.username
      }
    }).then(function(dbUser) {
      console.log("working inside put route: " + dbUser);
      res.json(dbUser);
      // res.redirect("http://google.com");
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  app.get('/api/users/search', function(req, res){
  console.log("****++++******")
  console.log(req.query)
  let where = {}
  let conditionals = function() {
    if (req.query.userFirstName) {
    if (req.query.isBand) {
      if (req.query.instrumentsPlayed) {
        //all true
        return where = {
          userFirstName: req.query.userFirstName,
          isBand: req.query.isBand,
          instrumentsPlayed: req.query.instrumentsPlayed
        }
      }
      else{
        //first 2 true last false
        return where = {
          userFirstName: req.query.userFirstName,
          isBand: req.query.isBand
        }
      }
    } else if (req.query.instrumentsPlayed) {
      //first and 3rd true 2nd false
      return where = {
        userFirstName: req.query.userFirstName,
        instrumentsPlayed: req.query.instrumentsPlayed
      }
    } else {
      //first true
      return where = {
        userFirstName: req.query.userFirstName
      }
    }
  }
  if(req.query.isBand) {
    if (req.query.instrumentsPlayed) {
      // first false 2 and last true
      return where = {
        isBand: req.query.isBand,
        instrumentsPlayed: req.query.instrumentsPlayed
      }
    } else {
      // just 2 is true
      return where = {
        isBand: req.query.isBand
      }
    }
  }
  if (req.query.instrumentsPlayed) {
    // just 3 is true
    return where = {
      instrumentsPlayed: req.query.instrumentsPlayed
    }
  } else {
    //all false -> query all users
    return where = {}
  }
}
conditionals();
  
  console.log("*********" + JSON.stringify(where))
  db.User.findAll({
    where: where
  }).then(function(dbUser) {
    res.json(dbUser)
  })
})
}