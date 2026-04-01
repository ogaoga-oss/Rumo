const socket = io("http://localhost:8082");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");

let username = "";
let userId = "";
let roomId = "";

const token = localStorage.getItem("token");
const chatUser = localStorage.getItem("chatUser"); // 相手

// 🔐 ユーザー取得
async function getUser() {
  const res = await fetch("http://localhost:8082/api/user/me", {
    headers: { "Authorization": token }
  });

  const user = await res.json();

  username = user.username;
  userId = user._id;

  // 💥 ここが重要（DM部屋生成）
  roomId = getRoomId(userId, chatUser);

  startChat();
}

getUser();

// 🧠 ルーム生成
function getRoomId(id1, id2) {
  return [id1, id2].sort().join("_");
}

// 🚀 チャット開始
function startChat() {
  socket.emit("joinRoom", roomId);

  loadMessages();

  socket.on("receiveMessage", (data) => {
    if (data.roomId === roomId) {
      addMessage(data.username, data.message, data.userId === userId);
    }
  });
}

// 📥 過去メッセージ
async function loadMessages() {
  const res = await fetch(`http://localhost:8082/api/messages/${roomId}`);
  const data = await res.json();

  messagesDiv.innerHTML = "";

  data.forEach(msg => {
    addMessage(msg.username, msg.message, msg.userId === userId);
  });
}

// 📤 送信
function sendMessage() {
  const message = input.value;
  if (!message) return;

  socket.emit("sendMessage", {
    userId,
    username,
    roomId,
    message
  });

  input.value = "";
}

// UI
function addMessage(username, message, isMine) {
  const div = document.createElement("div");
  div.classList.add("message");

  if (isMine) div.classList.add("my-message");

  div.innerText = `${username}: ${message}`;

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

div.className = msg.sender === myId ? "message me" : "message other";
