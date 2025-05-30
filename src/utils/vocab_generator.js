// Usage: generateVocabFromCSV(csvText, oldVocabArr)
// csvText: nội dung file vocab.csv (chuỗi)
// oldVocabArr: mảng vocab cũ (nếu có), dạng [{id, word, definition, ipa}]
// Trả về mảng vocab mới (không trùng từ)

function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    // Xử lý trường hợp có dấu phẩy trong chuỗi
    const row = lines[i]
      .match(/("[^"]*"|[^,])+/g)
      .map((cell) => cell.replace(/^"|"$/g, ""));
    if (row.length < 4) continue;
    data.push({
      id: Number(row[0]),
      word: row[1].trim(),
      definition: row[2].trim(),
      ipa: row[3].trim(),
    });
  }
  return data;
}

function generateVocabFromCSV(csvText, oldVocabArr = []) {
  const csvVocab = parseCSV(csvText);
  const seen = new Set(oldVocabArr.map((v) => v.word.toLowerCase()));
  const result = [...oldVocabArr];
  for (const v of csvVocab) {
    if (!seen.has(v.word.toLowerCase())) {
      result.push(v);
      seen.add(v.word.toLowerCase());
    }
  }
  return result;
}

// Example usage:
// const fs = require('fs');
// const csvText = fs.readFileSync('vocab.csv', 'utf8');
// const oldVocab = JSON.parse(fs.readFileSync('vocab.json', 'utf8'));
// const newVocab = generateVocabFromCSV(csvText, oldVocab);
// fs.writeFileSync('vocab.json', JSON.stringify(newVocab, null, 2));

// Export for browser or Node.js
if (typeof module !== "undefined")
  module.exports = { generateVocabFromCSV, parseCSV };
