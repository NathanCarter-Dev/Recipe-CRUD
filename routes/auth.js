  const  express = require("express"),
         router = express.Router(),
         passport = require("passport"),
         localStrategy = require("passport-local");
  const Recipe = require("../models/recipe"),
        Comment = require("../models/comment"),
        User = require("../models/user");
const e = require("express");
const middleware = require("../middleware");

//AUTH ROUTES
  //REGISTER ROUTE
  router.get("/register", (req, res) => {
    res.render("./Auth/register");
  })
  router.post("/register", (req, res) =>{

    User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
      if(err) {
        console.log(err);
        res.redirect("back")
      } else {
        passport.authenticate("local")(req, res, () =>{
          req.flash("success", "User Successfully Registered.");
          console.log(user)
          res.redirect("/recipes");
        });
      }
    })
  })
  //LOGIN ROUTE
  router.get("/login",  (req, res) =>{
    res.render("./Auth/login")
  })
  //Login authentication
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/recipes",
    failureRedirect: "/login"
  }) ,(req, res) =>{
    
  })
  //LOGIN GOOGLE
  router.get('/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));

  router.get("/logout", (req, res) =>{
    req.logOut();
    req.flash("success", "Logged Out.")
    res.redirect("/recipes");
  })

  router.get( '/google/callback',
  passport.authenticate( 'google', {
      successRedirect: '/recipes',
      failureRedirect: '/login'
}));
  //ADMIN PAGE
  router.get("/admin",middleware.isAdmin, (req, res) => 
    User.find({}, (err, user) => 
      res.render("./Auth/admin", {user})))
  //add admin to user
  router.post("/admin",middleware.isAdmin, (req, res) => 
    User.update({username: req.body.name}, {admin: true}, (user) =>  {
      req.flash("success", "User Added As Administrator")
      res.redirect("/admin") 
    }))
    
  //remove admin from user
    router.put("/admin",middleware.isAdmin, (req, res) => 
    User.update({username: req.body.name}, {admin: false}, (user) =>  {
      req.flash("success", "User Removed From Administrators")
      res.redirect("/admin") 
    }).catch(err => {console.log(err)}))
    

  module.exports = router;