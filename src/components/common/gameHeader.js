function renderGameHeader(gameName = "") {
  // Xoá header cũ nếu có
  let header = document.getElementById("game-header");
  if (header) header.remove();

  header = document.createElement("div");
  header.id = "game-header";
  header.className =
    "fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white shadow-sm px-4 py-2";
  header.style.minHeight = "56px";

  // Trái: Nút huỷ
  const left = document.createElement("div");
  left.className = "flex items-center";
  window.renderCancelButton(left);

  // Giữa: Tên game
  const center = document.createElement("div");
  center.className = "flex items-center justify-center grow";
  center.innerHTML = `<span class="text-xl font-bold text-gray-900">${gameName}</span>`;

  // Phải: Timer (nổi bật)
  const right = document.createElement("div");
  right.className = "flex items-center justify-end";

  if (window.globalGameTimer) {
    window.globalGameTimer.stop();
  }
  window.globalGameTimer = new GameTimer();
  const timer = document.getElementById("game-timer");
  if (timer) {
    right.appendChild(timer);
    // timer.style.opacity = "1";
    // timer.style.pointerEvents = "auto";
  }
  header.appendChild(left);
  header.appendChild(center);
  header.appendChild(right);

  document.body.appendChild(header);
}

function hideGameHeader() {
  const header = document.getElementById("game-header");
  if (header) header.remove();
}

if (typeof window !== "undefined") {
  window.renderGameHeader = renderGameHeader;
  window.hideGameHeader = hideGameHeader;
}
