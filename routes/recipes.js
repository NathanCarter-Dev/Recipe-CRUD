const express = require("express"),
      router = express.Router(),
      middleware = require("../middleware");

//models
const Recipe = require("../models/recipe"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      user = require("../models/user"),
      axios = require('axios'),
      e = require("express"),
      { Mongoose } = require("mongoose");

//INDEX ROUTE - show all recipes
router.get("/recipes", (req, res) => {
  try {
    let user;
    Recipe.find({}, (err, recipe) =>{
        if(req.user) {
          User.findById(req.user._id, (err, foundUser) =>{
              user = foundUser
              res.render("./Recipe/index",{recipe, user});
          })
        } else {
          res.render("./Recipe/index",{recipe});
        }
    })
  }catch(err) {
    res.redirect("/recipes");
  }

})

//NEW ROUTE
router.get("/recipes/new", middleware.isLoggedIn,(req, res) =>{
  res.render("./Recipe/new");
})

//CREATE ROUTE
router.post("/recipes", middleware.isLoggedIn,function(req, res) {
  let  ingredientsString = req.body.ingredients,
       ingredient = ingredientsString.split("\n"),
       methodString = req.body.method,
       method = methodString.split("\n")
  const newRecipe = new Recipe({
    name: req.body.recipe.name,
    image: req.body.recipe.image,
  });
   //convert minutes over 60 to an hour
  let hours = parseInt(req.body.recipe.prepHour) + parseInt(req.body.recipe.cookHour),
      minutes = parseInt(req.body.recipe.prepMinute) + parseInt(req.body.recipe.cookMinute),
      mins = minutes,
      total = calculateTime(minutes, hours, mins);

  //set image address if user does not set one
  if(req.body.recipe.image === "") {
    req.body.recipe.image = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
  Recipe.create(req.body.recipe, (err, newRecipe) => {
    try {
      ingredient.forEach((ingredient)=> {
        newRecipe.ingredients.push(ingredient);
      })
      newRecipe.likes_count = 0;
      newRecipe.total = total;
      //create author 
      newRecipe.author.id = req.user._id
      newRecipe.author.username = req.user.username
      method.forEach((method)=> {
        newRecipe.method.push(method);
      })
      newRecipe.save();
      req.flash("success", "Recipe Posted.");
      res.redirect("/recipes")
      
    }catch(err) {
      console.log(err)
      req.flash("error", "Something went wrong. Try again.");
      res.redirect("/recipes")
    }
  })


    
      
})


//SHOW ROUTE
router.get("/recipes/:id", (req,res) =>{
  Recipe.findById(req.params.id).populate("comments").exec( (err, recipe)=> {
    try {
      res.render("./Recipe/show", {recipe})
    } catch(err) {
      console.log(err)
      req.flash("error", "Something went wrong. Try again.");
      res.redirect("/recipes")
    }
  })
})
//EDIT ACTION
router.get("/recipes/:id/edit", middleware.checkRecipeOwnership, (req,res)=> {
  Recipe.findById(req.params.id,  (err, recipe)=> {
    if(err) {
      req.flash("error", "Something went wrong. Try again.");
      res.redirect("/recipes")
    } else {
      //put array data in edit values with correct \n spacing
      const ingredients = recipe.ingredients,
            ingredientsString = ingredients.join("\n"),
            method = recipe.method,
            methodString = method.join("\n");
      res.render("./Recipe/edit", {recipe, ingredients: ingredientsString, method: methodString})
    }
    })
  })

  //EDIT RECIPE
  router.put("/recipes/:id", middleware.checkRecipeOwnership,  (req, res) => {
    let ingredients = req.body.recipe.ingredients,
        methods = req.body.recipe.method;
      let params
    Recipe.findById(req.params.id, (err, recipe) =>{
            try {
      params = req.params.id
      //Split ingredient array on each enter key
      let ingredient = ingredients.split("\n"); 
      let method = methods.split("\n");

      //convert minutes over 60 to an hour
      let hours = parseInt(req.body.recipe.prepHour) + parseInt(req.body.recipe.cookHour);
      let minutes = parseInt(req.body.recipe.prepMinute) + parseInt(req.body.recipe.cookMinute);
      let mins = minutes;
      let total = calculateTime(minutes, hours, mins);

      //CREATE UPDATED RECIPE OBJECT
      var updatedRecipe = {
        name: req.body.recipe.name,
        image: req.body.recipe.image,
        ingredients: ingredient,
        description: req.body.recipe.description,
        prepHour: req.body.recipe.prepHour,
        prepMinute: req.body.recipe.prepMinute,
        cookHour: req.body.recipe.cookHour,
        cookMinute: req.body.recipe.cookMinute,
        servings: req.body.recipe.servings,
        method: method,
        total: total
      }

      //update recipe with new object
      recipe.update(updatedRecipe, (err, updatedRecipe)=> {

        req.flash("success", "Post Edited.");
        res.redirect(`/recipes/${params}`);
      })
      }catch(err) {
        req.flash("error", "Something went wrong. Try again.");
        res.redirect(`/recipes/${params}`);
        console.log(err)
      }
      })



        
    })

  //DESTROY ROUTE
  router.delete("/recipes/:id", middleware.checkRecipeOwnership ,(req, res)=> {
    Recipe.findByIdAndRemove(req.params.id, (err, deletedRecipe)=> {
      try {
        req.flash("success", "Post Deleted.");
        res.redirect("/recipes");
        
      } catch {
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/recipes")
      }
    })




  })

  //SHOW FAVOURITES
  router.get("/recipes/:id/favourites", (req, res)=> {
    if(req.user) {
    User.findById(req.user._id, (err, user) =>{
      if(err) {
        res.redirect("/")
      } else {
        Recipe.find({_id: { $in: user.favouritePosts}}, (err, recipe) =>{
          if(err) {
            console.log(err)
          } else {
            console.log(recipe)
            res.render("./Recipe/favourite", {recipe: recipe})
          }
        })
      }
    })
  } else {
    res.redirect("/login")
  }
  })
  //POST UPVOTE ROUTES
  //Logic for favouriting posts
  router.post('/recipes/:id/favourite',  (req, res) => {
    console.log("sent")
    if(req.user) {
      //find current user
      Recipe.findById(req.params.id, (err, foundRecipe) =>{
        if(err) {
          console.log(err)
        } else {
      User.findById(req.user._id, (err, currentUser)=> {
        if(err) {
          console.log(err) 
        } else {
              if(currentUser.favouritePosts.includes(req.params.id)) {
                console.log("delete")
                const index = currentUser.favouritePosts.indexOf(req.params.id)
                currentUser.favouritePosts.splice(index, 1)
                currentUser.save()
                res.send('')

              } else {
                currentUser.favouritePosts.push(req.params.id)
                currentUser.save()
                res.send('')
              }
            }
          })
        }
      })
    } else {
      res.redirect("/login")
    }
});
  //get current users favourite status on relevant post
  router.get('/recipes/:id/favourite', (req, res) =>{
    User.findById(req.user._id, (err, foundUser) =>{
      if(err) {
        console.log(err) 
      }else {
        res.send({data: foundUser})
      }
    })
  })

  //calculate minutes overlapping hours on total variable
  const calculateTime = (minutes, hours, mins) =>{
    for(let i = 0; i < mins; i++) {
      if(i % 60 === 0) {
        hours+=1;
        minutes-=60;
      }
      if(minutes < 0) {
        hours-=1;
        minutes+=60;
      }
    }
    const total = hours + " hours " + minutes + " minutes"
    return total
  }
  module.exports = router;