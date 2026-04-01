const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

// 🔍 ユーザー検索
router.get("/search/:username", auth, async (req, res) => {
  const users = await User.find({
    username: { $regex: req.params.username, $options: "i" }
  }).select("_id username");

  res.json(users);
});

// 📩 申請送信
router.post("/request", auth, async (req, res) => {
  const { to } = req.body;

  const request = new FriendRequest({
    from: req.user.userId,
    to
  });

  await request.save();

  res.json({ message: "申請送信" });
});

// 📬 受信一覧
router.get("/requests", auth, async (req, res) => {
  const requests = await FriendRequest.find({
    to: req.user.userId,
    status: "pending"
  }).populate("from", "username");

  res.json(requests);
});

// ✅ 承認
router.post("/accept", auth, async (req, res) => {
  const { requestId } = req.body;

  const reqData = await FriendRequest.findById(requestId);

  reqData.status = "accepted";
  await reqData.save();

  res.json({ message: "承認" });
});

// ❌ 拒否
router.post("/reject", auth, async (req, res) => {
  const { requestId } = req.body;

  const reqData = await FriendRequest.findById(requestId);

  reqData.status = "rejected";
  await reqData.save();

  res.json({ message: "拒否" });
});

// 👥 フレンド一覧
router.get("/list", auth, async (req, res) => {
  const friends = await FriendRequest.find({
    status: "accepted",
    $or: [
      { from: req.user.userId },
      { to: req.user.userId }
    ]
  }).populate("from to", "username");

  res.json(friends);
});

module.exports = router;
