var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
  author: {
    id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    username: String
  },
  name: String,
  image: String,
  description: String,
  prepHour: Number,
  prepMinute: Number,
  cookHour: Number,
  cookMinute: Number,
  total: String,
  servings: Number,
  likes_count: Number,
  method: [String],
  ingredients: [String],
  comments: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
})

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;