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
      <div class="pt-24 pb-8 px-4 min-h-[calc(100vh-6rem)] flex items-start justify-center">
        <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8"></div>
      </div>
    `;
    const container = mainContent.querySelector(".w-full.max-w-5xl");
    // Render trực tiếp vào container
    const title = document.createElement("h2");
    title.className = "text-2xl font-bold text-gray-800 mb-4 text-center";
    title.textContent = "Select Difficulty";
    container.appendChild(title);
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-2 gap-4";
    grid.innerHTML = `
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
    `;
    container.appendChild(grid);
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
    mainContent.innerHTML = `
      <div class="pt-24 pb-8 px-4 min-h-[calc(100vh-6rem)] flex items-start justify-center">
        <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8"></div>
      </div>
    `;
    const container = mainContent.querySelector(".w-full.max-w-5xl");
    if (this.current >= this.questions.length || this.timeUp) {
      this.showResult();
      return;
    }
    // Render trực tiếp vào container
    const header = document.createElement("div");
    header.className =
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4";
    header.innerHTML = `
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
    `;
    container.appendChild(header);
    const desc = document.createElement("p");
    desc.className = "text-gray-600 mb-6";
    desc.textContent = "Select letters to form the correct word";
    container.appendChild(desc);
    const question = this.questions[this.current];
    const questionContainer = document.createElement("div");
    questionContainer.className = "mb-6";
    questionContainer.innerHTML = `
      <div class="flex items-center space-x-2 mb-4">
        <span class="text-sm text-gray-500">
          Question ${this.current + 1} of ${this.questions.length}
        </span>
      </div>
      <div class="text-center">
        <p class="text-lg text-gray-700 mb-2" translate="yes">${
          question.definition
        }</p>
        <p class="text-base text-gray-500 italic font-mono" translate="yes">${
          question.ipa
        }</p>
      </div>
    `;
    container.appendChild(questionContainer);

    // Add selected letters display
    const selectedLettersContainer = document.createElement("div");
    selectedLettersContainer.id = "selected-letters";
    selectedLettersContainer.className = "flex justify-center gap-2 mb-6";
    container.appendChild(selectedLettersContainer);
    this.updateSelectedWord();

    // Add letter buttons
    const letterButtonsContainer = document.createElement("div");
    letterButtonsContainer.id = "letter-buttons";
    letterButtonsContainer.className =
      "grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6";
    letterButtonsContainer.innerHTML = question.scrambled
      .map(
        (letter, idx) => `
        <button 
          class="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg text-xl font-bold text-gray-800 hover:bg-gray-50 hover:border-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-200 select-none"
          onclick="wordScrambleGame.selectLetter('${letter}', ${idx})"
          id="letter-btn-${idx}"
        >
          ${letter}
        </button>
      `
      )
      .join("");
    container.appendChild(letterButtonsContainer);

    // Add control buttons
    const controlButtonsContainer = document.createElement("div");
    controlButtonsContainer.className = "flex gap-4 justify-center";
    controlButtonsContainer.innerHTML = `
      <button 
        class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 select-none"
        onclick="wordScrambleGame.backspaceLetter()"
      >
        ⌫
      </button>
      <button 
        class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 select-none"
        onclick="wordScrambleGame.checkAnswer()"
      >
        Check
      </button>
    `;
    container.appendChild(controlButtonsContainer);

    window.renderCancelButton();
  }

  selectLetter(letter, idx) {
    const question = this.questions[this.current];
    if (this.selectedLetters.length < question.answer.length) {
      // Disable the button with the specific index
      const clickedButton = document.getElementById(`letter-btn-${idx}`);
      if (clickedButton) {
        // Add click animation
        clickedButton.classList.add("scale-90");
        setTimeout(() => {
          clickedButton.classList.remove("scale-90");
        }, 200);
        clickedButton.disabled = true;
        clickedButton.classList.add("disabled");
      }
      this.selectedLetters.push({ letter, idx });
      this.updateSelectedWord();
    }
  }

  updateSelectedWord() {
    const selectedWordContainer = document.getElementById("selected-letters");
    if (!selectedWordContainer) return;
    const question = this.questions[this.current];
    selectedWordContainer.innerHTML = Array(question.answer.length)
      .fill("_")
      .map(
        (_, index) => `
        <div class="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold select-none ${
          index < this.selectedLetters.length
            ? "text-gray-800"
            : "text-gray-400"
        } transition-all duration-300 transform ${
          index < this.selectedLetters.length ? "scale-100" : "scale-90"
        }">
          ${
            index < this.selectedLetters.length
              ? this.selectedLetters[index].letter
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

  backspaceLetter() {
    if (this.selectedLetters.length === 0) return;
    const last = this.selectedLetters.pop();
    // Re-enable đúng nút ký tự vừa xoá
    const btn = document.getElementById(`letter-btn-${last.idx}`);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("disabled");
      btn.classList.add("animate-pop");
      setTimeout(() => {
        btn.classList.remove("animate-pop");
      }, 300);
    }
    this.updateSelectedWord();
  }

  checkAnswer() {
    const question = this.questions[this.current];
    const userAnswer = this.selectedLetters.map((l) => l.letter).join("");
    const isCorrect =
      userAnswer.toLowerCase() === question.answer.toLowerCase();

    // Add check animation
    const selectedWordContainer = document.getElementById("selected-letters");
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
      this.selectedLetters = [];
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
                  <span class="font-medium text-green-700">Correct answer:</span>
                  <span class="text-green-700">${answer.answer}</span>
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
