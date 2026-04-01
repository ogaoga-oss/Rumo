const User = require("../models/User");

/**
 * ユーザーのアクションに応じてポイント付与
 * @param {String} userId
 * @param {String} actionType - 例: "login", "chat", "mission"
 */
async function handleActionReward(userId, actionType) {
  const user = await User.findById(userId);
  if(!user) return;

  let pointsToAdd = 0;
  switch(actionType) {
    case "login": pointsToAdd = 10; break;
    case "chat": pointsToAdd = 5; break;
    case "mission": pointsToAdd = 20; break;
    default: pointsToAdd = 0;
  }

  user.points = (user.points || 0) + pointsToAdd;
  await user.save();
}

module.exports = { handleActionReward };
