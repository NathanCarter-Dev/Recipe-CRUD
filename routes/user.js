const  express = require("express"),
router = express.Router();
middleware = require("../middleware");

const User = require("../models/user");
const Recipe = require("../models/recipe");

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

  let search;
  router.post("/user/search/:page", (req, res) => {
    search = req.body.search
    const prevSearch = search
    User.paginate({username: {$regex: req.body.search, $options: '(?i)a(?-i)cme'}}, { page: req.params.page, limit: 8, sort: {rating: -1} }, function(err, search) {
      currentPage = (parseInt(search.page))
      res.render("./user/search", {prevSearch, pages: search.pages, search: search.docs, page: currentPage})
    })
  })

  //USER UPLOADS
  router.get("/user/:id/uploads/:page", (req, res) => User.findById(req.params.id).exec((err, user) =>{ 
    Recipe.paginate({_id: { $in: user.uploads}}, { page: req.params.page, limit: 8, sort: {rating: -1} }, function(err, search) {
      currentPage = (parseInt(search.page))
      //render search page and give the previous search to give to next page buttons as value
      res.render("./user/uploads", {pages: search.pages, search: search.docs, page: currentPage, user})
  });
    

}))


  //FOLLOW USERS
  router.get("/user/:id/follow",(req,res) => {
    if(req.user) {
      //find the current user
      User.findById(req.user._id, (err, user) => {
        //find the user to follow
        User.findById(req.params.id, (err, followedUser) => {
          //check if user is already following 
          if(user.followedUsers.includes(followedUser._id)) {
            const index = user.followedUsers.indexOf(followedUser._id)
            user.followedUsers.splice(index, 1)
            user.save()
          } else {
            //if user is not following follow the user
            user.followedUsers.push(followedUser._id)
            user.save()
          }
          res.redirect("/profile/"+ req.params.id)
        })
      })
    } else {
      req.flash("error", "Please login first.")
      res.redirect("/login")
    }
  })
  module.exports = router;