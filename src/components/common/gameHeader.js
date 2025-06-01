function renderGameHeader(title, showTimer = true) {
  // Xoá header cũ nếu có
  let header = document.getElementById("game-header");
  if (header) header.remove();

  header = document.createElement("div");
  header.id = "game-header";
  header.className = "fixed top-0 left-0 w-full z-40 bg-white shadow-sm";
  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Trái: Nút Back -->
        <div class="flex items-center">
          <button id="global-cancel-btn" class="flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 active:scale-95 transition-all duration-200 font-medium text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">Back</span>
          </button>
        </div>

        <!-- Giữa: Tên game -->
        <div class="flex items-center justify-center grow">
          <h1 class="text-2xl font-bold text-gray-900">${title}</h1>
        </div>

        <!-- Phải: Timer -->
        <div class="flex items-center justify-end">
          ${
            showTimer
              ? `
            <div id="game-timer" class="bg-opacity-70 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-full shadow font-bold text-base w-24 sm:w-28 animate-[bounce_1s_ease-in-out_infinite]"></div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện cho nút Back
  const backBtn = header.querySelector("#global-cancel-btn");
  backBtn.onclick = () => {
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

  // Khởi tạo timer nếu cần
  if (showTimer) {
    if (window.globalGameTimer) {
      window.globalGameTimer.stop();
    }
    window.globalGameTimer = new GameTimer();
    const timer = header.querySelector("#game-timer");
    if (timer) {
      window.globalGameTimer.timerEl = timer;
    }
  }

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
