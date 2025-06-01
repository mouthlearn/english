# English Vocabulary Learning

Ứng dụng web học từ vựng tiếng Anh thông qua các trò chơi tương tác. Ứng dụng được thiết kế để hoạt động tốt trên cả desktop và mobile, với hỗ trợ đầy đủ cho PWA (Progressive Web App).

## Tính năng

- **Nhiều loại trò chơi học tập:**
  - Matching Game: Ghép từ với nghĩa
  - Fill in the Blank: Điền từ vào chỗ trống
  - IPA Test: Kiểm tra phát âm
  - Context Test: Học từ qua ngữ cảnh
  - Word Scramble: Sắp xếp chữ cái thành từ có nghĩa

- **Theo dõi tiến độ:**
  - Lưu trữ từ đã học
  - Thống kê kết quả
  - Theo dõi quá trình học tập

- **Giao diện thân thiện:**
  - Thiết kế responsive
  - Hỗ trợ đa nền tảng
  - Tối ưu cho mobile

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/online-english-test.git
cd online-english-test
```

2. Mở file `index.html` trong trình duyệt hoặc sử dụng một local server:
```bash
# Sử dụng Python
python -m http.server

# Hoặc sử dụng Node.js
npx serve
```

## Sử dụng trên Mobile

### iOS
1. Mở Safari và truy cập website
2. Nhấn vào nút Share (biểu tượng chia sẻ)
3. Chọn "Add to Home Screen"
4. Ứng dụng sẽ được thêm vào Màn hình chính và chạy ở chế độ toàn màn hình

### Android
1. Mở Chrome và truy cập website
2. Chrome sẽ tự động đề xuất cài đặt PWA
3. Hoặc nhấn vào menu và chọn "Install app"

## Công nghệ sử dụng

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- PWA (Progressive Web App)
- Local Storage API

## Cấu trúc dự án

```
online-english-test/
├── index.html          # File HTML chính
├── manifest.json       # Cấu hình PWA
├── icons/             # Thư mục chứa icon
│   ├── icon.svg
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── src/               # Mã nguồn JavaScript
│   ├── app.js         # File chính
│   ├── components/    # Các component
│   └── utils/         # Các tiện ích
└── data/              # Dữ liệu từ vựng
```

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.

## Giấy phép

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết. 