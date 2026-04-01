// ~/Rumo/client/js/inviteDashboard.js

// ----------------------
// DOM
// ----------------------
const inviteList = document.getElementById("invite-list");
const createBtn = document.getElementById("create-invite-btn");

// ----------------------
// 初期ロード
// ----------------------
async function loadInvites() {
  try {
    const res = await fetch("/api/invite");
    const data = await res.json();

    renderInvites(data.invites || []);

  } catch (err) {
    console.error("招待コード取得失敗:", err);
  }
}

// ----------------------
// 表示
// ----------------------
function renderInvites(invites) {
  inviteList.innerHTML = "";

  invites.forEach(invite => {
    const el = document.createElement("div");
    el.className = "invite-item";

    el.innerHTML = `
      <div class="invite-code">${invite.code}</div>
      <div class="invite-info">
        使用回数: ${invite.uses} / ${invite.maxUses}
      </div>
      <button onclick="copyInvite('${invite.code}')">コピー</button>
    `;

    inviteList.appendChild(el);
  });
}

// ----------------------
// コピー
// ----------------------
function copyInvite(code) {
  const url = `${window.location.origin}/invite.html?code=${code}`;

  navigator.clipboard.writeText(url)
    .then(() => {
      alert("コピーした！");
    })
    .catch(() => {
      alert("コピー失敗");
    });
}

// ----------------------
// 新規作成
// ----------------------
createBtn?.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/invite/create", {
      method: "POST"
    });

    const data = await res.json();

    if (res.ok) {
      alert(`作成成功: ${data.code}`);
      loadInvites();
    } else {
      alert(data.error || "作成失敗");
    }

  } catch (err) {
    console.error("招待コード作成失敗:", err);
  }
});

// ----------------------
// 自動更新（任意）
// ----------------------
setInterval(loadInvites, 10000); // 10秒ごと

// ----------------------
// 起動
// ----------------------
loadInvites();
