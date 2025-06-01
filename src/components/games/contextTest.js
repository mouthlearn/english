class ContextTestGame {
  constructor() {
    this.questions = [];
    this.current = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLimit = 120; // 120s for the entire game
    this.timeUp = false;
    this.difficulty = null; // 'easy' or 'hard'
  }

  init() {
    window.hideFloatEndButtons && window.hideFloatEndButtons();
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

    // Map of words to their appropriate sentence templates
    const wordTemplates = {
      // Business context
      agree: [
        "Both parties need to ___ to the terms before signing.",
        "The contract ___ mutual understanding between companies.",
        "We must ___ on the delivery schedule.",
      ],
      assurance: [
        "The company provides ___ of quality service.",
        "We need ___ that the project will be completed on time.",
        "The warranty offers ___ for product defects.",
      ],
      comply: [
        "All employees must ___ with safety regulations.",
        "The company needs to ___ with new tax laws.",
        "We should ___ with industry standards.",
      ],
      commitment: [
        "The team shows strong ___ to the project.",
        "We need your ___ to meet the deadline.",
        "The company's ___ to quality is evident.",
      ],
      provision: [
        "The contract includes ___ for late delivery.",
        "We need to make ___ for unexpected costs.",
        "The agreement has ___ for early termination.",
      ],
      specific: [
        "Please provide ___ details about the requirements.",
        "The report needs ___ information about costs.",
        "We need ___ examples to understand the issue.",
      ],
      standard: [
        "The product meets industry ___.",
        "We need to maintain high ___ of quality.",
        "The service exceeds the required ___.",
      ],
      terms: [
        "Please review the ___ of the agreement.",
        "The contract ___ are negotiable.",
        "We need to clarify the ___ of payment.",
      ],
      amount: [
        "The total ___ is subject to change.",
        "Please specify the ___ needed.",
        "The ___ of work required is significant.",
      ],
      services: [
        "The company provides various ___.",
        "We offer professional ___ to clients.",
        "The ___ include maintenance and support.",
      ],
      repaired: [
        "The equipment has been ___.",
        "The system needs to be ___ immediately.",
        "The damage has been ___ successfully.",
      ],
      condition: [
        "The product is in good ___.",
        "We need to check the ___ of the equipment.",
        "The ___ of the contract must be met.",
      ],
      decision: [
        "The board will ___ on the proposal.",
        "We need to ___ quickly on this matter.",
        "The final ___ will be announced tomorrow.",
      ],
      attract: [
        "The new design will ___ more customers.",
        "The offer should ___ potential investors.",
        "The campaign aims to ___ new clients.",
      ],
      competition: [
        "The market has strong ___.",
        "We need to stay ahead of the ___.",
        "The ___ is getting more intense.",
      ],
      consume: [
        "The project will ___ many resources.",
        "The system ___ a lot of energy.",
        "The process ___ too much time.",
      ],
      convince: [
        "We need to ___ the client to proceed.",
        "The data should ___ them of the benefits.",
        "The presentation will ___ the investors.",
      ],
      currently: [
        "We are ___ working on the project.",
        "The system is ___ under maintenance.",
        "The team is ___ reviewing the proposal.",
      ],
      process: [
        "The application ___ takes time.",
        "We need to follow the correct ___.",
        "The manufacturing ___ is efficient.",
      ],
      occasion: [
        "This is a special ___ for celebration.",
        "The meeting is a formal ___.",
        "The event is a rare ___.",
      ],
      persuasion: [
        "The art of ___ is important in sales.",
        "Good ___ skills are valuable.",
        "The power of ___ can influence decisions.",
      ],
      productive: [
        "The team is very ___.",
        "The meeting was highly ___.",
        "The discussion was very ___.",
      ],
      grow: [
        "The business continues to ___.",
        "The market is expected to ___.",
        "The company needs to ___ sustainably.",
      ],
      satisfaction: [
        "Customer ___ is our priority.",
        "The service ensures high ___.",
        "We aim for maximum ___.",
      ],
      realize: [
        "We need to ___ our goals.",
        "The team must ___ the importance.",
        "They will ___ the benefits soon.",
      ],
      characteristic: [
        "This is a key ___ of the product.",
        "The main ___ is reliability.",
        "The unique ___ sets it apart.",
      ],
      consequence: [
        "Consider the ___ of your actions.",
        "The ___ could be serious.",
        "The long-term ___ must be evaluated.",
      ],
      consider: [
        "Please ___ all options.",
        "We need to ___ the risks.",
        "The team will ___ the proposal.",
      ],
      expiration: [
        "The contract is near ___.",
        "Check the ___ date.",
        "The license is approaching ___.",
      ],
      frequently: [
        "This issue occurs ___.",
        "We meet ___ to discuss progress.",
        "The system is ___ updated.",
      ],
      imply: [
        "The data ___ a positive trend.",
        "The results ___ success.",
        "The evidence ___ a solution.",
      ],
      promise: [
        "We ___ to deliver on time.",
        "The company ___ quality service.",
        "They ___ to meet the deadline.",
      ],
      protect: [
        "We need to ___ our assets.",
        "The system ___ against threats.",
        "The law ___ consumer rights.",
      ],
      reputation: [
        "The company has a good ___.",
        "We need to maintain our ___.",
        "The brand's ___ is important.",
      ],
      require: [
        "The job ___ experience.",
        "The project ___ careful planning.",
        "The task ___ attention to detail.",
      ],
      variety: [
        "We offer a ___ of services.",
        "The store has a wide ___ of products.",
        "The menu has a good ___ of options.",
      ],
      address: [
        "We need to ___ this issue.",
        "The team will ___ the concerns.",
        "The meeting will ___ the problems.",
      ],
      avoid: [
        "We should ___ such mistakes.",
        "The system helps ___ errors.",
        "The plan will ___ delays.",
      ],
      demonstrate: [
        "The results ___ success.",
        "The data ___ improvement.",
        "The test will ___ effectiveness.",
      ],
      develop: [
        "We need to ___ new strategies.",
        "The team will ___ the solution.",
        "The company continues to ___.",
      ],
      evaluate: [
        "We need to ___ the results.",
        "The team will ___ the performance.",
        "The system will ___ the data.",
      ],
      gather: [
        "We need to ___ more information.",
        "The team will ___ the evidence.",
        "The system will ___ the data.",
      ],
      primarily: [
        "The focus is ___ on quality.",
        "The project is ___ for research.",
        "The system is ___ for security.",
      ],
      rick: [
        "The farmer built a ___ of hay.",
        "The ___ of straw was ready for winter.",
        "The field had several ___ of crops.",
      ],
      strategy: [
        "We need a clear ___.",
        "The team developed a new ___.",
        "The company's ___ is effective.",
      ],
      strong: [
        "The team has a ___ work ethic.",
        "The product has a ___ market.",
        "The company has a ___ position.",
      ],
      substitution: [
        "We need to find a ___.",
        "The ___ was successful.",
        "The team made a necessary ___.",
      ],
      direct: [
        "Please ___ your questions to me.",
        "The manager will ___ the team.",
        "The system will ___ the traffic.",
      ],
      owner: [
        "The ___ of the company.",
        "The property ___ is responsible.",
        "The business ___ is present.",
      ],
      lender: [
        "The ___ approved the loan.",
        "The bank is the main ___.",
        "The ___ requires collateral.",
      ],
      borrower: [
        "The ___ must repay the loan.",
        "The ___ signed the agreement.",
        "The ___ provided documentation.",
      ],
    };

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const word = shuffled[i];
      const wordKey = word.word.toLowerCase();

      // Get templates for this word
      const templates = wordTemplates[wordKey];

      if (templates) {
        // Select a random template for this word
        const sentence =
          templates[Math.floor(Math.random() * templates.length)];

        questions.push({
          context: "business", // We can add more contexts later
          sentence: sentence.replace("___", "_____"),
          answer: word.word,
          definition: word.definition,
          ipa: word.ipa,
        });
      }
    }
    return questions;
  }

  render() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
      <div class="px-4 min-h-[100vh] flex flex-col items-center justify-center">
        <div class="w-full max-w-5xl flex flex-col gap-6 items-center">
          <!-- Card Title/Desc/Mode -->
          <div class="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center mb-2">
            <h2 class="text-2xl font-bold text-gray-800 text-center flex-1">Context Test</h2>
            <p class="text-gray-600 text-center mt-2">Fill in the blank with the appropriate word</p>
            <div class="mt-2 flex justify-center">
              <span class="px-3 py-1 rounded-full text-sm font-medium ${
                this.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }">${
      this.difficulty === "easy" ? "Easy Mode" : "Hard Mode"
    }</span>
            </div>
            <div id="game-timer" class="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 bg-blue-600 text-white border border-blue-300 shadow-lg font-bold text-base px-6 py-2 rounded-full custom-ping z-10"></div>
          </div>
          <!-- Card Nội dung chính -->
          <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6">
            <div id="context-question-content"></div>
          </div>
        </div>
        <!-- Floating Back Button -->
        <button id="floating-back-btn" class="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex items-center gap-2 px-8 py-3 bg-gray-700 text-white rounded-full shadow-xl hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-lg select-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
    `;
    // Render nội dung câu hỏi vào #context-question-content
    const contentDiv = document.getElementById("context-question-content");
    if (this.current >= this.questions.length || this.timeUp) {
      this.showResult();
      return;
    }
    const question = this.questions[this.current];
    const questionContainer = document.createElement("div");
    questionContainer.className = "mb-6";
    questionContainer.innerHTML = `
      <div class="flex items-center space-x-2 mb-4">
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium" translate="yes">
          ${question.context}
        </span>
        <span class="text-sm text-gray-500">
          Question ${this.current + 1} of ${this.questions.length}
        </span>
      </div>
      <p class="text-xl font-medium text-gray-800 mb-4" translate="yes">${
        question.sentence
      }</p>
      <p class="text-gray-600 italic" translate="yes">${question.definition}</p>
    `;
    contentDiv.appendChild(questionContainer);
    if (this.difficulty === "easy") {
      const allWords = window.vocabManager.getAllWords();
      const options = this.generateOptions(question.answer, allWords);
      const optionsContainer = document.createElement("div");
      optionsContainer.className = "space-y-3";
      optionsContainer.innerHTML = options
        .map(
          (option, index) => `
        <button class="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all transform hover:scale-[1.02]"
                onclick="contextTestGame.handleAnswer('${option}')">
          ${option}
        </button>
      `
        )
        .join("");
      contentDiv.appendChild(optionsContainer);
    } else {
      const inputDiv = document.createElement("div");
      inputDiv.className = "space-y-4";
      inputDiv.innerHTML = `
        <input type="text" 
               class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
               placeholder="Type your answer here..."
               id="answer-input"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
        <button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
                onclick="document.getElementById('answer-input').value && contextTestGame.handleAnswer(document.getElementById('answer-input').value.trim())">
          Submit Answer
        </button>
      `;
      contentDiv.appendChild(inputDiv);
    }
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
    // Focus input nếu hard mode
    if (this.difficulty === "hard") {
      const input = document.getElementById("answer-input");
      input && input.focus();
      input &&
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

  handleAnswer(answer) {
    const question = this.questions[this.current];
    const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

    // Play sound feedback
    const audio = new Audio(
      isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    audio.play().catch(() => {}); // Ignore if sound fails to play

    this.userAnswers.push({
      context: question.context,
      sentence: question.sentence,
      question: question.sentence,
      answer: question.answer,
      user: answer,
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

    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
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
    storageManager.saveGameResult("context-test", {
      score: Math.round((this.score / this.questions.length) * 100),
      total: 100,
      timeUp: this.timeUp,
      duration: this.timeLimit,
      userAnswers: this.userAnswers,
    });

    // Only show detailed answers
    const answersSection = document.createElement("div");
    answersSection.className = "result-display mt-8 pb-16 space-y-6";
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
                <p class="text-xs text-gray-500 mb-1">Sentence: <span class="font-mono tracking-widest">${
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
                <p class="text-sm">
                  <span class="font-medium text-gray-700">IPA:</span>
                  <span class="text-gray-600 font-mono">${answer.ipa}</span>
                </p>
              </div>
              ${
                !answer.correct && answer.hint
                  ? `
                <div class="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm font-medium text-yellow-800 mb-1">Hint:</p>
                  <p class="text-sm text-yellow-700">${answer.hint}</p>
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

  getContextExplanation(context, sentence, word) {
    // Add context-specific explanations
    const contextExplanations = {
      business: `In a business context, the word "${word}" is used to describe professional activities, corporate operations, or commercial interactions. This sentence demonstrates how the word is typically used in a business setting.`,
      daily: `In daily conversation, the word "${word}" is used in casual, everyday situations. This sentence shows how the word is commonly used in regular communication.`,
      academic: `In an academic context, the word "${word}" is used in educational or research settings. This sentence illustrates how the word is typically used in scholarly or learning environments.`,
    };

    return (
      contextExplanations[context] ||
      `The word "${word}" is used in this sentence to express a specific meaning in the given context.`
    );
  }

  getHintForAnswer(answer) {
    const hints = {
      business:
        "In business contexts, focus on professional and formal vocabulary. Look for words that express agreement, commitment, or business processes.",
      daily:
        "In daily contexts, think about common, everyday situations and casual communication. The word should fit naturally in regular conversation.",
      academic:
        "In academic contexts, consider more formal and precise vocabulary. The word should be appropriate for educational or research settings.",
    };

    return (
      hints[answer.context] ||
      "Consider the context and meaning of the sentence carefully. The word should fit both grammatically and semantically."
    );
  }
}

const contextTestGame = new ContextTestGame();
