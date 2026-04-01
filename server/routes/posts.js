const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Post = require("../models/Post");

div.className = "post";


// 📝 投稿作成
router.post("/", auth, async (req, res) => {
  const { content, image } = req.body;

  const post = new Post({
    userId: req.user.userId,
    username: req.user.username,
    content,
    image
  });

  await post.save();
  res.json(post);
});

// 📰 タイムライン
router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
  res.json(posts);
});

// ❤️ いいね
router.post("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  const alreadyLiked = post.likes.includes(req.user.userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id.toString() !== req.user.userId);
  } else {
    post.likes.push(req.user.userId);
  }

  await post.save();

  res.json(post);
});

module.exports = router;
