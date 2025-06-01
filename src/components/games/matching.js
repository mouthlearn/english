class MatchingGame {
  constructor() {
    this.words = [];
    this.cards = [];
    this.selectedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.startTime = null;
    this.timeLimit = 60; // 60s
    this.timeUp = false;
  }

  init() {
    window.hideFloatEndButtons && window.hideFloatEndButtons();
    this.words = window.vocabManager.getRandomWords(6);
    this.totalPairs = this.words.length;
    this.matchedPairs = 0;
    this.selectedCards = [];
    this.startTime = new Date();
    this.timeUp = false;
    this.generateCards();
    this.render();
    setTimeout(() => {
      window.globalGameTimer.start({
        seconds: this.timeLimit,
        type: "countdown",
        onEnd: () => {
          this.timeUp = true;
          this.endGame();
        },
      });
    }, 0);
  }

  generateCards() {
    this.cards = [];
    this.words.forEach((word) => {
      this.cards.push({ id: word.id, type: "word", content: word.word });
      this.cards.push({
        id: word.id,
        type: "definition",
        content: word.definition,
      });
    });
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  render() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
      <div class="px-4 min-h-[100vh] flex flex-col items-center justify-center">
        <div class="w-full max-w-5xl flex flex-col gap-6 items-center">
          <!-- Card Title/Desc/Mode -->
          <div class="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center mb-2">
            <h2 class="text-2xl font-bold text-gray-800 text-center flex-1">Word Matching Game</h2>
            <p class="text-gray-600 text-center mt-2">Match the English words with their Vietnamese definitions</p>
            <!-- Nếu có mode -->
            <div class="mt-2 flex justify-center">
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Normal Mode</span>
            </div>
            <div id="game-timer" class="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 bg-blue-600 text-white border border-blue-300 shadow-lg font-bold text-base px-6 py-2 rounded-full custom-ping z-10"></div>
          </div>
          <!-- Card Nội dung chính -->
          <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Cards sẽ được render ở đây -->
            </div>
          </div>
        </div>
        <!-- Floating Back Button -->
        <button id="floating-back-btn" class="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex items-center gap-2 px-8 py-3 bg-gray-700 text-white rounded-full shadow-xl hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-lg select-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
    `;
    const container = mainContent.querySelector(".w-full.max-w-5xl");
    // Render cards vào card nội dung chính
    const cardsContainer = mainContent.querySelector(".grid");
    this.cards.forEach((cardData, idx) => {
      const card = document.createElement("div");
      card.className =
        "card bg-blue-50 p-4 rounded-lg cursor-pointer transform transition-transform hover:scale-105 text-center font-semibold select-none min-h-[56px] flex items-center justify-center break-words";
      card.style.height = "64px";
      card.style.maxHeight = "96px";
      card.style.overflow = "hidden";
      card.dataset.id = cardData.id;
      card.dataset.type = cardData.type;
      card.dataset.index = idx;
      card.innerText = "";
      card.addEventListener("click", () =>
        this.handleCardClick(card, cardData)
      );
      cardsContainer.appendChild(card);
    });
    // Floating Back Button event
    const backBtn = document.getElementById("floating-back-btn");
    backBtn.onclick = () => {
      window.showConfirmDialog(
        "Are you sure you want to return to the main menu?",
        () => {
          if (window.globalGameTimer) window.globalGameTimer.stop();
          window.hideCancelButton && window.hideCancelButton();
          window.location.reload();
        },
        null
      );
    };
    // Khởi tạo timer
    if (window.globalGameTimer) window.globalGameTimer.stop();
    window.globalGameTimer = new GameTimer();
    const timer = document.getElementById("game-timer");
    if (timer) window.globalGameTimer.timerEl = timer;
  }

  handleCardClick(card, cardData) {
    if (this.timeUp) return;
    if (
      card.classList.contains("matched") ||
      card.classList.contains("selected")
    )
      return;
    if (this.selectedCards.length === 2) return;

    card.innerText = cardData.content;
    card.classList.add("selected");
    if (cardData.type === "word") {
      card.classList.add("text-blue-800");
    } else {
      card.classList.add("text-green-800");
    }
    this.selectedCards.push({ card, cardData });

    if (this.selectedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 600);
    }
  }

  checkMatch() {
    const [first, second] = this.selectedCards;
    if (
      first.cardData.id === second.cardData.id &&
      first.cardData.type !== second.cardData.type
    ) {
      first.card.classList.add("matched", "bg-green-100");
      second.card.classList.add("matched", "bg-green-100");
      this.matchedPairs++;

      // Thêm từ vào danh sách đã học
      const word = this.words.find((w) => w.id === first.cardData.id);
      if (word) {
        window.learnedWordsManager.addLearnedWord(word);
      }

      if (this.matchedPairs === this.totalPairs) {
        this.endGame();
      }
    } else {
      first.card.innerText = "";
      second.card.innerText = "";
      first.card.classList.remove(
        "selected",
        "text-blue-800",
        "text-green-800"
      );
      second.card.classList.remove(
        "selected",
        "text-blue-800",
        "text-green-800"
      );
    }
    this.selectedCards = [];
  }

  endGame() {
    window.globalGameTimer.stop();
    const endTime = new Date();
    let duration = (endTime - this.startTime) / 1000;
    if (this.timeUp) duration = this.timeLimit;
    const score = Math.round((this.matchedPairs / this.totalPairs) * 100);

    const result = {
      score,
      duration,
      matchedPairs: this.matchedPairs,
      totalPairs: this.totalPairs,
      timeUp: this.timeUp,
    };

    storageManager.saveGameResult("matching", result);
    this.showResult(result);
  }

  showResult(result) {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";

    const resultData = {
      score: result.score,
      total: 100,
      timeUp: result.timeUp,
      duration: result.duration,
      matchedPairs: result.matchedPairs,
      totalPairs: result.totalPairs,
      gameName: "Word Matching",
    };

    const resultDisplay = window.renderResultDisplay(resultData);
    resultDisplay.classList.add("result-display", "matching-result");

    // Add additional stats for matching game
    const statsSection = document.createElement("div");
    statsSection.className = "mt-6 grid grid-cols-2 gap-4";
    statsSection.innerHTML = `
      <div class="bg-blue-50 p-4 rounded-lg text-center">
        <p class="text-sm text-gray-600 mb-1">Time</p>
        <p class="text-xl font-bold text-blue-700">${result.duration.toFixed(
          1
        )}s</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg text-center">
        <p class="text-sm text-gray-600 mb-1">Matched Pairs</p>
        <p class="text-xl font-bold text-purple-700">${result.matchedPairs}/${
      result.totalPairs
    }</p>
      </div>
    `;
    resultDisplay.appendChild(statsSection);

    mainContent.appendChild(resultDisplay);
    window.renderFloatEndButtons(() => this.init());
  }
}

const matchingGame = new MatchingGame();
