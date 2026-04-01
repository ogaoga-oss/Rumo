
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: String,   // ←追加
  username: String, // ←追加
  text: String,
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);

const username = localStorage.getItem("username");
const userId = localStorage.getItem("userId");

