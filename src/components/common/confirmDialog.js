// Confirm Dialog Component
function showConfirmDialog(message, onConfirm, onCancel) {
  // Xoá dialog cũ nếu có
  let old = document.getElementById("custom-confirm-dialog");
  if (old) old.remove();

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-confirm-dialog";
  overlay.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 opacity-0";
  overlay.style.animation = "fadeInConfirm 0.2s ease";

  // Dialog box
  const box = document.createElement("div");
  box.className =
    "bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 text-center transform scale-95 transition-transform duration-300";
  box.style.animation = "popInConfirm 0.25s cubic-bezier(.4,2,.6,1)";

  // Icon
  const icon = document.createElement("div");
  icon.className =
    "mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-red-100";
  icon.innerHTML = `<svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;

  // Message
  const msg = document.createElement("div");
  msg.className = "mb-6 text-lg text-gray-800 font-semibold";
  msg.innerText = message;

  // Buttons
  const btnGroup = document.createElement("div");
  btnGroup.className = "flex justify-center gap-4";

  const btnCancel = document.createElement("button");
  btnCancel.className =
    "px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition";
  btnCancel.innerText = "Cancel";
  btnCancel.onclick = () => {
    overlay.classList.add("opacity-0");
    setTimeout(() => {
      overlay.remove();
      if (onCancel) onCancel();
    }, 200);
  };

  const btnOk = document.createElement("button");
  btnOk.className =
    "px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition shadow";
  btnOk.innerText = "Confirm";
  btnOk.onclick = () => {
    overlay.classList.add("opacity-0");
    setTimeout(() => {
      overlay.remove();
      if (onConfirm) onConfirm();
    }, 200);
  };

  btnGroup.appendChild(btnCancel);
  btnGroup.appendChild(btnOk);

  box.appendChild(icon);
  box.appendChild(msg);
  box.appendChild(btnGroup);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Hiệu ứng vào
  setTimeout(() => {
    overlay.classList.remove("opacity-0");
    box.classList.remove("scale-95");
    box.classList.add("scale-100");
  }, 10);
}

// CSS animation (inject vào head nếu chưa có)
(function injectConfirmDialogCSS() {
  if (document.getElementById("confirm-dialog-anim-style")) return;
  const style = document.createElement("style");
  style.id = "confirm-dialog-anim-style";
  style.innerHTML = `
    @keyframes fadeInConfirm { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popInConfirm { from { transform: scale(0.95); } to { transform: scale(1); } }
  `;
  document.head.appendChild(style);
})();

if (typeof window !== "undefined") {
  window.showConfirmDialog = showConfirmDialog;
}
