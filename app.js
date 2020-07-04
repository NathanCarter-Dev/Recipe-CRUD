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
      flash = require("connect-flash")

//routers
const recipeRoutes = require("./routes/recipes"),
      commentRoutes = require("./routes/comments"),
      authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/recipe", {useNewUrlParser: true, useUnifiedTopology: true});




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
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("./models"))
app.use(express.static("./public"))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//SEED DATABASE
seedDB();
//middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next();
}) 

app.use(recipeRoutes);
app.use(commentRoutes);
app.use(authRoutes);


//Default route
app.get("/", (req, res) =>{
  res.redirect("/recipes");
})


app.listen(3000, () => {
  console.log("server listening on port 3000");
})