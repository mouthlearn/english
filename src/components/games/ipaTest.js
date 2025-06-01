class IpaTestGame {
  constructor() {
    this.questions = [];
    this.current = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLimit = 90; // 90s for the entire game
    this.timeUp = false;
    this.difficulty = null; // 'easy' or 'hard'
  }

  init() {
    window.renderGameHeader("IPA Test");
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
          <p class="text-sm opacity-90">Multiple Choice</p>
        </div>
      </button>
      <button id="hard-btn" class="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105">
        <span class="text-2xl">🔥</span>
        <div class="text-left">
          <p class="font-semibold">Hard Mode</p>
          <p class="text-sm opacity-90">Type Answer</p>
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
      questions.push({
        ipa: word.ipa,
        answer: word.word,
        definition: word.definition,
      });
    }
    return questions;
  }

  generateOptions(correctAnswer, allWords) {
    const options = [correctAnswer];
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());

    // Add 3 random wrong answers
    for (let word of shuffled) {
      if (word.word !== correctAnswer && options.length < 4) {
        options.push(word.word);
      }
    }

    // Shuffle the options
    return options.sort(() => 0.5 - Math.random());
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
    header.className = "flex items-center justify-between mb-4";
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">IPA Test</h2>
      <span class="px-3 py-1 rounded-full text-sm font-medium ${
        this.difficulty === "easy"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }">
        ${this.difficulty === "easy" ? "Easy Mode" : "Hard Mode"}
      </span>
    `;
    container.appendChild(header);
    const desc = document.createElement("p");
    desc.className = "text-gray-600 mb-6";
    desc.textContent = "Type the English word for the given IPA pronunciation";
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
        <p class="text-3xl font-mono text-gray-800 mb-4" translate="yes">${
          question.ipa
        }</p>
        <p class="text-gray-600 italic" translate="yes">${
          question.definition
        }</p>
      </div>
    `;
    container.appendChild(questionContainer);
    if (this.difficulty === "easy") {
      const allWords = window.vocabManager.getAllWords();
      const options = this.generateOptions(question.answer, allWords);
      const optionsContainer = document.createElement("div");
      optionsContainer.className = "space-y-3";
      optionsContainer.innerHTML = options
        .map(
          (option, index) => `
        <button class="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all transform hover:scale-[1.02]"
                onclick="ipaTestGame.handleAnswer('${option}')">
          ${option}
        </button>
      `
        )
        .join("");
      container.appendChild(optionsContainer);
    } else {
      const inputDiv = document.createElement("div");
      inputDiv.className = "space-y-4";
      inputDiv.innerHTML = `
        <input type="text" 
               class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
               placeholder="Type your answer here..."
               id="answer-input">
        <button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
                onclick="document.getElementById('answer-input').value && ipaTestGame.handleAnswer(document.getElementById('answer-input').value.trim())">
          Submit Answer
        </button>
      `;
      container.appendChild(inputDiv);
    }
    window.renderCancelButton();
    if (this.difficulty === "hard") {
      const input = document.getElementById("answer-input");
      input.focus();
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const value = input.value.trim();
          if (value) {
            this.handleAnswer(value);
          }
        }
      });
    }
  }

  handleAnswer(answer) {
    const question = this.questions[this.current];
    const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

    // Play sound feedback
    const audio = new Audio(
      isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    audio.play().catch(() => {}); // Ignore if sound fails to play

    this.userAnswers.push({
      question: question.ipa,
      answer: question.answer,
      user: answer,
      correct: isCorrect,
      definition: question.definition,
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

    this.current++;
    this.render();
  }

  showResult() {
    window.globalGameTimer.stop();
    window.hideGameHeader();

    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";

    // Save game result to storage
    storageManager.saveGameResult("ipa-test", {
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
                <p class="text-2xl font-bold text-gray-800 mb-2">${answer.answer.toUpperCase()}</p>
                <p class="text-xs text-gray-500 mb-1">IPA: <span class="font-mono tracking-widest">${
                  answer.question
                }</span></p>
                <p class="text-lg text-gray-600">${answer.definition}</p>
              </div>
              <div class="space-y-2">
                <p class="text-sm">
                  <span class="font-medium text-gray-700">Your answer:</span>
                  <span class="text-gray-600">${answer.user.toUpperCase()}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-green-700">Correct answer:</span>
                  <span class="text-green-700">${answer.answer.toUpperCase()}</span>
                </p>
              </div>
              ${
                !answer.correct && answer.pronunciationHint
                  ? `
                <div class="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm font-medium text-yellow-800 mb-1">Pronunciation Tip:</p>
                  <p class="text-sm text-yellow-700">${answer.pronunciationHint}</p>
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

const ipaTestGame = new IpaTestGame();
