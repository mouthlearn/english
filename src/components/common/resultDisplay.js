function renderResultDisplay(result) {
  const container = document.createElement("div");
  container.className =
    "review-section p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto";

  // Header with score
  const header = document.createElement("div");
  header.className = "text-center mb-8";
  header.innerHTML = `
    ${
      result.gameName
        ? `<div class=\"text-lg font-semibold text-blue-700 mb-1 uppercase tracking-wide\">${result.gameName}</div>`
        : ""
    }
    <h2 class=\"text-3xl font-bold text-gray-900 mb-2\">Result</h2>
    <div class=\"flex items-end justify-center gap-2 bg-blue-50 px-6 py-3 rounded-full mb-2\">
      <p class=\"text-2xl font-bold text-blue-600\">${result.score}</p>
      <p class=\"text-xl font-bold text-blue-600\">/</p>
      <p class=\"text-2xl font-bold text-blue-600\">${result.total}</p>
    </div>
  `;
  container.appendChild(header);

  // Time up warning if applicable
  if (result.timeUp) {
    const timeUpWarning = document.createElement("div");
    timeUpWarning.className =
      "flex items-center justify-center gap-2 text-red-500 mb-8";
    timeUpWarning.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span class="font-semibold">Time is up!</span>
    `;
    container.appendChild(timeUpWarning);
  }

  // Review section if answers are available
  if (result.answers && result.answers.length > 0) {
    const reviewSection = document.createElement("div");
    reviewSection.className = "space-y-4";
    reviewSection.innerHTML = `
      <h3 class="font-bold text-gray-700 mb-4">Review:</h3>
      ${result.answers
        .map(
          (a, i) => `
        <div class="flex gap-3 items-start p-4 items-center rounded-lg ${
          a.correct ? "bg-green-50" : "bg-red-50"
        }">
          <div class="flex-shrink-0">
            ${
              a.correct
                ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-lg font-bold">✔</span>'
                : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-lg font-bold">✘</span>'
            }
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-900 mb-1">${a.question}</div>
            <div class="text-sm space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-600">Your answer:</span>
                <span class="${
                  a.correct ? "text-green-600" : "text-red-600"
                } font-medium">${a.user}</span>
              </div>
              ${
                !a.correct
                  ? `
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-600">Correct:</span>
                  <span class="text-green-600 font-medium">${a.answer}</span>
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
    container.appendChild(reviewSection);
  }

  return container;
}

if (typeof window !== "undefined") {
  window.renderResultDisplay = renderResultDisplay;
}
