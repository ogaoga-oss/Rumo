const User = require("../models/User");

/**
 * ランダムなユーザーに1週間トライアル付与
 * @param {Array} userIds - ユーザーID配列
 * @returns {String} grantedUserId - 付与されたユーザーID
 */
async function grantRandomTrial(userIds) {
  if(userIds.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * userIds.length);
  const userId = userIds[randomIndex];

  const user = await User.findById(userId);
  if(!user) return null;

  // トライアルポイント付与（例: 100ポイント）
  user.points = (user.points || 0) + 100;
  await user.save();

  return user._id.toString();
}

module.exports = { grantRandomTrial };
