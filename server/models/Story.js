const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24時間で自動削除
  }
});

module.exports = mongoose.model("Story", StorySchema);
