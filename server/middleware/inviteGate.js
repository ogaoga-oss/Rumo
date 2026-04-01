const { validateInviteCode } = require("../services/inviteService");

module.exports = async (req, res, next) => {
  const code = req.headers["x-invite-code"];

  if (!code) {
    return res.status(403).json({ message: "招待コードが必要です" });
  }

  const result = await validateInviteCode(code);

  if (!result.valid) {
    return res.status(403).json({ message: result.message });
  }

  next();
};
