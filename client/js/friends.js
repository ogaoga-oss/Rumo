const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/pages/login.html";
}

// 🏠 戻る
function goHome() {
  window.location.href = "/pages/home.html";
}

// 🔍 検索
async function searchUser() {
  const query = document.getElementById("searchInput").value;

  const res = await fetch(`http://localhost:8082/api/friends/search/${query}`, {
    headers: {
      "Authorization": token
    }
  });

  const users = await res.json();

  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${user.username}
      <button onclick="sendRequest('${user._id}')">追加</button>
    `;
    container.appendChild(div);
  });
}

// 📩 申請
async function sendRequest(userId) {
  await fetch("http://localhost:8082/api/friends/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ to: userId })
  });

  alert("申請送信");
}

// 📬 リクエスト取得
async function loadRequests() {
  const res = await fetch("http://localhost:8082/api/friends/requests", {
    headers: { "Authorization": token }
  });

  const data = await res.json();

  const container = document.getElementById("requests");
  container.innerHTML = "";

  data.forEach(req => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${req.from.username}
      <button onclick="accept('${req._id}')">承認</button>
      <button onclick="reject('${req._id}')">拒否</button>
    `;
    container.appendChild(div);
  });
}

// ✅ 承認
async function accept(id) {
  await fetch("http://localhost:8082/api/friends/accept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ requestId: id })
  });

  loadRequests();
  loadFriends();
}

// ❌ 拒否
async function reject(id) {
  await fetch("http://localhost:8082/api/friends/reject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ requestId: id })
  });

  loadRequests();
}

// 👥 フレンド一覧
async function loadFriends() {
  const res = await fetch("http://localhost:8082/api/friends/list", {
    headers: { "Authorization": token }
  });

  const data = await res.json();

  const container = document.getElementById("friends");
  container.innerHTML = "";

  data.forEach(f => {
    const friend =
      f.from._id === getMyId() ? f.to : f.from;

    const div = document.createElement("div");
    div.innerHTML = `
      ${friend.username}
      <button onclick="startChat('${friend._id}')">チャット</button>
    `;
    container.appendChild(div);
  });
}

// 仮（後で正確化）
function getMyId() {
  return localStorage.getItem("myId");
}

function startChat(userId) {
  localStorage.setItem("chatUser", userId);
  window.location.href = "/pages/chat.html";
}

// DM開始
function startChat(userId) {
  localStorage.setItem("chatUser", userId);
  window.location.href = "/pages/chat.html";
}

// 初期ロード
loadRequests();
loadFriends();
