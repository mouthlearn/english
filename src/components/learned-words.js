class LearnedWordsComponent {
  constructor() {
    this.learnedWordsManager = window.learnedWordsManager;
    this.currentTest = null;
    this.currentQuestionIndex = 0;
    this.testResults = [];
  }

  init() {
    window.renderGameHeader("Learned Words");
    this.render();
  }

  render() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="mb-8">
                    <div class="bg-white rounded-lg shadow-lg p-6 mb-4">
                        <p class="text-xl font-bold text-blue-800">
                            Total Learned Words: ${
                              this.learnedWordsManager.getLearnedWords().length
                            }
                        </p>
                    </div>
                </div>

                <div id="learnedWordsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${this.renderLearnedWordsList()}
                </div>
            </div>
        `;

    this.attachEventListeners();
  }

  renderLearnedWordsList() {
    const words = this.learnedWordsManager.getLearnedWords();
    if (words.length === 0) {
      return '<p class="text-gray-600">No words have been learned yet.</p>';
    }

    return words
      .map(
        (word) => `
            <div class="bg-white rounded-lg shadow-lg p-4">
                <h3 class="text-xl font-bold text-blue-800">${word.word}</h3>
                <p class="text-sm text-gray-500 mt-2">${word.ipa}</p>
                <p class="text-gray-600">${word.definition}</p>
                <div class="text-xs text-gray-400 mt-2">
                    Learned: ${new Date(word.learnedAt).toLocaleDateString()}
                    ${
                      word.lastTestedAt
                        ? `<br>Last tested: ${new Date(
                            word.lastTestedAt
                          ).toLocaleDateString()}`
                        : ""
                    }
                    <br>Test attempts: ${word.testCount}
                </div>
            </div>
        `
      )
      .join("");
  }

  attachEventListeners() {
    const submitAnswerBtn = document.getElementById("submitAnswer");
    if (submitAnswerBtn) {
      submitAnswerBtn.addEventListener("click", () => {
        const selectedAnswer = document.querySelector(
          'input[name="answer"]:checked'
        );
        if (selectedAnswer) {
          const currentWord = this.currentTest[this.currentQuestionIndex];
          const passed = selectedAnswer.value === "remember";

          this.testResults.push({
            wordId: currentWord.id,
            passed: passed,
          });

          // Cập nhật trạng thái từ trong danh sách đã học
          if (passed) {
            // Nếu nhớ được, cập nhật thời gian kiểm tra và số lần kiểm tra
            this.learnedWordsManager.updateWordTestStatus(currentWord.id, true);
          } else {
            // Nếu quên, xóa khỏi danh sách đã học
            this.learnedWordsManager.removeLearnedWord(currentWord.id);
          }

          this.currentQuestionIndex++;
          this.render();
        }
      });
    }

    const backToLearnedWordsBtn = document.getElementById("backToLearnedWords");
    if (backToLearnedWordsBtn) {
      backToLearnedWordsBtn.addEventListener("click", () => {
        document.getElementById("learnedWordsList").classList.remove("hidden");
        document.getElementById("reviewTest").classList.add("hidden");
        this.currentTest = null;
        this.render();
      });
    }
  }
}

// Create singleton instance
window.learnedWordsComponent = new LearnedWordsComponent();
