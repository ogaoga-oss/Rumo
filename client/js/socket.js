// 🔥 Rumo 全通信ハブ

const socket = io();

// =========================
// 📦 共通イベント送信
// =========================

export function sendMessage(data){
  socket.emit("chat:send", data);
}

export function sendOffer(data){
  socket.emit("call:offer", data);
}

export function sendAnswer(data){
  socket.emit("call:answer", data);
}

export function sendInvite(data){
  socket.emit("invite:create", data);
}

// =========================
// 📥 受信イベント登録
// =========================

export function onMessage(callback){
  socket.on("chat:receive", callback);
}

export function onOffer(callback){
  socket.on("call:offer", callback);
}

export function onAnswer(callback){
  socket.on("call:answer", callback);
}

export function onNotification(callback){
  socket.on("notify", callback);
}

// =========================
// 👤 ユーザー識別
// =========================

export function registerUser(userId){
  socket.emit("user:join", userId);
}

// 📝 投稿送信
function sendPost(data){
  socket.emit("create_post", data);
}

// 📝 投稿受信
function onNewPost(callback){
  socket.on("new_post", callback);
}
// ❤️ いいね送信
function sendLike(data){
  socket.emit("like_post", data);
}

// ❤️ いいね受信
function onPostLiked(callback){
  socket.on("post_liked", callback);
}
