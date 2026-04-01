const express = require('express');
const router = express.Router();

// デモ用ユーザーデータ
let users = [
  { userId:"user1", username:"Alice", points:200, coins:0, daily:{messages:0, posts:0, friends:0, invites:0} },
  { userId:"user2", username:"Bob", points:150, coins:0, daily:{messages:0, posts:0, friends:0, invites:0} }
];

// 各アクションのポイントと一日制限
const pointRules = {
  message: { points:5, limit:50 },
  post: { points:20, limit:10 },
  friend: { points:30, limit:5 },
  invite: { points:100, limit:5 }
};

// ポイント付与
router.post('/earn/:userId/:action', (req,res)=>{
  const user = users.find(u=>u.userId===req.params.userId);
  if(!user) return res.json({ error:"ユーザーなし" });
  const rule = pointRules[req.params.action];
  if(!rule) return res.json({ error:"アクションなし" });

  if(user.daily[req.params.action] >= rule.limit){
    return res.json({ message:"本日の上限に達しました", points:user.points });
  }

  user.points += rule.points;
  user.daily[req.params.action]++;
  res.json({ message:`${rule.points}pt獲得！`, points:user.points });
});

// 日次リセット（デモ用手動トリガー）
router.post('/reset-daily', (req,res)=>{
  users.forEach(u=>{
    u.daily = { messages:0, posts:0, friends:0, invites:0 };
  });
  res.json({ message:"日次制限リセット完了" });
});

// ログインボーナス
router.post('/login-bonus/:userId', (req,res)=>{
  const user = users.find(u=>u.userId===req.params.userId);
  if(!user) return res.json({ error:"ユーザーなし" });
  user.points += 50;
  res.json({ message:"ログインボーナス50pt付与", points:user.points });
});

// ランキング報酬（デモ）
router.get('/ranking-reward', (req,res)=>{
  const ranking = users.sort((a,b)=>b.points - a.points);
  res.json({
    top: ranking[0].username,
    reward: 100 // デモ: 1位に100pt
  });
});

module.exports = router;
