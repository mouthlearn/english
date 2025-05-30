function renderCancelButton(parentElement) {
  // Nếu đã có nút thì không tạo lại
  let btn = document.getElementById("global-cancel-btn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "global-cancel-btn";
    btn.className =
      "flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition font-bold text-base";
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg> Home';
    btn.onclick = () => {
      window.showConfirmDialog(
        "Are you sure you want to return to the main menu?",
        () => {
          if (window.globalGameTimer) window.globalGameTimer.stop();
          window.hideCancelButton();
          window.location.reload();
        },
        null
      );
    };
  }
  btn.style.display = "flex";
  if (parentElement && !parentElement.contains(btn)) {
    parentElement.appendChild(btn);
  }
}

function hideCancelButton() {
  const btn = document.getElementById("global-cancel-btn");
  if (btn) btn.style.display = "none";
}

// Export cho browser
if (typeof window !== "undefined") {
  window.renderCancelButton = renderCancelButton;
  window.hideCancelButton = hideCancelButton;
}
