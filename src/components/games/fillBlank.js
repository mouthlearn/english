class ItIsGame {
  constructor() {
    this.questions = [];
    this.current = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLimit = 90; // 90s cho toàn bộ game
    this.timeUp = false;
  }

  init() {
    window.hideFloatEndButtons && window.hideFloatEndButtons();
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
      const v = shuffled[i];
      // Random loại câu: 0 = điền từ vào nghĩa, 1 = điền nghĩa vào từ
      const type = Math.random() < 0.5 ? 0 : 1;
      if (type === 0) {
        // Điền từ vào nghĩa tiếng Việt
        questions.push({
          type: "vi",
          text: `"${v.definition}" nghĩa là ___?`,
          answer: v.word,
          choices: this.generateChoices(v.word, vocabList),
        });
      } else {
        // Điền nghĩa vào từ tiếng Anh
        questions.push({
          type: "en",
          text: `"${v.word}" có nghĩa là ___?`,
          answer: v.definition,
          choices: this.generateChoices(v.definition, vocabList, true),
        });
      }
    }
    return questions;
  }

  generateChoices(correct, vocabList, isDefinition = false) {
    // Sinh 3 đáp án sai + 1 đáp án đúng, trộn ngẫu nhiên
    let wrongs;
    if (!isDefinition) {
      wrongs = vocabList
        .filter((v) => v.word !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.word);
    } else {
      wrongs = vocabList
        .filter((v) => v.definition !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.definition);
    }
    const all = [...wrongs, correct].sort(() => 0.5 - Math.random());
    return all;
  }

  render() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
      <div class="px-4 min-h-[100vh] flex flex-col items-center justify-center">
        <div class="w-full max-w-5xl flex flex-col gap-6 items-center">
          <!-- Card Title/Desc/Mode -->
          <div class="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center mb-2">
            <h2 class="text-2xl font-bold text-gray-800 text-center flex-1">It is?</h2>
            <p class="text-gray-600 text-center mt-2">Choose the correct meaning or English word for the given definition</p>
            <div class="mt-2 flex justify-center">
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Normal Mode</span>
            </div>
            <div id="game-timer" class="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 bg-blue-600 text-white border border-blue-300 shadow-lg font-bold text-base px-6 py-2 rounded-full custom-ping z-10"></div>
          </div>
          <!-- Card Nội dung chính -->
          <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6">
            <div id="fillblank-question-content"></div>
          </div>
        </div>
        <!-- Floating Back Button -->
        <button id="floating-back-btn" class="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex items-center gap-2 px-8 py-3 bg-gray-700 text-white rounded-full shadow-xl hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-lg select-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
    `;
    // Render nội dung câu hỏi vào #fillblank-question-content
    const contentDiv = document.getElementById("fillblank-question-content");
    if (this.timeUp) {
      this.showResult();
      return;
    }
    if (this.current >= this.questions.length) {
      this.showResult();
      return;
    }
    const q = this.questions[this.current];
    // ... render phần còn lại như cũ, nhưng vào contentDiv ...
    const header = document.createElement("div");
    header.className = "mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-2">It is?</h2>
      <p class="text-gray-600 mb-2">Question ${this.current + 1} of ${
      this.questions.length
    }</p>
    `;
    contentDiv.appendChild(header);
    const questionDiv = document.createElement("div");
    questionDiv.className = "text-xl font-medium text-gray-800 mb-4";
    questionDiv.innerHTML = q.text;
    contentDiv.appendChild(questionDiv);
    const choicesDiv = document.createElement("div");
    choicesDiv.className = "grid grid-cols-1 gap-4";
    choicesDiv.innerHTML = q.choices
      .map(
        (c, idx) => `
        <button class="choice-btn w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all transform hover:scale-[1.02]" data-choice="${c}">${c}</button>
      `
      )
      .join("");
    contentDiv.appendChild(choicesDiv);
    // Gắn sự kiện
    choicesDiv.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleAnswer(e.target.dataset.choice);
      });
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

  handleAnswer(choice) {
    const q = this.questions[this.current];
    const isCorrect = choice === q.answer;
    // Lấy từ vựng gốc để lấy IPA và nghĩa
    let word = "",
      definition = "",
      ipa = "";
    if (q.type === "vi") {
      // Điền từ vào nghĩa tiếng Việt
      word = q.answer;
      definition = q.text.replace(/"|"| nghĩa là ___\?/g, "");
      const vocab = window.vocabManager
        .getAllWords()
        .find((w) => w.word === word);
      ipa = vocab ? vocab.ipa : "";
    } else {
      // Điền nghĩa vào từ tiếng Anh
      word = q.text.replace(/"|"| có nghĩa là ___\?/g, "");
      definition = q.answer;
      const vocab = window.vocabManager
        .getAllWords()
        .find((w) => w.definition === definition);
      ipa = vocab ? vocab.ipa : "";
    }
    this.userAnswers.push({
      question: q.text,
      answer: q.answer,
      user: choice,
      correct: isCorrect,
      word,
      definition,
      ipa,
      correctAnswer: q.answer,
    });

    // Thêm từ vào danh sách đã học nếu trả lời đúng
    if (isCorrect) {
      const vocab = window.vocabManager
        .getAllWords()
        .find((w) => w.word === q.answer || w.definition === q.answer);
      if (vocab) {
        window.learnedWordsManager.addLearnedWord(vocab);
      }
    }

    if (isCorrect) this.score++;
    this.current++;
    this.render();
  }

  showResult() {
    window.hideGameHeader();
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = "";

    const answers = this.userAnswers || [];
    const answersSection = document.createElement("div");
    answersSection.className = "result-display mt-8 pb-16 space-y-6";
    answersSection.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 mb-6">Detailed Answers</h3>
      ${answers
        .map((answer, index) => {
          // Nếu là câu hỏi điền từ thì in hoa, còn nghĩa thì giữ nguyên
          const isWord = answer.word && /^[a-zA-Z]+$/.test(answer.word);
          const word = isWord ? answer.word.toUpperCase() : answer.word || "";
          const correct =
            answer.correctAnswer && /^[a-zA-Z]+$/.test(answer.correctAnswer)
              ? answer.correctAnswer.toUpperCase()
              : answer.correctAnswer || "";
          const user =
            answer.user && /^[a-zA-Z]+$/.test(answer.user)
              ? answer.user.toUpperCase()
              : answer.user || "";
          return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6 ${answer.correct ? "bg-green-50" : "bg-red-50"}">
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-sm text-gray-500">
                Question ${index + 1}
              </span>
            </div>
            <div class="space-y-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-800 mb-2">${word}</p>
                <p class="text-lg text-gray-600">${answer.definition || ""}</p>
              </div>
              <div class="space-y-2">
                <p class="text-sm">
                  <span class="font-medium text-gray-700">Your answer:</span>
                  <span class="text-gray-600">${user}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-green-700">Correct answer:</span>
                  <span class="text-green-700">${correct}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-gray-700">IPA:</span>
                  <span class="text-gray-600 font-mono">${
                    answer.ipa || ""
                  }</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
        })
        .join("")}
    `;
    mainContent.appendChild(answersSection);
    window.renderFloatEndButtons(() => this.init());
  }

  handleCancel() {
    /* không cần nữa, đã dùng component chung */
  }
}

const itIsGame = new ItIsGame();
