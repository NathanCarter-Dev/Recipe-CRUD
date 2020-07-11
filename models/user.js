var mongoose = require("mongoose");
var mongooseLocalStrategy = require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate')

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  picture: String,
  favouritePosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  admin: {type: Boolean, default: false}
})

userSchema.plugin(mongooseLocalStrategy);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);