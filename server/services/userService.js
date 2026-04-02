const mongoose = require("mongoose");

// ユーザースキーマ
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  points: { type: Number, default: 0 },
  invites: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ユーザー作成
async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

// ユーザー取得
async function findUserById(userId) {
  return await User.findById(userId);
}

// ポイント加算
async function addPoints(userId, points = 1) {
  return await User.findByIdAndUpdate(
    userId,
    { $inc: { points: points } },
    { new: true }
  );
}

// 招待加算
async function addInvite(userId) {
  return await User.findByIdAndUpdate(
    userId,
    { $inc: { invites: 1 } },
    { new: true }
  );
}

// ランキング上位10人取得
async function getRanking() {
  return await User.find()
    .sort({ invites: -1 })
    .limit(10)
    .select("username invites"); // idは自動で含まれる
}

module.exports = {
  User,
  createUser,
  findUserById,
  addPoints,
  addInvite,
  getRanking
};
