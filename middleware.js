//MODELS
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");
var User = require("./models/user");



var middleware = {
  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    } 
    req.flash("error", "Please Login First.");
    res.redirect("/login");
  },
  checkRecipeOwnership: function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {
      //check if admin
      
      //find the recipe
      Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err) {
          req.flash("error", "Something went wrong. Try again.");
          res.redirect("back")
          console.log(err);
        } else {
          //check if current user = the owner of the recipe
          
          if(foundRecipe.author.id.equals(req.user._id) || req.user && req.user.admin ) {
            next();
          } else {
            req.flash("error", "Please Login First.");
            res.redirect("back");
          }
        }
      })
    
    } else {
      req.flash("error", "Please Login First.");
      res.redirect("back")
    }
  },
  checkCommentOwnership: function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {

      //find the comment
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
          req.flash("error", "Something went wrong. Try again.");
          res.redirect("back")
          console.log(err);
        } else {
          //check if current user = the owner of the recipe
          if(foundComment.author.id.equals(req.user._id) || req.user && req.user.admin ) {
            console.log("nice");
            next();
          } else {
            req.flash("error", "Please Login First.");
            res.redirect("back");
          }
        }
      })
    } else {
      req.flash("error", "Please Login First.");
      res.redirect("back")
    }
  },
  isAdmin: function(req, res, next) {
    if(req.user.admin) {
      return next();
    } else {
      req.flash("error", "Insufficient Permissions To View"); 
      res.redirect("/recipes")
    }
  }
}


module.exports = middleware;