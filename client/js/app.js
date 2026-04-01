const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/pages/login.html";
}

function go(page) {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = page;
  }, 200);
}

// 👤 ユーザー情報取得
async function loadUser() {
  const res = await fetch("http://localhost:8082/api/user/me", {
    headers: {
      "Authorization": token
    }
  });

  const user = await res.json();

  document.getElementById("username").innerText = user.username;
}

loadUser();

// ログアウト
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/login.html";
}

function goFriends() {
  alert("友達機能（次）");
}

function goChat() {
  window.location.href = "/pages/chat.html";
}

function goRequests() {
  alert("リクエスト機能（後で）");
}

function goSettings() {
  alert("設定（後で）");
}

// userId保存
localStorage.setItem("myId", user._id);

const token = localStorage.getItem("token");

// 投稿
async function createPost() {
  const content = document.getElementById("postContent").value;

  await fetch("http://localhost:8082/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ content })
  });

  document.getElementById("postContent").value = "";
  loadPosts();
}

// ストーリー投稿
async function uploadStory() {
  const file = document.getElementById("storyImage").files[0];

  const formData = new FormData();
  formData.append("image", file);

  await fetch("http://localhost:8082/api/upload", {
    method: "POST",
    body: formData
  }).then(res => res.json())
    .then(async data => {
      await fetch("http://localhost:8082/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ image: data.url })
      });

      loadStories();
    });
}

// ストーリー取得
async function loadStories() {
  const res = await fetch("http://localhost:8082/api/story", {
    headers: { "Authorization": token }
  });

  const stories = await res.json();

  const container = document.getElementById("stories");
  container.innerHTML = "";

  stories.forEach(story => {
    const img = document.createElement("img");
    img.src = story.image;
    img.style.width = "80px";
    img.style.margin = "5px";

    container.appendChild(img);
  });
}

// 初期ロード
loadStories();


// タイムライン
async function loadPosts() {
  const res = await fetch("http://localhost:8082/api/posts", {
    headers: { "Authorization": token }
  });

  const posts = await res.json();

  const container = document.getElementById("timeline");
  container.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");

    div.innerHTML = `
      <b>${post.username}</b><br>
      ${post.content}<br>
      ❤️ ${post.likes.length}
      <button onclick="likePost('${post._id}')">いいね</button>
      <hr>
    `;

    container.appendChild(div);
  });
}

// いいね
async function likePost(id) {
  await fetch(`http://localhost:8082/api/posts/like/${id}`, {
    method: "POST",
    headers: { "Authorization": token }
  });

  loadPosts();
}

// 初期ロード
loadPosts();

div.onclick = () => {
  openModal(`
    <h3>${post.username}</h3>
    <p>${post.content}</p>
    <p>❤️ ${post.likes.length}</p>
  `);
};

function openProfile(user) {
  openModal(`
    <h2>${user.username}</h2>
    <img src="${user.icon || ''}" width="80">
    <br>
    <button onclick="startChat('${user._id}')">チャット</button>
    <button onclick="startCall('${user._id}')">通話</button>
  `);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


function openModal(contentHTML) {
  document.body.style.overflow = "hidden";
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modalContent").innerHTML = contentHTML;
}

function closeModal() {
  document.body.style.overflow = "auto";
  document.getElementById("modal").classList.add("hidden");
}

function showToast(message) {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  // 3秒後に消す
  setTimeout(() => {
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}



function showToast(message, type = "default") {
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerText = message;

  document.getElementById("toastContainer").appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

toast.onclick = () => {
  window.location.href = "chat.html";
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("SW登録成功"))
    .catch(err => console.log(err));
}


async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("通知OK");
  }
}

async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "YOUR_PUBLIC_VAPID_KEY"
  });

  // サーバーに送る
  await fetch("http://localhost:8082/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sub)
  });
}

function getUnread() {
  return parseInt(localStorage.getItem("unread") || "0");
}

function setUnread(count) {
  localStorage.setItem("unread", count);
  updateBadge();
}

function updateBadge() {
  const badge = document.getElementById("chatBadge");
  const count = getUnread();

  if (count > 0) {
    badge.innerText = count;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}






