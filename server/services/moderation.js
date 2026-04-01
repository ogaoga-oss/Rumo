// ~/Rumo/server/services/moderation.js

// 🔥 NGワード（必要に応じて追加）
const bannedWords = [
  "spam",
  "scam",
  "hack",
  "cheat",
  "kill",
  "死ね"
];

// ----------------------
// 🚫 NGワードチェック
// ----------------------
function containsBannedWords(text) {
  if (!text) return false;

  const lower = text.toLowerCase();

  return bannedWords.some(word => lower.includes(word));
}

// ----------------------
// 🧹 メッセージクリーン
// ----------------------
function sanitizeMessage(text) {
  if (!text) return "";

  let cleaned = text;

  bannedWords.forEach(word => {
    const regex = new RegExp(word, "gi");
    cleaned = cleaned.replace(regex, "****");
  });

  return cleaned;
}

// ----------------------
// ⚠️ スパム検知（連投防止）
// ----------------------
const userMessages = new Map();

function isSpam(userId) {
  const now = Date.now();
  const windowMs = 5000; // 5秒
  const maxMessages = 5;

  const data = userMessages.get(userId) || [];

  // 古いメッセージ削除
  const recent = data.filter(ts => now - ts < windowMs);

  recent.push(now);
  userMessages.set(userId, recent);

  return recent.length > maxMessages;
}

// ----------------------
// 🧠 メインチェック関数
// ----------------------
function moderateMessage(userId, text) {
  if (isSpam(userId)) {
    return {
      allowed: false,
      reason: "spam"
    };
  }

  if (containsBannedWords(text)) {
    return {
      allowed: true,
      flagged: true,
      text: sanitizeMessage(text)
    };
  }

  return {
    allowed: true,
    flagged: false,
    text
  };
}

module.exports = {
  moderateMessage,
  containsBannedWords,
  sanitizeMessage,
  isSpam
};
