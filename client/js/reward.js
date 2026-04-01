// Socket.io でサーバーと接続済みとする
// socket = io(...);

// ユーザー情報（デモ用）
let points = 0;
let coins = 0;

// ポイント取得
async function fetchPoints(userId) {
  const res = await fetch(`/api/user/points/${userId}`);
  const data = await res.json();
  points = data.points || 0;
  coins = data.coins || 0;
  updateDisplay();
}

// ポイント→コイン変換
async function convertPoints(userId) {
  const res = await fetch(`/api/user/convert/${userId}`, { method: "POST" });
  const data = await res.json();
  points = data.points;
  coins = data.coins;
  updateDisplay();
}

// ディスプレイ更新
function updateDisplay() {
  const pointsEl = document.getElementById("pointsDisplay");
  const coinsEl = document.getElementById("coinsDisplay");

  if(pointsEl) pointsEl.textContent = `ポイント: ${points}`;
  if(coinsEl) coinsEl.textContent = `コイン: ${coins.length || 0}`;
}

// Socket.io イベントでポイント追加
socket?.on("pointsUpdated", data => {
  points += data.added || 0;
  updateDisplay();
});

socket?.on("coinsUpdated", updatedCoins => {
  coins = updatedCoins;
  updateDisplay();
});
