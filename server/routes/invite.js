const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { createInvite } = require("../services/inviteService");

// 招待コード発行
router.post("/create", auth, (req, res) => {
  const user = req.user;

  const invite = createInvite(user.id);

  res.json({
    success: true,
    code: invite.code
  });
});

module.exports = router;
