const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: String,
  roomId: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
