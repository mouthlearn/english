function renderFloatEndButtons(playAgainFn) {
  // Xoá nút cũ nếu có
  let group = document.getElementById("float-end-btn-group");
  if (group) group.remove();

  group = document.createElement("div");
  group.id = "float-end-btn-group";
  group.className = "fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex gap-4";

  // Again
  const playBtn = document.createElement("button");
  playBtn.className =
    "flex items-center gap-2 px-8 py-3 min-w-[120px] bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition font-bold text-base";
  playBtn.innerHTML = "♻ Again";
  playBtn.onclick = playAgainFn;

  // Save (Screenshot)
  const screenshotBtn = document.createElement("button");
  screenshotBtn.className =
    "flex items-center gap-2 px-8 py-3 min-w-[120px] bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition font-bold text-base";
  screenshotBtn.innerHTML = "🎀 Save";
  screenshotBtn.onclick = () => {
    // Tìm phần review để chụp
    const review = document.querySelector(
      ".review-section, .itis-result, .matching-result, .fillblank-result, .result-display"
    );
    if (!review) return alert("Không tìm thấy phần kết quả để chụp!");
    // Lấy tên game từ class
    let game = "game";
    if (review.classList.contains("itis-result")) game = "itis";
    else if (review.classList.contains("matching-result")) game = "matching";
    else if (review.classList.contains("fillblank-result")) game = "fillblank";
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
  };

  // Home
  const backBtn = document.createElement("button");
  backBtn.className =
    "flex items-center gap-2 px-8 py-3 min-w-[120px] bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition font-bold text-base";
  backBtn.innerHTML = "🏠 Home";
  backBtn.onclick = () => window.location.reload();

  group.appendChild(playBtn);
  group.appendChild(screenshotBtn);
  group.appendChild(backBtn);
  document.body.appendChild(group);

  // Thêm padding-bottom cho main content để tránh bị che
  const main = document.querySelector("main");
  if (main) main.style.paddingBottom = "120px";
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
