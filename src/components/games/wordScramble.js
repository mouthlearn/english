class WordScrambleGame {
  constructor() {
    this.questions = [];
    this.current = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLimit = 90; // 90s for the entire game
    this.timeUp = false;
    this.difficulty = null; // 'easy' or 'hard'
    this.selectedLetters = []; // Track selected letters
  }

  init() {
    window.renderGameHeader("Word Scramble");
    window.hideFloatEndButtons();
    this.showDifficultySelection();
  }

  showDifficultySelection() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Select Difficulty</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button id="easy-btn" class="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                <span class="text-2xl">🎯</span>
                <div class="text-left">
                  <p class="font-semibold">Easy Mode</p>
                  <p class="text-sm opacity-90">Exact Letters</p>
                </div>
              </button>
              <button id="hard-btn" class="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105">
                <span class="text-2xl">🔥</span>
                <div class="text-left">
                  <p class="font-semibold">Hard Mode</p>
                  <p class="text-sm opacity-90">With Extra Letters</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("easy-btn").onclick = () => {
      this.difficulty = "easy";
      this.startGame();
    };

    document.getElementById("hard-btn").onclick = () => {
      this.difficulty = "hard";
      this.startGame();
    };
  }

  startGame() {
    this.questions = this.generateQuestions(8);
    this.current = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeUp = false;
    this.render();
    setTimeout(() => {
      window.globalGameTimer.start({
        seconds: this.timeLimit,
        type: "countdown",
        onEnd: () => {
          this.timeUp = true;
          this.showResult();
        },
      });
    }, 0);
  }

  generateQuestions(count) {
    const vocabList = window.vocabManager.getAllWords();
    const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
    const questions = [];

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const word = shuffled[i];
      const scrambledWord = this.scrambleWord(word.word);
      questions.push({
        scrambled: scrambledWord,
        answer: word.word,
        definition: word.definition,
        ipa: word.ipa,
      });
    }
    return questions;
  }

  scrambleWord(word) {
    let letters = word.split("").map((l) => l.toUpperCase());

    // Add noise letters in hard mode
    if (this.difficulty === "hard") {
      const noiseCount = Math.ceil(word.length * 0.5); // 50% extra letters
      const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const availableLetters = allLetters.filter((l) => !letters.includes(l));

      for (let i = 0; i < noiseCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        letters.push(availableLetters[randomIndex]);
        availableLetters.splice(randomIndex, 1);
      }
    }

    // Shuffle all letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    return letters;
  }

  render() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";

    if (this.current >= this.questions.length || this.timeUp) {
      this.showResult();
      return;
    }

    const gameContainer = document.createElement("div");
    gameContainer.className = "max-w-2xl mx-auto";

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg overflow-hidden";

    const header = document.createElement("div");
    header.className = "p-6 border-b border-gray-200";
    header.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Word Scramble</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Mode:</span>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${
            this.difficulty === "easy"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }">
            ${this.difficulty === "easy" ? "Easy" : "Hard"}
          </span>
        </div>
      </div>
      <p class="text-gray-600">Select letters to form the correct word</p>
    `;
    card.appendChild(header);

    const question = this.questions[this.current];
    const questionContainer = document.createElement("div");
    questionContainer.className = "p-6";

    // Reset selected letters for new question
    this.selectedLetters = [];

    questionContainer.innerHTML = `
      <div class="mb-6">
        <div class="flex items-center space-x-2 mb-4">
          <span class="text-sm text-gray-500">
            Question ${this.current + 1} of ${this.questions.length}
          </span>
        </div>
        <div class="text-center mb-6">
          <p class="text-xl text-gray-600 mb-4">${question.definition}</p>
          ${
            this.difficulty === "easy"
              ? `<p class="text-sm text-gray-500 mb-4">Hint: The word has ${question.answer.length} letters</p>`
              : ""
          }
          <div class="mt-4 flex justify-center space-x-4 mb-4">
            <button class="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    onclick="wordScrambleGame.clearSelection()">
              Clear
            </button>
            <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    onclick="wordScrambleGame.checkAnswer()">
              Check
            </button>
          </div>
          <div class="flex flex-wrap justify-center gap-2 mb-4 transition-all duration-300" id="selected-word">
            ${Array(question.answer.length)
              .fill("_")
              .map(
                () => `
              <div class="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 transition-all duration-300">
                _
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="grid grid-cols-6 gap-2" id="letter-buttons">
          ${question.scrambled
            .map(
              (letter) => `
            <button class="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-800 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-40 disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:border-gray-200 disabled:transform disabled:scale-95"
                    onclick="wordScrambleGame.selectLetter('${letter}')"
                    data-letter="${letter}">
              ${letter}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    card.appendChild(questionContainer);

    // Add styles for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pop {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      @keyframes correct {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background-color: rgba(34, 197, 94, 0.1); }
        100% { transform: scale(1); }
      }
      @keyframes incorrect {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
        100% { transform: translateX(0); }
      }
      .animate-pop {
        animation: pop 0.3s ease-out;
      }
      .animate-correct {
        animation: correct 0.5s ease-out;
      }
      .animate-incorrect {
        animation: incorrect 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);

    gameContainer.appendChild(card);
    mainContent.appendChild(gameContainer);
    window.renderCancelButton();
  }

  selectLetter(letter) {
    const question = this.questions[this.current];
    if (this.selectedLetters.length < question.answer.length) {
      // Find the button that was clicked
      const buttons = document.querySelectorAll("#letter-buttons button");
      const clickedButton = Array.from(buttons).find(
        (btn) => btn.textContent.trim() === letter
      );

      if (clickedButton) {
        // Add click animation
        clickedButton.classList.add("scale-90");
        setTimeout(() => {
          clickedButton.classList.remove("scale-90");
        }, 200);

        // Disable the button with enhanced effect
        clickedButton.disabled = true;
        clickedButton.classList.add("disabled");
      }

      this.selectedLetters.push(letter);
      this.updateSelectedWord();
    }
  }

  updateSelectedWord() {
    const selectedWordContainer = document.getElementById("selected-word");
    if (!selectedWordContainer) return;

    selectedWordContainer.innerHTML = Array(
      this.questions[this.current].answer.length
    )
      .fill("_")
      .map(
        (_, index) => `
        <div class="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold ${
          index < this.selectedLetters.length
            ? "text-gray-800"
            : "text-gray-400"
        } transition-all duration-300 transform ${
          index < this.selectedLetters.length ? "scale-100" : "scale-90"
        }">
          ${
            index < this.selectedLetters.length
              ? this.selectedLetters[index]
              : "_"
          }
        </div>
      `
      )
      .join("");

    // Add pop animation to the last filled letter
    if (this.selectedLetters.length > 0) {
      const lastLetter =
        selectedWordContainer.children[this.selectedLetters.length - 1];
      lastLetter.classList.add("animate-pop");
      setTimeout(() => {
        lastLetter.classList.remove("animate-pop");
      }, 300);
    }
  }

  clearSelection() {
    const selectedWordContainer = document.getElementById("selected-word");
    if (selectedWordContainer) {
      // Add fade out animation
      selectedWordContainer.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        this.selectedLetters = [];
        this.updateSelectedWord();
        selectedWordContainer.classList.remove("opacity-0", "scale-95");

        // Re-enable all letter buttons with animation
        const buttons = document.querySelectorAll("#letter-buttons button");
        buttons.forEach((btn) => {
          btn.disabled = false;
          btn.classList.remove("disabled");
          btn.classList.add("animate-pop");
          setTimeout(() => {
            btn.classList.remove("animate-pop");
          }, 300);
        });
      }, 200);
    }
  }

  checkAnswer() {
    const question = this.questions[this.current];
    const userAnswer = this.selectedLetters.join("");
    const isCorrect =
      userAnswer.toLowerCase() === question.answer.toLowerCase();

    // Add check animation
    const selectedWordContainer = document.getElementById("selected-word");
    if (selectedWordContainer) {
      selectedWordContainer.classList.add(
        isCorrect ? "animate-correct" : "animate-incorrect"
      );
      setTimeout(() => {
        selectedWordContainer.classList.remove(
          "animate-correct",
          "animate-incorrect"
        );
      }, 500);
    }

    // Play sound feedback
    const audio = new Audio(
      isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    audio.play().catch(() => {}); // Ignore if sound fails to play

    this.userAnswers.push({
      scrambled: question.scrambled,
      question: question.scrambled.join(""), // For resultDisplay
      answer: question.answer.toUpperCase(),
      user: userAnswer.toUpperCase(),
      correct: isCorrect,
      definition: question.definition,
      ipa: question.ipa,
    });

    if (isCorrect) {
      this.score++;
      // Add to learned words if correct
      const word = window.vocabManager
        .getAllWords()
        .find((w) => w.word === question.answer);
      if (word) {
        window.learnedWordsManager.addLearnedWord(word);
      }
    }

    // Add delay before moving to next question
    setTimeout(() => {
      this.current++;
      this.render();
    }, 800);
  }

  showResult() {
    window.globalGameTimer.stop();
    window.hideGameHeader();

    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";

    // Save game result to storage
    storageManager.saveGameResult("word-scramble", {
      score: Math.round((this.score / this.questions.length) * 100),
      total: 100,
      timeUp: this.timeUp,
      duration: this.timeLimit,
      userAnswers: this.userAnswers,
    });

    // Only show detailed answers
    const answersSection = document.createElement("div");
    answersSection.className = "result-display mt-8 space-y-6";
    answersSection.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 mb-6">Detailed Answers</h3>
      ${this.userAnswers
        .map(
          (answer, index) => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6 ${answer.correct ? "bg-green-50" : "bg-red-50"}">
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-sm text-gray-500">
                Question ${index + 1}
              </span>
            </div>
            <div class="space-y-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-800 mb-2">${
                  answer.answer
                }</p>
                <p class="text-xs text-gray-500 mb-1">Scrambled: <span class="font-mono tracking-widest">${
                  answer.question
                }</span></p>
                <p class="text-lg text-gray-600">${answer.definition}</p>
              </div>
              <div class="space-y-2">
                <p class="text-sm">
                  <span class="font-medium text-gray-700">Your answer:</span>
                  <span class="text-gray-600">${answer.user}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-gray-700">Correct answer:</span>
                  <span class="text-gray-600">${answer.answer}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-gray-700">IPA:</span>
                  <span class="text-gray-600 font-mono">${answer.ipa}</span>
                </p>
              </div>
              ${
                !answer.correct
                  ? `
                <div class="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm font-medium text-yellow-800 mb-1">Tip for next time:</p>
                  <p class="text-sm text-yellow-700">Try to identify common prefixes or suffixes in the scrambled word. Look for patterns that might help you reconstruct the word.</p>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    `;
    mainContent.appendChild(answersSection);
    window.renderFloatEndButtons(() => this.init());
  }
}

const wordScrambleGame = new WordScrambleGame();
