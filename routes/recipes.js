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
    let recipes = []
    //Find the different recipe types for index page
    Recipe.find({}).sort({rating: -1}).limit(8).exec((err, relevantRecipes) =>{
      Recipe.find({}).sort({date: -1}).limit(8).exec((err, newRecipes) =>{
        //calculate relevant recipes if user if logged in
        
        let content =[]
        //give recipe types title
        const relevant = {content: relevantRecipes, name: "Trending", link: "/recipes/viewby/trendingRecipes/1"}
        const newRecipe = {content: newRecipes, name: "New", link: "/recipes/viewby/newRecipes/1"}
        
        if(req.user && req.user.followedUsers.length>0) {
           //find the ids of users inside followed users
           User.findById(req.user._id).exec((err, user) => {
            //find all the posts by followed users
          User.find({_id: {$in: user.followedUsers}}).exec((err, users) => {
            let u = []    
            //take the followed users and grab their most recent post; concat to u arr
            for(let i in users) {
              u = u.concat(users[i].uploads[users[i].uploads.length - 1])
            }
            //find the recipes from the ID's in u
            Recipe.find({_id: {$in: u}}).sort({date: -1}).exec((err, recommendedRecipes) =>{ 
              const recommended = {content: recommendedRecipes, name: "Recommended", link: "/recipes/viewby/recommended/1"}

              //find user and render page
            User.findById(req.user._id, (err, foundUser) =>{
              user = foundUser
              recipes = [recommended, relevant, newRecipe]
              res.render("./Recipe/index",{recipes, user});
          })
          })
          
          })
        })
          
        } else {
          recipes = [relevant, newRecipe]
          res.render("./Recipe/index",{recipes, user: req.user});
        }
    })
    
  })
  }catch(err) {
    res.redirect("/recipes");
  }

})

//NEW ROUTE
router.get("/recipes/new", middleware.isLoggedIn,(req, res) =>{
  //find recipes to suggest to the user
  Recipe.findRandom({}, {rating:-1}, {limit: 2}, (err, results) =>{
    if (!err) {
      random = results
    } 
  });
  Recipe.findRandom({}, {}, {limit: 3},(err, recipe) => {
  res.render("./Recipe/new", {recipe});
  })
})

