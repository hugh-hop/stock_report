window.StorageManager = class StorageManager {
  constructor() {
    this.prefix = 'tda_';
    this.isWechat = typeof wx !== 'undefined';
  }

  save(key, value) {
    try {
      let data = JSON.stringify(value);
      let fullKey = this.prefix + key;
      if (this.isWechat) {
        wx.setStorageSync(fullKey, data);
      } else {
        localStorage.setItem(fullKey, data);
      }
      return true;
    } catch (e) {
      console.warn('Storage save failed:', e);
      return false;
    }
  }

  load(key, defaultValue) {
    try {
      let fullKey = this.prefix + key;
      let data;
      if (this.isWechat) {
        data = wx.getStorageSync(fullKey);
      } else {
        data = localStorage.getItem(fullKey);
      }
      if (data === null || data === undefined || data === '') return defaultValue;
      return JSON.parse(data);
    } catch (e) {
      console.warn('Storage load failed:', e);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      let fullKey = this.prefix + key;
      if (this.isWechat) {
        wx.removeStorageSync(fullKey);
      } else {
        localStorage.removeItem(fullKey);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  savePlayerData(data) {
    return this.save('player', data);
  }

  loadPlayerData() {
    return this.load('player', {
      name: '觉醒者',
      level: 1,
      exp: 0,
      gold: 5000,
      gems: 200,
      energy: 120,
      energyMax: 120,
      lastEnergyRefill: Date.now(),
      currentChapter: 0,
      currentLevel: 1,
      levelStars: {},
      towerLevels: {},
      towerBranches: {},
      pvpElo: 1500,
      pvpWins: 0,
      pvpLosses: 0,
      battlePassLevel: 0,
      battlePassPremium: false,
      settings: { musicVolume: 0.7, sfxVolume: 0.85, quality: 'high', particles: true, fps: 60, notifications: true, vibration: false },
      dailyCheckin: null,
      tutorialComplete: false,
      totalPlayTime: 0,
      totalKills: 0,
      totalBattles: 0,
      achievements: []
    });
  }

  saveSettings(settings) {
    return this.save('settings', settings);
  }

  loadSettings() {
    return this.load('settings', { musicVolume: 0.7, sfxVolume: 0.85, quality: 'high', particles: true, fps: 60, notifications: true, vibration: false });
  }

  clearAll() {
    try {
      if (this.isWechat) {
        wx.clearStorageSync();
      } else {
        let keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
        keys.forEach(k => localStorage.removeItem(k));
      }
      return true;
    } catch (e) {
      return false;
    }
  }
};
