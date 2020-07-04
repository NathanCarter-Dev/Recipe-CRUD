var mongoose = require("mongoose");
var mongooseLocalStrategy = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favouritePosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  admin: {type: Boolean, default: false}
})

userSchema.plugin(mongooseLocalStrategy);

module.exports = mongoose.model("User", userSchema);