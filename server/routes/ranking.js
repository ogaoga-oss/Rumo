const express = require("express");
const router = express.Router();

const { users } = require("../services/userService");

router.get("/", (req, res) => {
  const sorted = [...users].sort((a,b)=>(b.invites||0)-(a.invites||0));

  const ranking = sorted.map((u, i) => {
    const top = sorted[0];
    const diff = top ? (top.invites || 0) - (u.invites || 0) : 0;

    return {
      rank: i + 1,
      username: u.username,
      invites: u.invites || 0,
      diff // 👈これ追加
    };
  });

  res.json(ranking);
});

module.exports = router;
