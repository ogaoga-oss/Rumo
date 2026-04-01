const User = require("../models/User");
const { grantRandomTrial, hasPremiumAccess } = require("./trialService");
const io = require("../socket");

// --- 週次トライアル自動付与 ---
// 毎週日曜日 0:00に実行する想定（cronやsetIntervalで実行可能）
async function weeklyTrialGrant(){
  // 一般ユーザー（非プレミアム・非トライアル）を取得
  const generalUsers = await User.find({ isPremium:false, "trialPremium.active": { $ne:true } });
  if(generalUsers.length===0) return;

  // ランダムに1ユーザー付与（複数ユーザーにする場合はforループ）
  const username = await grantRandomTrial(generalUsers.map(u=>u._id));
  console.log(`トライアル付与: ${username}`);
}

// --- トライアル期限切れ自動チェック ---
// 1日1回または毎分チェックでOK
async function trialExpiryCheck(){
  const now = new Date();
  const users = await User.find({ "trialPremium.active": true });
  for(const u of users){
    if(new Date(u.trialPremium.expiresAt) <= now){
      u.trialPremium.active = false;
      await u.save();

      // Socket通知
      io.to(u.socketId).emit("trialEnded",{message:"プレミアムトライアルが終了しました"});
      console.log(`トライアル終了: ${u.username}`);
    }
  }
}

// --- スケジューラ起動 ---
function startTrialScheduler(){
  // 1. 週次付与（例: 毎週日曜0時）
  const oneWeek = 7*24*3600*1000;
  setInterval(weeklyTrialGrant, oneWeek);

  // 2. 期限切れチェック（毎分）
  setInterval(trialExpiryCheck, 60*1000);
}

module.exports = { startTrialScheduler };
