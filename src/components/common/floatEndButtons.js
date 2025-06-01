function renderFloatEndButtons(playAgainFn) {
  // Xoá nút cũ nếu có
  let group = document.getElementById("float-end-btn-group");
  if (group) group.remove();

  group = document.createElement("div");
  group.id = "float-end-btn-group";
  group.className = "fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex gap-3";

  // Back
  const backBtn = document.createElement("button");
  backBtn.className =
    "flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 active:scale-95 transition-all duration-200 font-medium text-sm";
  backBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>';
  backBtn.title = "Back to Home";
  backBtn.onclick = () => {
    backBtn.classList.add("scale-90");
    setTimeout(() => {
      backBtn.classList.remove("scale-90");
      window.location.reload();
    }, 100);
  };

  // Again
  const playBtn = document.createElement("button");
  playBtn.className =
    "flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 font-medium text-sm";
  playBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>';
  playBtn.title = "Play Again";
  playBtn.onclick = () => {
    playBtn.classList.add("scale-90");
    setTimeout(() => {
      playBtn.classList.remove("scale-90");
      playAgainFn();
    }, 100);
  };

  // Save (Screenshot)
  const screenshotBtn = document.createElement("button");
  screenshotBtn.className =
    "flex items-center justify-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 active:scale-95 transition-all duration-200 font-medium text-sm";
  screenshotBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
  screenshotBtn.title = "Save Result";
  screenshotBtn.onclick = () => {
    screenshotBtn.classList.add("scale-90");
    setTimeout(() => {
      screenshotBtn.classList.remove("scale-90");
      // Tìm phần review để chụp
      const review = document.querySelector(
        ".review-section, .itis-result, .matching-result, .fillblank-result, .result-display"
      );
      if (!review) return alert("Không tìm thấy phần kết quả để chụp!");
      // Lấy tên game từ class
      let game = "game";
      if (review.classList.contains("itis-result")) game = "itis";
      else if (review.classList.contains("matching-result")) game = "matching";
      else if (review.classList.contains("fillblank-result"))
        game = "fillblank";
      // Ngày tháng năm
      const d = new Date();
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const fileName = `result-${game}-${day}${month}${year}.png`;

      // --- Bắt đầu fix hiệu ứng/opacity/icon ---
      // Lưu lại các class động để khôi phục
      const animatedEls = review.querySelectorAll(
        '[class*="opacity-"], [class*="scale-"], [style*="opacity"], [style*="transform"]'
      );
      const prevClassList = [];
      const prevStyle = [];
      animatedEls.forEach((el) => {
        prevClassList.push(el.className);
        prevStyle.push(el.getAttribute("style"));
        el.className = el.className
          .replace(/opacity-\d+/g, "")
          .replace(/scale-\d+/g, "")
          .replace(/transition[^\s]*/g, "")
          .replace(/duration-\d+/g, "")
          .replace(/animate-[^\s]*/g, "")
          .replace(/\s+/g, " ");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      // Đảm bảo SVG icon có màu rõ ràng
      review.querySelectorAll("svg").forEach((svg) => {
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("stroke", "currentColor");
        svg.style.color = svg.style.color || "#2563eb"; // blue-600
      });
      // --- Chụp ---
      html2canvas(review).then((canvas) => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
        // Khôi phục lại class và style cũ
        animatedEls.forEach((el, i) => {
          el.className = prevClassList[i];
          if (prevStyle[i] !== null) el.setAttribute("style", prevStyle[i]);
          else el.removeAttribute("style");
        });
      });
    }, 100);
  };

  group.appendChild(backBtn);
  group.appendChild(playBtn);
  group.appendChild(screenshotBtn);
  document.body.appendChild(group);

  // Thêm padding-bottom cho main content để tránh bị che
  const main = document.querySelector("main");
  if (main) main.style.paddingBottom = "80px";
}

function hideFloatEndButtons() {
  const group = document.getElementById("float-end-btn-group");
  if (group) group.remove();
  // Xoá padding-bottom khi ẩn nút
  const main = document.querySelector("main");
  if (main) main.style.paddingBottom = "";
}

if (typeof window !== "undefined") {
  window.renderFloatEndButtons = renderFloatEndButtons;
  window.hideFloatEndButtons = hideFloatEndButtons;
}
