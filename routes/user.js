const  express = require("express"),
router = express.Router();
middleware = require("../middleware");

const User = require("../models/user")

  //MY ACCOUNT PAGE
  router.get("/profile/:id", (req, res) => res.render("./Auth/profile"))

  //user picture change form
  router.get("/profile/:id/picture", (req, res) => res.render("./user/picture", {user: req.user._id}));

  //post the user picture to user database and update
  router.post("/profile/:id/picture", (req, res) => User.findByIdAndUpdate(req.params.id, {picture: req.body.picture} ,(err, user) => {
    req.flash("success", "Profile Picture Changed.")
    res.redirect("/profile/"+ req.params.id)
  }))

  module.exports = router;