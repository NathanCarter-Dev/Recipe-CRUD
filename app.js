const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      seedDB = require("./seed"),
      convert = require('convert-units'),
      passport = require("passport"),
      localStrategy = require("passport-local"),
      expressSession = require("express-session"),
      axios = require("axios"),
      flash = require("connect-flash"),
      GoogleStrategy = require('passport-google-oauth2').Strategy
      mongoosePaginate = require('mongoose-paginate-v2');
      
var  cron = require("node-cron");

//routers
const recipeRoutes = require("./routes/recipes"),
      commentRoutes = require("./routes/comments"),
      authRoutes = require("./routes/auth"),
      userRoutes = require("./routes/user");

// mongoose.connect("mongodb://localhost/recipe", 

mongoose.connect("mongodb+srv://Nathan:CocoIsARetard722@cluster0.c38zp.mongodb.net/test", {useNewUrlParser: true, useUnifiedTopology: true});

//MODELS
const Recipe = require("./models/recipe"),
      Comment = require("./models/comment"),
      User = require("./models/user")

const e = require("express");
const user = require("./models/user");
app.use(expressSession({
  secret: "Once again Coco wins cutest dog!",
  resave: false,
  saveUninitialized: false
}))
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
  clientID:     "119035373033-usml05ivsufrd4a6uurlnn19buocfpi6.apps.googleusercontent.com",
  clientSecret: "b6UKejueBfanh5-08v0Fh20T",
  callbackURL: "http://localhost:3000/google/callback",
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  User.findOrCreate({googleId: profile.id}, function (err, user) {
    user.username = profile.displayName
    user.save((err, user) => {
      return done(err, user);
    }) 
  });
}
));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("./models"))
app.use(express.static("./public"))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//SEED DATABASE
// seedDB();

//set random value on server start to give to random front page recipe
var random = []
Recipe.findRandom({}, {}, {limit: 5}, (err, results) =>{
  if (!err) {
    random = results
  } 
});

//update random recipe
  cron.schedule('0 * * * *', () => {
    Recipe.findRandom({}, {}, {limit: 5}, (err, results) =>{
      if (!err) {
        random = results
        
      } 
    });
  });

  //reset ratings 
  cron.schedule('59 23 * * *', () => {
    Recipe.updateMany({}, {rating: 0},(err, results) =>{
      if (!err) {

      } 
    });
  });

//middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  res.locals.randomRecipe = random;
  
  next();
}) 
//CLEAR DATABASE
// Recipe.deleteMany({}, (err, deleted) => console.log("deleted"))
// User.deleteMany({}, (err, deleted) => console.log("deleted"))

//default admin profiles
User.findOne({username: Nathan}, (err, user) => {
  user.admin = true;
  user.save()
 })

app.use(recipeRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(userRoutes);


//Default route
app.get("/", (req, res) =>{
  res.redirect("/recipes");
})



app.listen(process.env.PORT || 3000, () => {
  console.log("server listening on port 3000");
})