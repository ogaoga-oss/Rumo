// ~/Rumo/server/services/notification.js

// 🔥 Socket.io インスタンスを保持
let io = null;

// ----------------------
// 🚀 初期化
// ----------------------
function initNotification(socketIO) {
  io = socketIO;
}

// ----------------------
// 📩 ユーザーに通知送信
// ----------------------
function notifyUser(userId, event, data) {
  if (!io) return;

  io.to(`user:${userId}`).emit(event, data);
}

// ----------------------
// 👥 チャンネルに通知
// ----------------------
function notifyChannel(channelId, event, data) {
  if (!io) return;

  io.to(`channel:${channelId}`).emit(event, data);
}

// ----------------------
// 📨 フレンド申請通知
// ----------------------
function sendFriendRequestNotification(toUserId, fromUser) {
  notifyUser(toUserId, "friend_request", {
    from: {
      id: fromUser._id,
      username: fromUser.username
    }
  });
}

// ----------------------
// 💬 新着メッセージ通知
// ----------------------
function sendMessageNotification(channelId, message) {
  notifyChannel(channelId, "new_message", {
    message
  });
}

// ----------------------
// 🔔 汎用通知
// ----------------------
function sendSystemNotification(userId, text) {
  notifyUser(userId, "system_notification", {
    text
  });
}

module.exports = {
  initNotification,
  notifyUser,
  notifyChannel,
  sendFriendRequestNotification,
  sendMessageNotification,
  sendSystemNotification
};
