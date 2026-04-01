const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SECRET } = require("../config/auth");

const { verifyInvite, consumeInvite } = require("../services/inviteService");
const { createUser, addPoints } = require("../services/userService");

// 登録
router.post("/register", async (req, res) => {
  const { username, password, inviteCode } = req.body;

  const result = verifyInvite(inviteCode);
  if(!result.valid){
    return res.json({ success:false, message:"招待コード無効" });
  }

  const hashed = await bcrypt.hash(password, 8);

  const user = {
    id: Date.now().toString(),
    username,
    password: hashed,
    points: 0,
    invites: 0
  };

  createUser(user);

// 使用回数消費
  consumeInvite(result.invite);

  res.json({ success: true });
});

// ログイン（そのまま）
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.json({ success: false });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ success: false });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
});

module.exports = router;


  // 招待者にポイント
 const inviterId = result.invite.createdBy;

if(inviterId !== "system"){
  addPoints(inviterId, 100);
  addInvite(inviterId); // 👈これが「招待成功カウント」
}


  consumeInvite(result.invite);

  res.json({ success: true });
});






