const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Story = require("../models/Story");

// 投稿
router.post("/", auth, async (req, res) => {
  const { image } = req.body;

  const story = new Story({
    userId: req.user.userId,
    username: req.user.username,
    image
  });

  await story.save();
  res.json(story);
});

// 一覧
router.get("/", auth, async (req, res) => {
  const stories = await Story.find().sort({ createdAt: -1 });
  res.json(stories);
});

module.exports = router;
