async function submitCode() {
  const code = document.getElementById("inviteCode").value;

  const res = await fetch("http://localhost:8082/api/invite/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("error").innerText = data.message;
    return;
  }

  // ローカル保存（超重要）
  localStorage.setItem("inviteCode", code);

  // 登録ページへ
  window.location.href = "/pages/register.html";
}
