// 🌟 登録
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const inviteCode = localStorage.getItem("inviteCode");

  if (!inviteCode) {
    alert("招待コードが必要です");
    window.location.href = "/pages/invite.html";
    return;
  }

  const res = await fetch("http://localhost:8082/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password,
      inviteCode
    })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("error").innerText = data.message;
    return;
  }

  // 登録成功 → ログインへ
  window.location.href = "/pages/login.html";
}

// 🔑 ログイン
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:8082/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("error").innerText = data.message;
    return;
  }

  // JWT保存
  localStorage.setItem("token", data.token);

  // ホームへ
  window.location.href = "/pages/home.html";
}
