// ~/Rumo/client/js/inviteLink.js

// ----------------------
// DOM
// ----------------------
const inviteInput = document.getElementById("invite-code");
const submitBtn = document.getElementById("invite-submit");
const statusText = document.getElementById("invite-status");

// ----------------------
// URLからコード取得
// ----------------------
function getInviteCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// ----------------------
// 初期処理
// ----------------------
function init() {
  const code = getInviteCodeFromURL();

  if (code) {
    inviteInput.value = code;
  }
}

// ----------------------
// 認証処理
// ----------------------
async function verifyInvite() {
  const code = inviteInput.value.trim();

  if (!code) {
    statusText.innerText = "コードを入力して";
    return;
  }

  try {
    const res = await fetch("/api/invite/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (res.ok) {
      statusText.innerText = "OK！入れるよ";

      // 少し待ってからダッシュボードへ
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 800);

    } else {
      statusText.innerText = data.error || "無効なコード";
    }

  } catch (err) {
    console.error("認証失敗:", err);
    statusText.innerText = "エラー発生";
  }
}

// ----------------------
// イベント
// ----------------------
submitBtn?.addEventListener("click", verifyInvite);

inviteInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    verifyInvite();
  }
});

// ----------------------
// 起動
// ----------------------
init();
