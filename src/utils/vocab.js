const vocabData = [
  { id: 1, word: "Abide by", definition: "tuân thủ", ipa: "/əˈbaɪd baɪ/" },
  { id: 2, word: "Assurance", definition: "sự đảm bảo", ipa: "/əˈʃʊrəns/" },
  {
    id: 3,
    word: "Agreement",
    definition: "thảo thuận, hiệp định",
    ipa: "/əˈɡriːmənt/",
  },
  { id: 4, word: "Engate", definition: "đính hôn", ipa: "/ɪnˈɡeɪdʒ/" },
  { id: 5, word: "Cancellation", definition: "huỷ bỏ", ipa: "/ˌkænsəˈleɪʃn/" },
  { id: 6, word: "Determine", definition: "quyết tâm", ipa: "/dɪˈtɜːrmɪn/" },
  { id: 7, word: "Establish", definition: "thành lập", ipa: "/ɪˈstæblɪʃ/" },
  { id: 8, word: "Obligate", definition: "bắt buộc", ipa: "/ˈɑːblɪɡeɪt/" },
  { id: 9, word: "Party", definition: "buổi tiệc", ipa: "/ˈpɑːrti/" },
  {
    id: 10,
    word: "Provision",
    definition: "sự cung cấp, sự dự phòng",
    ipa: "/prəˈvɪʒn/",
  },
  // ... Add more vocabulary items
];

class VocabManager {
  constructor(vocabList = []) {
    this.vocabList = vocabList;
  }

  setVocabList(vocabList) {
    this.vocabList = vocabList;
  }

  getRandomWords(count) {
    const shuffled = [...this.vocabList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getWordById(id) {
    return this.vocabList.find((item) => item.id === id);
  }

  getAllWords() {
    return this.vocabList;
  }
}

// Khởi tạo instance rỗng, sẽ set vocab sau khi fetch
const vocabManager = new VocabManager();

// Export cho browser
if (typeof window !== "undefined") window.VocabManager = VocabManager;
if (typeof window !== "undefined") window.vocabManager = vocabManager;
