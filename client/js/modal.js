// 開く
function openModal(contentHTML) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = contentHTML;
  modal.classList.remove("hidden");
}

// 閉じる
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
