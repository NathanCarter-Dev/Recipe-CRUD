var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  author: {
    id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    username: String,
  },
  picture: String,
  text: String
})

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;