const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// メッセージ取得
router.get("/:roomId", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: 1 })
    .limit(100);

  res.json(messages);
});

// メッセージ保存
router.post("/", async (req, res) => {
  const { userId, username, roomId, message } = req.body;

  const newMessage = new Message({
    userId,
    username,
    roomId,
    message
  });

  await newMessage.save();

  res.json(newMessage);
});

module.exports = router;
