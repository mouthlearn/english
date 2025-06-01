class App {
  constructor() {
    this.games = [
      {
        id: "matching",
        title: "Word Matching",
        description: "Match English words with their Vietnamese definitions",
        icon: "🔄",
        handler: () => matchingGame.init(),
      },
      {
        id: "itis",
        title: "It is?",
        description:
          "Choose the correct meaning or English word for the given definition",
        icon: "❓",
        handler: () => itIsGame.init(),
      },
      {
        id: "ipa-test",
        title: "IPA Test",
        description: "Type the English word for the given IPA pronunciation",
        icon: "🔤",
        handler: () => ipaTestGame.init(),
      },
      {
        id: "context-test",
        title: "Context Test",
        description: "Fill in the blank with the appropriate word in context",
        icon: "📝",
        handler: () => contextTestGame.init(),
      },
      {
        id: "word-scramble",
        title: "Word Scramble",
        description: "Unscramble letters to form correct English words",
        icon: "🔠",
        handler: () => wordScrambleGame.init(),
      },
      {
        id: "learned-words",
        title: "Learned Words",
        description: "Review and test your learned words",
        icon: "📚",
        handler: () => window.learnedWordsComponent.init(),
      },
      {
        id: "app-info",
        title: "About App",
        description:
          "Thông tin về ứng dụng, developer, version và các tính năng mới.",
        icon: "ℹ️",
        handler: () => window.showAppInfoModal(),
      },
    ];
  }

  init() {
    this.renderMainMenu();
  }

  renderMainMenu() {
    const mainContent = document.querySelector("main");
    // Thêm background SVG gradient blur
    if (!document.getElementById("modern-gradient-bg")) {
      const bgDiv = document.createElement("div");
      bgDiv.id = "modern-gradient-bg";
      bgDiv.className = "fixed inset-0 -z-10 pointer-events-none";
      bgDiv.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full absolute inset-0">
          <defs>
            <radialGradient id="g1" cx="30%" cy="30%" r="80%" fx="30%" fy="30%" gradientUnits="userSpaceOnUse">
              <stop stop-color="#60A5FA" stop-opacity="0.7"/>
              <stop offset="1" stop-color="#A78BFA" stop-opacity="0.2"/>
            </radialGradient>
            <radialGradient id="g2" cx="70%" cy="70%" r="80%" fx="70%" fy="70%" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F59E42" stop-opacity="0.5"/>
              <stop offset="1" stop-color="#34D399" stop-opacity="0.1"/>
            </radialGradient>
          </defs>
          <ellipse cx="400" cy="300" rx="600" ry="400" fill="url(#g1)" />
          <ellipse cx="1100" cy="700" rx="500" ry="300" fill="url(#g2)" />
        </svg>
        <div style="position:absolute;inset:0;backdrop-filter:blur(60px);-webkit-backdrop-filter:blur(60px);"></div>
      `;
      document.body.appendChild(bgDiv);
    }
    mainContent.innerHTML = `
      <div class="launcher-bg p-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div class="w-full max-w-md mb-8 relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
          <input id="launcher-search" type="text" placeholder="Search" class="w-full pl-12 pr-4 py-2 rounded-xl border border-white/70 bg-white/80 backdrop-blur-md text-lg font-normal placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-md transition" autocomplete="off" />
        </div>
        <div id="launcher-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 min-h-[320px]">
          <!-- Game cards sẽ được render ở đây -->
        </div>
      </div>
      <!-- Stats Modal giữ nguyên -->
      <div class="stats-modal fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-200 scale-95 opacity-0">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Your Progress</h2>
            <button class="text-gray-500 hover:text-gray-700" onclick="document.querySelector('.stats-modal').classList.add('hidden')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-blue-50 p-4 rounded-xl">
              <p class="text-sm text-gray-600">Total Games</p>
              <p class="text-2xl font-bold text-blue-800">${
                storageManager.getGameStats().totalGames
              }</p>
            </div>
            <div class="bg-green-50 p-4 rounded-xl">
              <p class="text-sm text-gray-600">Average Score</p>
              <p class="text-2xl font-bold text-green-800">${storageManager
                .getGameStats()
                .averageScore.toFixed(1)}%</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-xl">
              <p class="text-sm text-gray-600">Best Score</p>
              <p class="text-2xl font-bold text-purple-800">${
                storageManager.getGameStats().bestScore
              }%</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render grid launcher (có filter)
    const renderGrid = (filter = "") => {
      const iconMap = {
        matching: "icons/matching.svg",
        itis: "icons/itis.svg",
        "ipa-test": "icons/ipa-test.svg",
        "context-test": "icons/context-test.svg",
        "word-scramble": "icons/word-scramble.svg",
        "learned-words": "icons/learned-words.svg",
        "app-info": null,
      };
      const bgMap = {
        matching: "bg-gradient-to-br from-sky-100 to-orange-100",
        itis: "bg-gradient-to-br from-violet-100 to-pink-100",
        "ipa-test": "bg-gradient-to-br from-green-100 to-emerald-100",
        "context-test": "bg-gradient-to-br from-blue-100 to-violet-100",
        "word-scramble": "bg-gradient-to-br from-orange-100 to-yellow-100",
        "learned-words": "bg-gradient-to-br from-emerald-100 to-green-100",
        "app-info": "bg-gradient-to-br from-gray-100 to-blue-100",
      };
      const games = this.games.filter((game) =>
        game.title.toLowerCase().includes(filter.toLowerCase())
      );
      let html = games
        .map((game) => {
          const title =
            game.id === "learned-words"
              ? `${game.title} (${
                  window.learnedWordsManager.getLearnedWords().length
                })`
              : game.title;
          return `
          <div class="launcher-card flex flex-col items-center cursor-pointer group" data-game-id="${
            game.id
          }">
            <div class="w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-110 group-hover:shadow-2xl ${
              bgMap[game.id]
            }">
              ${
                game.id === "app-info"
                  ? '<span class="text-4xl select-none">ℹ️</span>'
                  : `<img src="${iconMap[game.id]}" alt="${
                      game.title
                    } icon" class="w-16 h-16 select-none pointer-events-none" draggable="false" />`
              }
            </div>
            <span class="launcher-title mt-2">${title}</span>
          </div>
        `;
        })
        .join("");
      // Stats app luôn ở cuối
      html += `
        <div class="flex flex-col items-center cursor-pointer group" onclick="document.querySelector('.stats-modal').classList.remove('hidden')">
          <div class="w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-110 group-hover:shadow-2xl bg-gradient-to-br from-blue-100 to-violet-100">
            <img src="icons/stats.svg" alt="Stats icon" class="w-16 h-16 select-none pointer-events-none" draggable="false" />
          </div>
          <span class="launcher-title mt-2">Stats</span>
        </div>
      `;
      if (games.length === 0) {
        html = `<div class='col-span-full flex flex-col items-center justify-center py-12 opacity-70'>
          <svg xmlns='http://www.w3.org/2000/svg' class='h-12 w-12 mb-2 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.75 9.75a3 3 0 014.5 0m-4.5 0a3 3 0 01-4.5 0m9 0a3 3 0 014.5 0M12 15v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
          <div class='text-lg text-gray-400 font-medium'>No results found</div>
        </div>`;
      }
      document.getElementById("launcher-grid").innerHTML = html;

      // Gán sự kiện click cho từng card game
      document.querySelectorAll(".launcher-card").forEach((card) => {
        const gameId = card.getAttribute("data-game-id");
        const game = this.games.find((g) => g.id === gameId);
        if (game && typeof game.handler === "function") {
          card.onclick = game.handler;
        }
      });
    };
    renderGrid();
    // Xử lý search realtime
    const searchInput = document.getElementById("launcher-search");
    searchInput.addEventListener("input", (e) => {
      renderGrid(e.target.value);
    });

    // Tự động focus vào box search khi gõ ký tự bất kỳ trên trang Home
    const keydownHandler = (e) => {
      // Nếu đang focus vào input hoặc textarea thì bỏ qua
      if (
        document.activeElement === searchInput ||
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
      // Chỉ nhận ký tự chữ/số và một số ký tự đặc biệt
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        searchInput.focus();
        // Nếu input đang rỗng hoặc đã select hết, thay thế bằng ký tự mới
        if (
          searchInput.value === "" ||
          (searchInput.selectionStart === 0 &&
            searchInput.selectionEnd === searchInput.value.length)
        ) {
          searchInput.value = e.key;
        } else {
          // Thêm ký tự vào vị trí con trỏ
          const start = searchInput.selectionStart;
          const end = searchInput.selectionEnd;
          searchInput.value =
            searchInput.value.slice(0, start) +
            e.key +
            searchInput.value.slice(end);
          searchInput.selectionStart = searchInput.selectionEnd = start + 1;
        }
        renderGrid(searchInput.value);
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", keydownHandler);
    // Modal animation giữ nguyên
    const modal = document.querySelector(".stats-modal");
    const modalContent = modal.querySelector(".bg-white");
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
    document.querySelector('[onclick*="stats-modal"]').onclick = () => {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modalContent.classList.remove("scale-95", "opacity-0");
        modalContent.classList.add("scale-100", "opacity-100");
      }, 10);
    };
  }
}

function loadVocabAndStartApp() {
  fetch("data/vocab.json")
    .then((res) => {
      if (!res.ok) throw new Error("Không thể tải vocab.json");

      return res.json();
    })
    .then((vocabList) => {
      window.vocabManager.setVocabList(vocabList);
      const app = new App();
      app.init();
    })
    .catch((err) => {
      document.body.innerHTML = `<div class='flex items-center justify-center min-h-screen'><div class='bg-white p-8 rounded shadow text-red-600 font-bold'>Lỗi tải dữ liệu từ vựng: ${err.message}</div></div>`;
    });
}

document.addEventListener("DOMContentLoaded", loadVocabAndStartApp);

// 1. Biến lưu event install
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.showAppInfoModal = function () {
  let modal = document.getElementById("app-info-modal");
  if (modal) modal.remove();
  modal = document.createElement("div");
  modal.id = "app-info-modal";
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
  modal.innerHTML = `
    <div class=\"bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 relative animate-fadeIn\">
      <button class=\"absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold select-none\" onclick=\"document.getElementById('app-info-modal').remove()\">×</button>
      <div class=\"flex items-center gap-4 mb-6\">
        <span class=\"text-4xl select-none\">ℹ️</span>
        <div>
          <h2 class=\"text-2xl font-bold text-gray-800 mb-1\">Online English Test</h2>
          <p class=\"text-gray-500 text-sm\">Version 1.0.0 &middot; by <span class=\"font-semibold text-blue-700\">Oliver Warren Mow</span></p>
        </div>
      </div>
      <div class=\"mb-6\">
        <h3 class=\"text-lg font-semibold text-gray-700 mb-2\">About</h3>
        <p class=\"text-gray-600 mb-2\">A modern English learning and practice app with fullscreen, PWA support, multiple mini games, and smart progress tracking features.</p>
      </div>
      <div class=\"mb-6\">
        <button id=\"install-btn\" class=\"mb-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition select-none w-full\" style=\"display:none\">Install App</button>
        <div id=\"install-guide\" class=\"text-xs text-gray-500 text-center\" style=\"display:none\"></div>
      </div>
      <div>
        <h3 class=\"text-lg font-semibold text-gray-700 mb-2\">What's New</h3>
        <ul class=\"space-y-2 text-gray-700 text-sm list-disc pl-5\">
          <li>Modern-style fullscreen launcher interface</li>
          <li>Mini games: Word Matching, IPA Test, Context Test, Word Scramble, and more</li>
          <li>Easy/Hard mode for every game</li>
          <li>Progress tracking and game history</li>
          <li>Built-in translation, IPA display, and many UX improvements</li>
        </ul>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // Cho phép click ra ngoài để tắt
  modal.onclick = function (e) {
    if (e.target === modal) modal.remove();
  };
  // Hiện nút Install nếu có deferredPrompt
  setTimeout(() => {
    const installBtn = document.getElementById("install-btn");
    const guide = document.getElementById("install-guide");
    if (deferredPrompt && installBtn) {
      installBtn.style.display = "";
      guide.style.display = "none";
      installBtn.onclick = function () {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          deferredPrompt = null;
          installBtn.style.display = "none";
        });
      };
    } else if (installBtn && guide) {
      // Nếu là iOS hoặc không hỗ trợ prompt
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isIOS || isSafari) {
        installBtn.style.display = "";
        guide.style.display = "";
        guide.innerHTML =
          'On iOS, tap <span style="font-weight:bold">Share</span> <svg class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12"/></svg> then choose <b>Add to Home Screen</b>.';
        installBtn.onclick = function () {
          guide.scrollIntoView({ behavior: "smooth", block: "center" });
        };
      } else {
        installBtn.style.display = "none";
        guide.style.display = "none";
      }
    }
  }, 0);
};
