const express = require("express"),
      router = express.Router(),
       middleware = require("../middleware");
  //models
  const Recipe = require("../models/recipe"),
        Comment = require("../models/comment")
  //COMMENT ROUTES
  //CREATE COMMENT FORM
  router.get("/recipes/:id/comments", middleware.isLoggedIn ,(req, res) =>{
    Recipe.findById(req.params.id, (err, foundRecipe) =>{
      if(err) {
        res.redirect("/")
      } else {
        res.render("./Comment/new", {recipe: foundRecipe});
      }
    })
  })

  //reference the schema inside of recipe as array
  
  router.post("/recipes/:id/comments", middleware.isLoggedIn, (req, res) =>{
      Comment.create({
        author: {
          id: req.user._id,
          username: req.user.username
        },
        text: req.body.comment.content,
        picture: req.user.picture
      },  (err, comment) =>{
        if(err) {
          res.redirect("/")
        } else {
          Recipe.findById(req.params.id,  (err, recipe)=> {
            if(err) {
              res.redirect("/")
            } else {
              recipe.comments.push(comment);
              recipe.save( (err, recipe)=> {
                if(err) {
                } else {

                  res.redirect("/recipes/" + req.params.id);
                }
                });
      
            }     
          })
        }
        })
  })
  //EDIT COMMENT ROUTE FORM
  router.get("/recipes/:id/comments/:comment_id/edit", middleware.checkCommentOwnership ,middleware.isLoggedIn ,(req, res) =>{
    Recipe.findById(req.params.id, (err, foundRecipe) =>{
      if(err) {
        res.redirect("back")
      } else {
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
          if(err) {
            res.redirect("back")
          } else {
            res.render("./Comment/edit", {comment: foundComment, recipe: foundRecipe});
          }
        })
      }
    })
  })
  //EDIT COMMENT POST
  router.put("/recipes/:id/comments/:comment_id",middleware.checkCommentOwnership ,(req, res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
      if(err) {
        console.log(err)
        res.redirect("back")
      } else {
        res.redirect("/recipes/" +req.params.id)
      }
    })
  })

  //DESTROY COMMENT
  router.delete("/recipes/:id/comments/:comment_id", middleware.checkCommentOwnership ,(req, res) =>{

        Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=> {
          if(err) {
            res.redirect("back")
          } else {
            console.log(comment)
            res.redirect("/recipes/" + req.params.id);
          }
        })
  })


  module.exports = router;