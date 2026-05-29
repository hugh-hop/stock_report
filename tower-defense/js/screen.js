window.ScreenManager = class ScreenManager {
  constructor() {
    this.history = [];
    this.transitionDuration = 300;
  }

  show(screenId) {
    this.history.push(this.current);
    this.current = screenId;
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.opacity = '0';
    });
    let screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      requestAnimationFrame(() => { screen.style.opacity = '1'; });
    }
  }

  back() {
    if (this.history.length > 0) {
      let prev = this.history.pop();
      this.current = prev;
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      let screen = document.getElementById(prev);
      if (screen) screen.classList.add('active');
    }
  }
};
