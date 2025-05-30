class GameTimer {
  constructor() {
    this.timerEl = null;
    this.interval = null;
    this.time = 0;
    this.type = "countdown"; // 'countdown' | 'countup'
    this.onEnd = null;
    this.isVisible = false;
    this.initElement();
  }

  initElement() {
    let el = document.getElementById("game-timer");
    if (!el) {
      el = document.createElement("div");
      el.id = "game-timer";
      el.className =
        "bg-opacity-70 transition-opacity duration-300 flex items-center px-4 py-2 bg-black text-white rounded-full shadow transition font-bold text-base";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
    }
    this.timerEl = el;
  }

  show() {
    this.isVisible = true;
    this.timerEl.style.opacity = "1";
    this.timerEl.style.pointerEvents = "auto";
  }

  hide() {
    this.isVisible = false;
    this.timerEl.style.opacity = "0";
    this.timerEl.style.pointerEvents = "none";
  }

  start({ seconds = 60, type = "countdown", onEnd = null } = {}) {
    this.stop();
    this.type = type;
    this.onEnd = onEnd;
    this.time = type === "countdown" ? seconds : 0;
    this.render();
    this.show();

    this.interval = setInterval(() => {
      if (this.type === "countdown") {
        this.time--;
        if (this.time <= 0) {
          this.time = 0;
          this.render();
          this.stop();
          if (typeof this.onEnd === "function") this.onEnd();

          return;
        }
      } else {
        this.time++;
      }
      this.render();
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.hide();
  }

  render() {
    this.timerEl.innerText = this.formatTime(this.time);
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}

window.globalGameTimer = new GameTimer();
