window.App = class App {
  constructor() {
    this.storage = new StorageManager();
    this.audio = new AudioManager();
    this.ui = new UIManager();
    this.shop = new ShopSystem();
    this.upgrade = new UpgradeSystem();
    this.pvp = new PVPSystem();
    this.social = new SocialSystem();
    this.battlePass = new BattlePassSystem();
    this.screen = new ScreenManager();
    this.playerData = null;
    this.lastUpdate = Date.now();
  }

  init() {
    this.playerData = this.storage.loadPlayerData();
    this.audio.init();
    this._updateHomeUI();
    this._startLaunchSequence();
    this._startEnergyRegen();
    this._bindGlobalEvents();
    window.addEventListener('resize', () => {
      if (this.ui.battle) this.ui.battle.renderer.resize();
    });
  }

  _startLaunchSequence() {
    let progress = 0;
    let bar = document.getElementById('launchProgress');
    let interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        setTimeout(() => {
          this.ui.showScreen('screen-home');
          this.audio.playSfx('click');
        }, 300);
      } else {
        if (bar) bar.style.width = progress + '%';
      }
    }, 150);
  }

  _updateHomeUI() {
    let data = this.playerData;
    let homeScreen = document.getElementById('screen-home');
    if (!homeScreen) return;
    let nameEl = homeScreen.querySelector('.player-name');
    let levelEl = homeScreen.querySelector('.player-level');
    if (nameEl) nameEl.textContent = data.name;
    if (levelEl) levelEl.textContent = 'Lv.' + data.level;
    let resources = homeScreen.querySelectorAll('.resource-bar span');
    if (resources[0]) resources[0].textContent = Utils.formatNumber(data.gold);
    if (resources[1]) resources[1].textContent = Utils.formatNumber(data.gems);
    if (resources[2]) resources[2].textContent = data.energy + '/' + data.energyMax;
  }

  _startEnergyRegen() {
    setInterval(() => {
      if (this.playerData.energy < this.playerData.energyMax) {
        let elapsed = (Date.now() - this.playerData.lastEnergyRefill) / 1000 / 60;
        let regen = Math.floor(elapsed / GameConfig.ECONOMY.energyRegenMinutes);
        if (regen > 0) {
          this.playerData.energy = Math.min(this.playerData.energyMax, this.playerData.energy + regen);
          this.playerData.lastEnergyRefill = Date.now();
          this._updateHomeUI();
          this.storage.savePlayerData(this.playerData);
        }
      }
    }, 60000);
  }

  _bindGlobalEvents() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.ui.battle) {
        this.ui.battle.paused = true;
      }
    });
  }

  saveProgress() {
    this.storage.savePlayerData(this.playerData);
  }

  addGold(amount) {
    this.playerData.gold += amount;
    this._updateHomeUI();
    this.saveProgress();
  }

  addGems(amount) {
    this.playerData.gems += amount;
    this._updateHomeUI();
    this.saveProgress();
  }

  spendGold(amount) {
    if (this.playerData.gold < amount) return false;
    this.playerData.gold -= amount;
    this._updateHomeUI();
    this.saveProgress();
    return true;
  }

  spendGems(amount) {
    if (this.playerData.gems < amount) return false;
    this.playerData.gems -= amount;
    this._updateHomeUI();
    this.saveProgress();
    return true;
  }

  addExp(amount) {
    this.playerData.exp += amount;
    let expNeeded = this.playerData.level * 100;
    while (this.playerData.exp >= expNeeded) {
      this.playerData.exp -= expNeeded;
      this.playerData.level++;
      expNeeded = this.playerData.level * 100;
      this.ui.showToast(`🎉 升级！Lv.${this.playerData.level}`);
    }
    this._updateHomeUI();
    this.saveProgress();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  let app = new App();
  window.gameApp = app;
  app.init();
});
