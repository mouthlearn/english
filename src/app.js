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
      // More games will be added here
    ];
  }

  init() {
    this.renderMainMenu();
  }

  renderMainMenu() {
    const mainContent = document.querySelector("main");
    const gameGrid = mainContent.querySelector(".grid");

    this.games.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.className =
        "bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 cursor-pointer";
      gameCard.innerHTML = `
                <div class="text-4xl mb-4">${game.icon}</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${game.title}</h3>
                <p class="text-gray-600">${game.description}</p>
            `;
      gameCard.addEventListener("click", game.handler);
      gameGrid.appendChild(gameCard);
    });

    // Add stats section
    const stats = storageManager.getGameStats();
    const statsSection = document.createElement("div");
    statsSection.className = "mt-8 bg-white rounded-lg shadow-lg p-6";
    statsSection.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Total Games</p>
                    <p class="text-2xl font-bold text-blue-800">${
                      stats.totalGames
                    }</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Average Score</p>
                    <p class="text-2xl font-bold text-green-800">${stats.averageScore.toFixed(
                      1
                    )}%</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Best Score</p>
                    <p class="text-2xl font-bold text-purple-800">${
                      stats.bestScore
                    }%</p>
                </div>
            </div>
        `;
    mainContent.appendChild(statsSection);
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
