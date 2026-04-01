// ~/Rumo/server/services/search.js

const User = require("../models/User");
const Channel = require("../models/Channel");
const Message = require("../models/Message");

// ----------------------
// 🔍 ユーザー検索
// ----------------------
async function searchUsers(query) {
  if (!query) return [];

  return await User.find({
    username: { $regex: query, $options: "i" }
  })
    .select("_id username")
    .limit(20);
}

// ----------------------
// 🔍 チャンネル検索
// ----------------------
async function searchChannels(query, userId) {
  if (!query) return [];

  return await Channel.find({
    name: { $regex: query, $options: "i" },
    members: userId // 自分がいるチャンネルだけ
  })
    .select("_id name type")
    .limit(20);
}

// ----------------------
// 🔍 メッセージ検索
// ----------------------
async function searchMessages(query, userId) {
  if (!query) return [];

  return await Message.find({
    content: { $regex: query, $options: "i" }
  })
    .populate({
      path: "channel",
      match: { members: userId } // 自分が見れるチャンネルだけ
    })
    .populate("sender", "_id username")
    .limit(50);
}

// ----------------------
// 🔍 全体検索
// ----------------------
async function globalSearch(query, userId) {
  const [users, channels, messages] = await Promise.all([
    searchUsers(query),
    searchChannels(query, userId),
    searchMessages(query, userId)
  ]);

  return {
    users,
    channels,
    messages: messages.filter(m => m.channel) // 見れるものだけ
  };
}

module.exports = {
  searchUsers,
  searchChannels,
  searchMessages,
  globalSearch
};
