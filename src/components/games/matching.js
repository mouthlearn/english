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
    window.renderGameHeader("Word Matching");
    window.hideFloatEndButtons();
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
    const gameContainer = document.createElement("div");
    gameContainer.className = "matching-game p-6 bg-white rounded-lg shadow-lg";

    const header = document.createElement("div");
    header.className = "mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Word Matching Game</h2>
      <p class="text-gray-600">Match the English words with their Vietnamese definitions</p>
    `;
    gameContainer.appendChild(header);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "grid grid-cols-2 md:grid-cols-3 gap-4";

    this.cards.forEach((cardData, idx) => {
      const card = document.createElement("div");
      card.className =
        "card bg-blue-50 p-4 rounded-lg cursor-pointer transform transition-transform hover:scale-105 text-center font-semibold select-none min-h-[56px] flex items-center justify-center break-words";
      card.style.height = "64px"; // h-16 tương đương 4*16px = 64px
      card.style.maxHeight = "96px"; // Giới hạn chiều cao tối đa
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

    gameContainer.appendChild(cardsContainer);

    // Add game container to main content
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";
    mainContent.appendChild(gameContainer);
    window.renderCancelButton();
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
    window.hideGameHeader();
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
    window.hideGameHeader();
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
