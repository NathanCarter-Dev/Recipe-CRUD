

var Recipe = require("./models/recipe")
var Comment = require("./models/comment");
var seed = [
  {
    author: {
      username: "bob",
      id: "5efe40874ba0d6022607c205"
    },
    name: "Big Boy Curry",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Very nice curry",
    cook: "20",
    prep: "15",
    servings: "4",
    ingredients: ["1/2 cup olive oil", "1/4 cup Champagne vinegar or white wine vinegar", "1 teaspoon ground coriander", "1 teaspoon kosher salt", "1/4 teaspoon freshly ground black pepper", "1/8 teaspoon ground cardamom", "1/2 large cantaloupe, rind and seeds removed, flesh cut into 1-inch pieces", "1 large English hothouse cucumber, sliced on a diagonal 1/2 inch thick", "2 Fresno chiles, thinly sliced", "1/2 cup unsalted, roasted pumpkin seeds (pepitas)", "1/4 cup chopped cilantro", "1/4 cup chopped mint", "Sumac (for serving)"],
    method: ["chop chicken, place in boiler, bla bla", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"]
  },
  {
    author: {
      username: "bob",
      id: "5efe40874ba0d6022607c205"
    },
    name: "Big Boy Curry 2",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Very nice curry",
    cook: "40",
    prep: "25",
    servings: "8",
    ingredients: ["Peas", "dog shit", "chickpeas"],
    method: ["chop chicken, place in boiler, bla bla", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"]
  },
  {
    author: {
      username: "bob",
      id: "5efe40874ba0d6022607c205"
    },
    name: "Small Boy Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Very nice curry",
    cook: "30",
    prep: "15",
    servings: "4",
    ingredients: ["Peas", "dog shit", "chickpeas"],
    method: ["chop chicken, place in boiler, bla bla", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"]
  },
  {
    author: {
      username: "bob",
      id: "5efe40874ba0d6022607c205"
    },
    name: "Dog Food",
    image: "https://images.unsplash.com/photo-1583272045290-f6f80fcb7007?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Very nice curry",
    cook: "20",
    prep: "30",
    servings: "4",
    ingredients: ["Peas", "dog shit", "chickpeas"],
    method: ["chop chicken, place in boiler, bla bla", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"]
  },
  {
        author: {
      username: "bob",
      id: "5efe40874ba0d6022607c205"
    },
    name: "Very Noice Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Very nice curry",
    cook: "20",
    prep: "15",
    servings: "4",
    ingredients: ["Peas", "dog shit", "chickpeas"],
    method: ["chop chicken, place in boiler, bla bla", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"]
  },
]

function seedDB() {
  Recipe.deleteMany({}, function(err, deleted) {
    if(err) {

    } else {
      seed.forEach(function(seed) {
        Recipe.create(seed, function(err, createdRecipe) {
          if(err) {
    
          } else {
            Comment.create({author: "nathan", text: "VERY NICE YES"}, function(err, createdComment) {
             if(err) {
    
             } else {
               createdRecipe.comments.push(createdComment);
               createdRecipe.save(function(err, recipe) {
                 if(err) {
    
                 } else {

                 }
               })
             }
            })
          }
        })
      })
    }
  })
 
}

module.exports = seedDB;