// ~/Rumo/client/js/ui.js

// ----------------------
// 通知（トースト）
// ----------------------
function showNotification(message, type = "info") {
  const container = getOrCreateContainer("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ----------------------
// ローディング
// ----------------------
function showLoading() {
  let loader = document.getElementById("global-loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
  }

  loader.style.display = "flex";
}

function hideLoading() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "none";
}

// ----------------------
// モーダル
// ----------------------
function openModal(html) {
  let modal = document.getElementById("global-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "global-modal";
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content"></div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".modal-overlay").onclick = closeModal;
  }

  modal.querySelector(".modal-content").innerHTML = html;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("global-modal");
  if (modal) modal.style.display = "none";
}

// ----------------------
// 確認ダイアログ
// ----------------------
function confirmDialog(message, onConfirm) {
  openModal(`
    <div class="confirm-box">
      <p>${message}</p>
      <div class="confirm-actions">
        <button id="confirm-yes">OK</button>
        <button id="confirm-no">キャンセル</button>
      </div>
    </div>
  `);

  document.getElementById("confirm-yes").onclick = () => {
    closeModal();
    onConfirm();
  };

  document.getElementById("confirm-no").onclick = closeModal;
}

// ----------------------
// ドロップダウン
// ----------------------
function toggleDropdown(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.toggle("open");
}

// 外クリックで閉じる
document.addEventListener("click", (e) => {
  document.querySelectorAll(".dropdown.open").forEach(drop => {
    if (!drop.contains(e.target)) {
      drop.classList.remove("open");
    }
  });
});

// ----------------------
// タブ切り替え
// ----------------------
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.style.display = "none";
  });

  const active = document.getElementById(tabId);
  if (active) active.style.display = "block";
}

// ----------------------
// ユーティリティ
// ----------------------
function getOrCreateContainer(id) {
  let el = document.getElementById(id);

  if (!el) {
    el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
  }

  return el;
}

// ----------------------
// グローバル公開
// ----------------------
window.UI = {
  showNotification,
  showLoading,
  hideLoading,
  openModal,
  closeModal,
  confirmDialog,
  toggleDropdown,
  switchTab
};
