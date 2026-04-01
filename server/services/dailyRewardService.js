const { getRanking, findUserById } = require("./userService");

let lastRewardDate = null;

// 日付チェック
function isNewDay(){
  const today = new Date().toDateString();
  if(lastRewardDate !== today){
    lastRewardDate = today;
    return true;
  }
  return false;
}

// 報酬配布
function giveDailyRewards(addPoints){
  if(!isNewDay()) return;

  const ranking = getRanking();

  if(ranking.length === 0) return;

  // 上位3人に報酬
  const rewards = [1000, 500, 300];

  ranking.slice(0,3).forEach((user, i) => {
    const target = findUserById(user.id);
    if(target){
      addPoints(target.id, rewards[i]);
      console.log(`🎁 ${target.username} に ${rewards[i]}pt`);
    }
  });
}

module.exports = { giveDailyRewards };
