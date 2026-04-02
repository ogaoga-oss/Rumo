const { getRanking, findUserById, addPoints } = require("./userService");

let lastRewardDate = null;

// 新しい日かチェック
function isNewDay() {
  const today = new Date().toDateString();
  if (lastRewardDate !== today) {
    lastRewardDate = today;
    return true;
  }
  return false;
}

// デイリー報酬付与
async function giveDailyRewards() {
  if (!isNewDay()) return;

  const ranking = await getRanking();
  if (!ranking || ranking.length === 0) return;

  // 上位3人に報酬
  const rewards = [1000, 500, 300];

  for (let i = 0; i < Math.min(3, ranking.length); i++) {
    const user = await findUserById(ranking[i]._id);
    if (user) {
      await addPoints(user._id, rewards[i]);
      console.log(`🎁 ${user.username} に ${rewards[i]}pt`);
    }
  }
}

module.exports = { giveDailyRewards };
