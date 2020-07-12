const  express = require("express"),
router = express.Router();
middleware = require("../middleware");

const User = require("../models/user")

  //MY ACCOUNT PAGE
  router.get("/profile/:id", (req, res) => User.findById(req.params.id, (err, user) => res.render("./Auth/profile", {user}))) 

  //user picture change form
  router.get("/profile/:id/picture" ,(req, res) => { 
    try {
      res.render("./user/picture", {user: req.user._id});
    }catch(err) {
      res.redirect("back")
    }
    
})

  //post the user picture to user database and update
  router.post("/profile/:id/picture", (req, res) =>{ 
    User.findByIdAndUpdate(req.params.id, {picture: req.body.picture} ,(err, user) => {
    req.flash("success", "Profile Picture Changed.")
    res.redirect("/profile/"+ req.params.id)
  })
})

  module.exports = router;