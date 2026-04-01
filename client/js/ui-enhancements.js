// プレミアム専用UI演出
function applyPremiumUI(user){
  if(user.isPremium){
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
    document.body.style.transition = "background 1s ease-in-out";
    console.log("🎖️ プレミアムUI適用中");
  }
}

// 未読バッジ更新
function updateUnreadBadge(chatId, count){
  const badge = document.querySelector(`#chat-${chatId}-badge`);
  if(!badge) return;
  badge.textContent = count > 0 ? count : "";
  badge.style.display = count > 0 ? "inline-block" : "none";
  badge.classList.add("pulse");
  setTimeout(()=> badge.classList.remove("pulse"), 800);
}

// ランキング報酬アニメーション
function animateRankingReward(username, points){
  const rewardDiv = document.createElement("div");
  rewardDiv.className = "ranking-reward";
  rewardDiv.textContent = `${username} に ${points}pt の報酬！`;
  rewardDiv.style.position = "fixed";
  rewardDiv.style.top = "20px";
  rewardDiv.style.left = "50%";
  rewardDiv.style.transform = "translateX(-50%)";
  rewardDiv.style.padding = "10px 20px";
  rewardDiv.style.background = "#ffd700";
  rewardDiv.style.color = "#333";
  rewardDiv.style.borderRadius = "10px";
  rewardDiv.style.fontWeight = "bold";
  rewardDiv.style.animation = "slideDownFade 2s forwards";
  document.body.appendChild(rewardDiv);
  setTimeout(()=> rewardDiv.remove(), 2000);
}

// CSSアニメーション挿入
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideDownFade { 0%{opacity:0; transform:translate(-50%,-20px);} 100%{opacity:1; transform:translate(-50%,0);} }
.pulse { animation: pulseAnim 0.8s ease; }
@keyframes pulseAnim { 0%{transform:scale(1);} 50%{transform:scale(1.3);} 100%{transform:scale(1);} }
.ranking-reward { z-index:9999; }
`;
document.head.appendChild(style);

// デモ: 未読バッジをランダム更新
setInterval(()=>{
  const chatId = "general";
  const count = Math.floor(Math.random()*5);
  updateUnreadBadge(chatId,count);
},5000);

// デモ: ランキング報酬アニメーション
setInterval(()=>{
  const users = ["Alice","Bob","Charlie"];
  const points = [50,100,150];
  const i = Math.floor(Math.random()*users.length);
  animateRankingReward(users[i], points[i]);
},10000);
