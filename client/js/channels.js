// Socket接続
let socket;
let currentRoom = "global";
let username = "匿名";

// 初期化
function initChat() {
  username = document.getElementById("username").value.trim() || "匿名";

  socket = io("/", {
    query: { username }
  });

  // メッセージ受信（リアルタイム）
  socket.on("chatMessage", (data) => {
    addMessage(data.username, data.message, false);
  });

  // 初期メッセージ読み込み
  loadMessages();
}

// メッセージ取得（API）
async function loadMessages() {
  const res = await fetch(`/api/channels/${currentRoom}`);
  const messages = await res.json();

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    addMessage(msg.username, msg.message, msg.username === username);
  });
}

// メッセージ送信
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if(!message) return;

  // APIに保存
  await fetch("/api/channels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      roomId: currentRoom,
      message
    })
  });

  // Socketで送信
  socket.emit("chatMessage", { message });

  // 自分のメッセージ表示
  addMessage(username, message, true);

  input.value = "";
}

// メッセージ表示
function addMessage(user, message, isSelf) {
  const chatBox = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(isSelf ? "self" : "other");

  div.innerHTML = `
    <strong>${user}</strong>
    ${message}
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// チャンネル切り替え
function changeRoom(roomId) {
  currentRoom = roomId;
  loadMessages();
}

// ボタンイベント
document.getElementById("sendBtn")?.addEventListener("click", sendMessage);
document.getElementById("startBtn")?.addEventListener("click", initChat);