//CREATE ROUTE
router.post("/recipes", middleware.isLoggedIn,function(req, res) {

  let  ingredientsString = req.body.ingredients,
       ingredient = ingredientsString.split("\n"),
       methodString = req.body.method,
       method = methodString.split("\n")
   //convert minutes over 60 to an hour
  let hours = parseInt(req.body.recipe.prepHour) + parseInt(req.body.recipe.cookHour),
      minutes = parseInt(req.body.recipe.prepMinute) + parseInt(req.body.recipe.cookMinute),
      mins = minutes,
      total = calculateTime(minutes, hours, mins);
      
  Recipe.create(req.body.recipe, (err, newRecipe) => {
    try {
      ingredient.forEach((ingredient)=> {
        newRecipe.ingredients.push(ingredient);
      })
      //check whether the image is a https request
      if(req.body.recipe.image.match(/https:\/\//)) {
        newRecipe.image = req.body.recipe.image
      } else {
        //if not set default image
        newRecipe.image = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
      }
      newRecipe.name = req.body.recipe.name
      newRecipe.lowercaseName = req.body.recipe.name
      newRecipe.total = total;
      //create author 
      newRecipe.author.id = req.user._id
      newRecipe.author.username = req.user.username
      newRecipe.author.picture = req.user.picture;
      //push each tag value from form to tags array
      for(let i in req.body.tags) {
        newRecipe.tags.push(req.body.tags[i])
      }
      for(let i in req.body.dietary) {
        newRecipe.dietary.push(req.body.dietary[i])
      }
      //push each ingredient to ingredients array
      method.forEach((method)=> {
        newRecipe.method.push(method);
      })
      //save recipe and redirect
      newRecipe.save((err, recipe) => {
        //add the post to users uploads array
        User.findById(req.user._id, (err, foundUser) => {
          foundUser.uploads.push(recipe._id)
          foundUser.save()
        })
      });
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

  Recipe.findById(req.params.id).populate("comments").exec((err, recipe)=> {
    if(err) {
      console.log(err)
    }
      //add score to relevance and views
        recipe.views+=1;
        recipe.rating+=0.1
        recipe.save();

      //find random suggested to view recipes
      Recipe.findRandom({}, {}, {limit: 5},(err, suggested) => {
        
      res.render("./Recipe/show", {recipe, suggested})
    })
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

            Recipe.findRandom({}, {}, {limit: 3},(err, randomRecipe) => {

              
      res.render("./Recipe/edit", {recipe, ingredients: ingredientsString, method: methodString, randomRecipe})
    })
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
      //push each tag value from form to tags array
      const tags = []
      for(let i in req.body.tags) {
        tags.push(req.body.tags[i])
      }
      const dietary = []
      for(let i in req.body.dietary) {
        dietary.push(req.body.dietary[i])
      }
      
      let image;
      if(req.body.recipe.image.match(/https:\/\//)) {
        image = req.body.recipe.image
      } else {
        //if not set default image
        image = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
      }
      //CREATE UPDATED RECIPE OBJECT
      var updatedRecipe = {
        name: req.body.recipe.name,
        lowercaseName: req.body.recipe.name,
        
        image: image,
        ingredients: ingredient,
        description: req.body.recipe.description,
        prepHour: req.body.recipe.prepHour,
        prepMinute: req.body.recipe.prepMinute,
        cookHour: req.body.recipe.cookHour,
        cookMinute: req.body.recipe.cookMinute,
        servings: req.body.recipe.servings,
        tags: tags,
        dietary: dietary,
        method: method,
        total: total
      }

      //update recipe with new object
      recipe.update(updatedRecipe, (err, updatedRecipe)=> {
        
        req.flash("success", "Post Edited.");
        res.redirect(`/recipes/${params}`);
      })
      }catch(err) {
        console.log(err)
        req.flash("error", "Something went wrong. Try again.");
        res.redirect(`/recipes/${params}`);
        
      }
      })



        
    })

  //DESTROY ROUTE
  router.delete("/recipes/:id", middleware.checkRecipeOwnership ,(req, res)=> {
    Recipe.findByIdAndRemove(req.params.id, (err, deletedRecipe)=> {
      try {

        //delete the post from the users uploads
        User.findById(req.user._id, (err, foundUser) => {
          const index = foundUser.uploads.indexOf(deletedRecipe._id)
          foundUser.uploads.splice(index, 1)
          foundUser.save()
        })
        req.flash("success", "Post Deleted.");
        res.redirect("/recipes");
        
      } catch {
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/recipes")
      }
    })

  })

  //SHOW FAVOURITES
  router.get("/recipes/:id/favourites/:page", (req, res)=> {
    if(req.user) {
    User.findById(req.params.id, (err, user) =>{
      if(err) {
        res.redirect("/")
      } else {
            //save the previous search to a variable for the next page search value
        //paginate through recipes by page
        Recipe.paginate({_id: { $in: user.favouritePosts}}, { page: req.params.page, limit: 8, sort: {rating: -1} }, function(err, search) {
          currentPage = (parseInt(search.page))
          //render search page and give the previous search to give to next page buttons as value
          res.render("./Recipe/favourite", {pages: search.pages, search: search.docs, page: currentPage, user})
      });
      }
    })
  } else {
    res.redirect("/login")
  }
  })
  //POST UPVOTE ROUTES
  //Logic for favouriting posts
  router.post('/recipes/:id/favourite',  (req, res) => {
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

  //STAR RATING
  router.post("/recipes/rating", middleware.isLoggedIn, (req, res) => {

      Recipe.findById(req.body.data.postId, (err, recipe) => {
        User.findById(req.user._id, (err, user) => {
          //if user has already starred the post
          const star = Number(req.body.data.stars)
          if(user.starredPosts.includes(recipe._id)) {
            const index = req.user.starredPosts.indexOf(recipe._id)
            calculateStars(recipe, -1, -req.user.starredPostsValue[index])
            user.starredPostsValue.splice(index, 1)
            user.starredPosts.splice(index, 1)
            recipe.save()
            user.save()
            res.json({status:recipe.starStatus, user,recipe})
          } else {
            //if user has not starred the post
            user.starredPosts.push(recipe._id)
            user.starredPostsValue.push(star)
            calculateStars(recipe, 1, star)
            recipe.save()
            user.save()
            res.json({status:recipe.starStatus, user,recipe})
          }
        })
      })
    
  })
  //calculate the current star value after changes
  const calculateStars = (recipe, user, stars) => {
    recipe.usersStarred +=user
    recipe.totalStars += stars
    //check if both values are 0 and set 0 if they are as it returns NaN
    if(recipe.usersStarred === 0 && recipe.totalStars === 0) {
      recipe.starStatus = 0;
    } else {
    recipe.starStatus = recipe.totalStars / recipe.usersStarred
    }
  }

 
  //SEARCH DATABASE
  let search;
  let sort;
  router.post('/recipes/search', (req, res) =>
  {
    //save the previous search to a variable for the next page search value
    sort = {[req.body.sort]: parseInt(req.body.value)}
    search = req.body.search
    const prevSearch = search
    const prevSort = req.body.sort
    const prevValue = parseInt(req.body.value)
    //paginate through recipes by page
    Recipe.paginate({name: {$regex: req.body.search, $options: '(?i)a(?-i)cme'}}, { page: req.query.page, limit: 8, sort: sort }, function(err, search) {
      
      currentPage = (parseInt(search.page))
      //render search page and give the previous search to give to next page buttons as value
      res.render("./Recipe/search", {type: "search",pages: search.pages, prevSearch, prevSort, prevValue, search: search.docs, page: currentPage, sort, total: search.total})
  });
})


 //View database by tag
 router.get("/recipes/search/:id/:page", (req, res) => {
 
  Recipe.paginate({tags: req.params.id}, { page: req.params.page, limit: 8, sort: {rating: -1} }, function(err, search) {
    
    const prevSearch = req.params.id
    currentPage = (parseInt(search.page))
    //render search page and give the previous search to give to next page buttons as value
    res.render("./Recipe/search", {type: "tag",prevSearch, pages: search.pages, search: search.docs, page: currentPage, total: search.total})
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