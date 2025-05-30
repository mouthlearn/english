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
    window.renderGameHeader("It is?");
    window.hideFloatEndButtons();
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
    mainContent.innerHTML = "";
    if (this.timeUp) {
      this.showResult();
      return;
    }
    if (this.current >= this.questions.length) {
      this.showResult();
      return;
    }
    const q = this.questions[this.current];

    // Card UI
    const container = document.createElement("div");
    container.className = "max-w-xl mx-auto";
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg p-6";
    card.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">It is?</h2>
        <p class="text-gray-600 mb-2">Question ${this.current + 1} of ${
      this.questions.length
    }</p>
      </div>
      <div class="text-xl font-medium text-gray-800 mb-4">${q.text}</div>
      <div class="grid grid-cols-1 gap-4">
        ${q.choices
          .map(
            (c, idx) => `
          <button class="choice-btn w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all transform hover:scale-[1.02]" data-choice="${c}">${c}</button>
        `
          )
          .join("")}
      </div>
    `;
    container.appendChild(card);
    mainContent.appendChild(container);
    // Gắn sự kiện
    card.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleAnswer(e.target.dataset.choice);
      });
    });
    window.renderCancelButton();
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
    answersSection.className = "result-display mt-8 space-y-6";
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
                  <span class="font-medium text-gray-700">Correct answer:</span>
                  <span class="text-gray-600">${correct}</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium text-gray-700">IPA:</span>
                  <span class="text-gray-600 font-mono">${
                    answer.ipa || ""
                  }</span>
                </p>
              </div>
              ${
                !answer.correct
                  ? `
                <div class="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm font-medium text-yellow-800 mb-1">Tip for next time:</p>
                  <p class="text-sm text-yellow-700">Try to remember the meaning and IPA of the word for better recognition next time.</p>
                </div>
              `
                  : ""
              }
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
