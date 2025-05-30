class LearnedWordsManager {
  constructor() {
    this.storageKey = "learned_words";
    this.learnedWords = this.loadLearnedWords();
  }

  loadLearnedWords() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveLearnedWords() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.learnedWords));
  }

  addLearnedWord(word) {
    if (!this.learnedWords.find((w) => w.id === word.id)) {
      this.learnedWords.push({
        ...word,
        learnedAt: new Date().toISOString(),
        lastTestedAt: null,
        testCount: 0,
      });
      this.saveLearnedWords();
    }
  }

  removeLearnedWord(wordId) {
    this.learnedWords = this.learnedWords.filter((w) => w.id !== wordId);
    this.saveLearnedWords();
  }

  getLearnedWords() {
    return this.learnedWords;
  }

  updateWordTestStatus(wordId, passed) {
    const word = this.learnedWords.find((w) => w.id === wordId);
    if (word) {
      word.lastTestedAt = new Date().toISOString();
      word.testCount++;
      if (!passed) {
        this.removeLearnedWord(wordId);
      } else {
        this.saveLearnedWords();
      }
    }
  }

  generateReviewTest(count = 10) {
    const words = [...this.learnedWords];
    if (words.length === 0) return null;

    // Shuffle array
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }

    // Take first 'count' words or all if less than count
    return words.slice(0, Math.min(count, words.length));
  }
}

// Create singleton instance
window.learnedWordsManager = new LearnedWordsManager();
