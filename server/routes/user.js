const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// 自分の情報取得
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

module.exports = router;

// =======================
// プレミアムシステムAPI
// =======================

// ① ポイントをコインに変換（50ポイント→1コイン、7日間有効）
app.post("/api/convert-coin", async (req, res) => {
  const { userId, pointsToConvert } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.json({ success: false, message: "ユーザーなし" });

  if (user.points < pointsToConvert)
    return res.json({ success: false, message: "ポイント不足" });

  user.points -= pointsToConvert;
  const coinsToAdd = Math.floor(pointsToConvert / 50);
  if (!user.coins) user.coins = [];
  user.coins.push({
    amount: coinsToAdd,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日間
  });

  await user.save();
  res.json({ success: true, coinsAdded: coinsToAdd });
});

// ② プレミアム演出用コイン消費
app.post("/api/use-coin", async (req, res) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.json({ success: false, message: "ユーザーなし" });

  let remaining = amount;

  user.coins = user.coins.filter((c) => {
    if (remaining <= 0) return true;
    if (c.expiresAt < new Date()) return false; // 期限切れ
    if (c.amount <= remaining) {
      remaining -= c.amount;
      return false;
    } else {
      c.amount -= remaining;
      remaining = 0;
      return true;
    }
  });

  if (remaining > 0)
    return res.json({ success: false, message: "コイン不足" });

  await user.save();
  res.json({ success: true });
});

// ③ 共通ポイント自動加算関数（ログイン、デイリークエスト、いいね、フォロー用）
async function autoAddPoints(userId, type) {
  const user = await User.findById(userId);
  if (!user) return;

  let pointsToAdd = 0;
  switch (type) {
    case "login":
      pointsToAdd = 1;
      break;
    case "quest":
      pointsToAdd = 10;
      break;
    case "postLike":
      pointsToAdd = 10;
      break;
    case "follow":
      pointsToAdd = 5;
      break;
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyTotal = user.dailyPoints?.[today] || 0;
  let dailyLimit = user.isPremium ? Infinity : 20; // プレミアムなら無制限
  if (dailyTotal >= dailyLimit) return;

  const pointsCanAdd = Math.min(pointsToAdd, dailyLimit - dailyTotal);
  user.points += pointsCanAdd;
  user.dailyPoints = user.dailyPoints || {};
  user.dailyPoints[today] = (user.dailyPoints[today] || 0) + pointsCanAdd;

  // 自動コイン変換
  if (user.points >= 50) {
    const coinsToAdd = Math.floor(user.points / 50);
    user.coins.push({
      amount: coinsToAdd,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    user.points -= coinsToAdd * 50;
  }

  await user.save();
}
