var mongoose = require("mongoose");
const { date } = require("faker");
const random = require('mongoose-simple-random');
var mongoosePaginate = require('mongoose-paginate');


var recipeSchema = new mongoose.Schema({
  author: {
    id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    username: String,
    picture: String
  },
  name: String,
  lowercaseName: {type:String, lowercase: true},
  image: String,
  description: String,
  prepHour: Number,
  prepMinute: Number,
  cookHour: Number,
  cookMinute: Number,
  total: String,
  servings: Number,
  likes_count: {Number, default: 0},
    starStatus: {type: Number, default: 0},
    totalStars: {type: Number, default: 0},
    usersStarred: {type: Number, default: 0},
  
  date: {type: Date, default: Date.now},
  views: {type: Number, default: 0},
  rating: {type:Number, default: 0},
  method: [String],
  ingredients: [String],
  tags: {type: Array},
  dietary: {type: Array},
  comments: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
})

recipeSchema.plugin(mongoosePaginate);
recipeSchema.plugin(random)
var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;