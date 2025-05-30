class StorageManager {
  constructor() {
    this.storageKey = "english_vocab_learning";
  }

  saveGameResult(gameType, result) {
    const history = this.getGameHistory();
    history.push({
      gameType,
      result,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  getGameHistory() {
    const history = localStorage.getItem(this.storageKey);
    return history ? JSON.parse(history) : [];
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }

  getGameStats() {
    const history = this.getGameHistory();
    const stats = {
      totalGames: history.length,
      averageScore: 0,
      bestScore: 0,
      gamesByType: {},
    };

    if (history.length > 0) {
      const scores = history.map((game) => game.result.score);
      stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      stats.bestScore = Math.max(...scores);

      // Group games by type
      history.forEach((game) => {
        if (!stats.gamesByType[game.gameType]) {
          stats.gamesByType[game.gameType] = {
            count: 0,
            averageScore: 0,
          };
        }
        stats.gamesByType[game.gameType].count++;
        stats.gamesByType[game.gameType].averageScore =
          (stats.gamesByType[game.gameType].averageScore *
            (stats.gamesByType[game.gameType].count - 1) +
            game.result.score) /
          stats.gamesByType[game.gameType].count;
      });
    }

    return stats;
  }
}

const storageManager = new StorageManager();
