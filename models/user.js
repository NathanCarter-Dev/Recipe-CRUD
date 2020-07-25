var mongoose = require("mongoose");
var mongooseLocalStrategy = require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate')
var mongoosePaginate = require('mongoose-paginate');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  picture: String,
  favouritePosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  uploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  followedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  starredPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  starredPostsValue: [Number],
  admin: {type: Boolean, default: false},
  lastOnline: {type: Date, default: Date.now},
  mood: String,
  bio: String
})

userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseLocalStrategy);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);