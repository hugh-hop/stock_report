window.AudioManager = class AudioManager {
  constructor() {
    this.musicVolume = 0.7;
    this.sfxVolume = 0.85;
    this.enabled = true;
    this.sfxEnabled = true;
    this._audioContext = null;
  }

  init() {
    try {
      this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not available');
    }
  }

  playSfx(name) {
    if (!this.sfxEnabled || !this._audioContext) return;
    try {
      let ctx = this._audioContext;
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = this.sfxVolume * 0.3;
      let freqMap = { click: 800, place: 600, upgrade: 1000, sell: 400, hit: 300, kill: 500, skill: 1200, victory: [523,659,784], defeat: [400,350,300] };
      let freq = freqMap[name] || 600;
      if (Array.isArray(freq)) {
        freq.forEach((f, i) => {
          let o = ctx.createOscillator();
          let g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          g.gain.value = this.sfxVolume * 0.2;
          o.frequency.value = f;
          o.start(ctx.currentTime + i * 0.15);
          o.stop(ctx.currentTime + i * 0.15 + 0.15);
        });
      } else {
        osc.frequency.value = freq;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {}
  }

  setMusicVolume(v) { this.musicVolume = v; }
  setSfxVolume(v) { this.sfxVolume = v; }
  toggleMusic() { this.enabled = !this.enabled; }
  toggleSfx() { this.sfxEnabled = !this.sfxEnabled; }
};
