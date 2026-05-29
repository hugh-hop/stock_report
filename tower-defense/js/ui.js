window.UIManager = class UIManager {
  constructor() {
    this.currentScreen = 'screen-launch';
    this.currentTab = 'home';
    this.battle = null;
    this.animFrame = null;
    this.lastTime = 0;
    this.touchStartPos = null;
    this._bindEvents();
  }

  _bindEvents() {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    document.querySelectorAll('[data-action="back"]').forEach(btn => {
      btn.addEventListener('click', () => this.goBack());
    });
    document.querySelectorAll('.function-item').forEach(item => {
      item.addEventListener('click', () => this.handleFunctionAction(item.dataset.action));
    });
    document.querySelectorAll('.tower-select-item').forEach(item => {
      item.addEventListener('click', () => this.selectTowerType(item.dataset.tower));
    });
    document.querySelectorAll('[data-action="pause"]').forEach(btn => {
      btn.addEventListener('click', () => this.togglePause());
    });
    document.querySelectorAll('[data-action="resume"]').forEach(btn => {
      btn.addEventListener('click', () => this.togglePause());
    });
    document.querySelectorAll('[data-action="restart"]').forEach(btn => {
      btn.addEventListener('click', () => this.restartBattle());
    });
    document.querySelectorAll('[data-action="quit"]').forEach(btn => {
      btn.addEventListener('click', () => this.quitBattle());
    });
    document.querySelectorAll('[data-action="tower-upgrade"]').forEach(btn => {
      btn.addEventListener('click', () => this.upgradeSelectedTower());
    });
    document.querySelectorAll('[data-action="tower-sell"]').forEach(btn => {
      btn.addEventListener('click', () => this.sellSelectedTower());
    });
    document.querySelectorAll('[data-action="tower-skill"]').forEach(btn => {
      btn.addEventListener('click', () => this.useSelectedTowerSkill());
    });
    document.querySelectorAll('.skill-btn').forEach(btn => {
      btn.addEventListener('click', () => this.useSkill(btn.dataset.skill));
    });
    document.querySelectorAll('[data-action="home"]').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('screen-home'));
    });
    document.querySelectorAll('[data-action="next-level"]').forEach(btn => {
      btn.addEventListener('click', () => this.nextLevel());
    });
    document.querySelectorAll('.level-node').forEach(node => {
      node.addEventListener('click', () => this.selectLevel(node));
    });
    document.querySelectorAll('.battle-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleSpeed());
    });
    document.querySelectorAll('.pvp-match-btn').forEach(btn => {
      btn.addEventListener('click', () => this.startPVPMatch());
    });
    document.querySelectorAll('.shop-item').forEach(item => {
      item.addEventListener('click', () => this.showShopConfirm(item));
    });
    document.querySelectorAll('[data-action="revive-ad"]').forEach(btn => {
      btn.addEventListener('click', () => this.reviveByAd());
    });
    document.querySelectorAll('[data-action="revive-share"]').forEach(btn => {
      btn.addEventListener('click', () => this.reviveByShare());
    });
    document.querySelectorAll('[data-action="revive-gem"]').forEach(btn => {
      btn.addEventListener('click', () => this.reviveByGem());
    });
    document.querySelectorAll('[data-action="give-up"]').forEach(btn => {
      btn.addEventListener('click', () => this.giveUp());
    });
    document.querySelectorAll('[data-action="cancel"]').forEach(btn => {
      btn.addEventListener('click', () => this.hideDialog());
    });
    document.querySelectorAll('[data-action="confirm"]').forEach(btn => {
      btn.addEventListener('click', () => this.confirmPurchase());
    });
    document.querySelectorAll('.nav-arrow').forEach(btn => {
      btn.addEventListener('click', () => this.navigateChapter(btn.dataset.action));
    });
    let canvas = document.getElementById('gameCanvas');
    if (canvas) {
      canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
      canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: false });
      canvas.addEventListener('touchend', (e) => { if (this.touchStartPos) { let touch = e.changedTouches[0]; this.handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY }); this.touchStartPos = null; } }, { passive: false });
    }
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    let screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    this.currentScreen = screenId;
    let tabBar = document.getElementById('mainTabBar');
    if (screenId === 'screen-battle' || screenId === 'screen-rogue') {
      tabBar.style.display = 'none';
    } else {
      tabBar.style.display = 'flex';
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab-item[data-tab="${tab}"]`)?.classList.add('active');
    let screenMap = { home: 'screen-home', battle: 'screen-level-select', shop: 'screen-shop', upgrade: 'screen-upgrade', social: 'screen-social' };
    this.showScreen(screenMap[tab] || 'screen-home');
  }

  goBack() {
    if (this.currentScreen === 'screen-level-select') this.showScreen('screen-home');
    else if (this.currentScreen === 'screen-settings') this.showScreen('screen-home');
    else this.showScreen('screen-home');
  }

  handleFunctionAction(action) {
    switch (action) {
      case 'campaign': this.showScreen('screen-level-select'); break;
      case 'pvp': this.showScreen('screen-pvp'); break;
      case 'challenge': this.startChallenge(); break;
      case 'daily': this.showToast('📋 每日任务已刷新'); break;
      case 'checkin': this.showToast('📅 签到成功！+50💎'); break;
      case 'duel': this.showScreen('screen-social'); break;
    }
  }

  selectTowerType(type) {
    if (!this.battle) return;
    let cfg = GameConfig.TOWERS[type];
    if (this.battle.gold < cfg.cost) {
      this.showToast('💰 金币不足！');
      return;
    }
    this.battle.selectedTowerType = type;
    this.battle.selectedTower = null;
    document.querySelectorAll('.tower-select-item').forEach(i => i.classList.remove('selected'));
    document.querySelector(`.tower-select-item[data-tower="${type}"]`)?.classList.add('selected');
    this.hideTowerActionPanel();
  }

  handleCanvasClick(e) {
    if (!this.battle) return;
    let canvas = document.getElementById('gameCanvas');
    let rect = canvas.getBoundingClientRect();
    let sx = e.clientX - rect.left;
    let sy = e.clientY - rect.top;
    let gamePos = this.battle.renderer.screenToGame(sx, sy);
    this.battle.handleTouch(gamePos.x, gamePos.y);
    if (this.battle.selectedTower) {
      this.showTowerActionPanel(this.battle.selectedTower);
    } else {
      this.hideTowerActionPanel();
    }
  }

  handleCanvasHover(e) {
    if (!this.battle) return;
    let canvas = document.getElementById('gameCanvas');
    let rect = canvas.getBoundingClientRect();
    let sx = e.clientX - rect.left;
    let sy = e.clientY - rect.top;
    let gamePos = this.battle.renderer.screenToGame(sx, sy);
    this.battle.handleHover(gamePos.x, gamePos.y);
  }

  showTowerActionPanel(tower) {
    let panel = document.getElementById('towerActionPanel');
    panel.classList.add('active');
    panel.dataset.towerId = tower.id;
    let upgradeBtn = panel.querySelector('[data-action="tower-upgrade"]');
    if (tower.level >= tower.maxLevel) {
      upgradeBtn.classList.add('disabled');
      upgradeBtn.querySelector('span:last-child').textContent = '已满级';
    } else {
      upgradeBtn.classList.remove('disabled');
      upgradeBtn.querySelector('span:last-child').textContent = `升级(${tower.getUpgradeCost()}🪙)`;
    }
  }

  hideTowerActionPanel() {
    document.getElementById('towerActionPanel')?.classList.remove('active');
  }

  upgradeSelectedTower() {
    if (!this.battle || !this.battle.selectedTower) return;
    if (this.battle.upgradeTower(this.battle.selectedTower)) {
      this.showToast('⬆️ 升级成功！');
      this.showTowerActionPanel(this.battle.selectedTower);
    } else {
      this.showToast('💰 金币不足！');
    }
  }

  sellSelectedTower() {
    if (!this.battle || !this.battle.selectedTower) return;
    let value = this.battle.sellTower(this.battle.selectedTower);
    this.showToast(`💰 出售获得 ${value} 金币`);
    this.battle.selectedTower = null;
    this.hideTowerActionPanel();
  }

  useSelectedTowerSkill() {
    this.showToast('✨ 技能开发中...');
  }

  useSkill(skillKey) {
    if (!this.battle) return;
    if (skillKey === 'meteor' || skillKey === 'freeze') {
      this.showToast(`🎯 点击地图选择${GameConfig.SKILLS[skillKey].name}目标`);
      this._pendingSkill = skillKey;
      let canvas = document.getElementById('gameCanvas');
      let handler = (e) => {
        let rect = canvas.getBoundingClientRect();
        let sx = (e.clientX || e.changedTouches?.[0]?.clientX) - rect.left;
        let sy = (e.clientY || e.changedTouches?.[0]?.clientY) - rect.top;
        let gamePos = this.battle.renderer.screenToGame(sx, sy);
        let result = this.battle.useSkill(this._pendingSkill, gamePos);
        if (result) this.showToast(`✨ ${GameConfig.SKILLS[this._pendingSkill].name}！`);
        else this.showToast('⏳ 技能冷却中');
        canvas.removeEventListener('click', handler);
        this._pendingSkill = null;
      };
      canvas.addEventListener('click', handler, { once: true });
    } else if (skillKey === 'heal') {
      let result = this.battle.useSkill('heal', { x: 0, y: 0 });
      if (result) this.showToast(`💚 恢复 ${result.healAmount} HP！`);
      else this.showToast('⏳ 技能冷却中');
    }
  }

  togglePause() {
    if (!this.battle) return;
    this.battle.paused = !this.battle.paused;
    document.getElementById('dialog-pause')?.classList.toggle('active', this.battle.paused);
  }

  toggleSpeed() {
    if (!this.battle) return;
    this.battle.speed = this.battle.speed === 1 ? 2 : 1;
    document.querySelectorAll('.battle-speed-btn').forEach(b => b.textContent = this.battle.speed + 'x');
  }

  restartBattle() {
    this.hideDialog();
    if (this.battle) {
      this.battle.failCount++;
      this.startBattle(this.battle.level, this.battle.chapter);
    }
  }

  quitBattle() {
    this.hideDialog();
    this.stopBattleLoop();
    this.showScreen('screen-home');
  }

  selectLevel(node) {
    if (node.classList.contains('locked')) {
      this.showToast('🔒 关卡未解锁');
      return;
    }
    if (node.classList.contains('boss')) {
      this.startBattle(9, 0);
      return;
    }
    let num = parseInt(node.querySelector('.node-num')?.textContent);
    if (isNaN(num)) return;
    this.startBattle(num, 0);
  }

  startBattle(level, chapter) {
    let canvas = document.getElementById('gameCanvas');
    this.battle = new Battle(canvas, level, chapter);
    this.battle.onStateChange = (state) => this._onBattleStateChange(state);
    this.battle.onGoldChange = (gold) => this._updateBattleGold(gold);
    this.battle.onHpChange = (hp, max) => this._updateBattleHp(hp, max);
    this.battle.onWaveChange = (info) => this._updateBattleWave(info);
    this.battle.onRogueChoice = (choices) => this._showRogueChoices(choices);
    this.battle.onBattleEnd = (result) => this._onBattleEnd(result);
    this.battle.onReviveNeeded = () => this._showReviveDialog();
    this.showScreen('screen-battle');
    this.battle.renderer.resize();
    this.battle.start();
    this._updateBattleGold(this.battle.gold);
    this._updateBattleHp(this.battle.baseHp, this.battle.baseMaxHp);
    this._updateBattleWave(this.battle.waveManager.getWaveInfo());
    this.startBattleLoop();
  }

  startBattleLoop() {
    this.stopBattleLoop();
    this.lastTime = performance.now();
    let loop = (time) => {
      let dt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      dt = Math.min(dt, 0.05);
      if (this.battle) {
        this.battle.update(dt);
        this.battle.render();
        this._updateSkillCooldowns();
        this._updateTowerSelectAfford();
      }
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  }

  stopBattleLoop() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  _onBattleStateChange(state) {
    if (state === 'ROGUE') {
      this.showScreen('screen-rogue');
    } else if (state === 'RESULT') {
      // handled by _onBattleEnd
    }
  }

  _updateBattleGold(gold) {
    let goldEl = document.querySelector('.battle-gold');
    if (!goldEl) {
      let topBar = document.querySelector('.battle-top-bar');
      if (topBar) {
        goldEl = document.createElement('div');
        goldEl.className = 'battle-gold';
        goldEl.style.cssText = 'background:rgba(255,215,0,0.15);color:#FFD700;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;';
        topBar.querySelector('.battle-info')?.appendChild(goldEl);
      }
    }
    if (goldEl) goldEl.textContent = '🪙 ' + gold;
  }

  _showReviveDialog() {
    this.stopBattleLoop();
    document.getElementById('dialog-revive')?.classList.add('active');
  }

  _updateBattleHp(hp, max) {
    let fill = document.querySelector('.hp-fill');
    let text = document.querySelector('.hp-text');
    if (fill) fill.style.width = (hp / max * 100) + '%';
    if (text) text.textContent = hp;
  }

  _updateBattleWave(info) {
    let waveEl = document.querySelector('.battle-wave');
    if (waveEl) waveEl.textContent = `波次 ${info.current}/${info.total}`;
  }

  _updateTowerSelectAfford() {
    if (!this.battle) return;
    document.querySelectorAll('.tower-select-item').forEach(item => {
      let type = item.dataset.tower;
      let cfg = GameConfig.TOWERS[type];
      if (cfg) {
        if (this.battle.gold < cfg.cost) {
          item.style.opacity = '0.5';
        } else {
          item.style.opacity = '1';
        }
      }
    });
  }

  _updateSkillCooldowns() {
    if (!this.battle) return;
    document.querySelectorAll('.skill-btn').forEach(btn => {
      let key = btn.dataset.skill;
      let info = this.battle.skillSystem.getCooldownInfo(key);
      if (info) {
        let cdEl = btn.querySelector('.skill-cd');
        if (info.ready) {
          btn.classList.add('ready');
          if (cdEl) cdEl.style.display = 'none';
        } else {
          btn.classList.remove('ready');
          if (cdEl) {
            cdEl.style.display = 'block';
            cdEl.textContent = Math.ceil(info.current);
          }
        }
      }
    });
  }

  _showRogueChoices(choices) {
    let container = document.querySelector('.rogue-cards');
    if (!container) return;
    container.innerHTML = '';
    choices.forEach((buff, i) => {
      let rarityClass = `rarity-border-${buff.rarity}`;
      let card = document.createElement('div');
      card.className = `rogue-card ${rarityClass}`;
      let iconSvg = window.Icons ? Icons.get(buff.icon, 40, buff.color) : buff.icon;
      card.innerHTML = `
        <div class="card-rarity" style="background:${buff.color}"></div>
        <div class="card-icon" style="background:${buff.color}20">${iconSvg}</div>
        <div class="card-name">${buff.name}</div>
        <div class="card-desc">${buff.desc}</div>
      `;
      card.addEventListener('click', () => this._selectRogueBuff(i));
      container.appendChild(card);
    });
    this.showScreen('screen-rogue');
    this._rogueCountdownInterval = setInterval(() => {
      let el = document.getElementById('rogueCountdown');
      if (el) el.textContent = Math.ceil(this.battle.rogueSystem.countdown);
      if (this.battle.rogueSystem.countdown <= 0) clearInterval(this._rogueCountdownInterval);
    }, 100);
  }

  _selectRogueBuff(index) {
    if (!this.battle) return;
    let buff = this.battle.rogueSystem.selectChoice(index);
    if (buff) {
      this.showToast(`✨ 获得: ${buff.name}`);
      clearInterval(this._rogueCountdownInterval);
      this.showScreen('screen-battle');
    }
  }

  _onBattleEnd(result) {
    this.stopBattleLoop();
    setTimeout(() => {
      this._showResult(result);
    }, 500);
  }

  _showResult(result) {
    let screen = document.getElementById('screen-result');
    let badge = screen.querySelector('.result-badge');
    let title = screen.querySelector('.result-title');
    badge.className = `result-badge ${result.victory ? 'victory' : 'defeat'}`;
    badge.innerHTML = result.victory ? (window.Icons ? Icons.get('trophy', 48, '#FFD700') : '🏆') : (window.Icons ? Icons.get('close', 48, '#FF4757') : '💀');
    title.className = `result-title ${result.victory ? 'victory' : 'defeat'}`;
    title.textContent = result.victory ? '胜利!' : '失败...';
    let stars = screen.querySelectorAll('.star');
    stars.forEach((s, i) => {
      s.className = i < result.stars ? 'star filled' : 'star';
      s.innerHTML = i < result.stars ? (window.Icons ? Icons.get('star', 28, '#FFD700') : '⭐') : (window.Icons ? Icons.get('starEmpty', 28, '#5A6380') : '☆');
    });
    let rewards = screen.querySelectorAll('.reward-amount');
    if (rewards[0]) rewards[0].textContent = '+' + result.goldEarned;
    if (rewards[1]) rewards[1].textContent = '+' + result.gemsEarned;
    let stats = screen.querySelectorAll('.stat-value');
    if (stats[0]) stats[0].textContent = result.kills;
    if (stats[1]) stats[1].textContent = Utils.formatTime(result.time);
    if (stats[2]) stats[2].textContent = Math.floor(result.hpRemaining / result.hpMax * 100) + '%';
    this.showScreen('screen-result');
  }

  nextLevel() {
    if (!this.battle) return;
    let nextLevel = this.battle.level + 1;
    let nextChapter = this.battle.chapter;
    if (nextLevel > 9) { nextLevel = 1; nextChapter++; }
    this.startBattle(nextLevel, nextChapter);
  }

  startChallenge() {
    this.showToast('🔥 挑战模式开发中...');
  }

  startPVPMatch() {
    this.showToast('🔍 匹配中...');
    setTimeout(() => this.showToast('🎮 PVP模式开发中...'), 2000);
  }

  showShopConfirm(item) {
    let dialog = document.getElementById('dialog-shop-confirm');
    dialog.classList.add('active');
  }

  hideDialog() {
    document.querySelectorAll('.dialog-overlay').forEach(d => d.classList.remove('active'));
  }

  confirmPurchase() {
    this.hideDialog();
    this.showToast('✅ 购买成功！');
  }

  reviveByAd() {
    this.hideDialog();
    if (this.battle) {
      this.battle.baseHp = Math.floor(this.battle.baseMaxHp * 0.5);
      this.battle.state = 'DEPLOY';
      this.battle.waveStartDelay = 3;
      this.showScreen('screen-battle');
      this.startBattleLoop();
      this.showToast('📺 观看广告，基地恢复50%HP');
    }
  }

  reviveByShare() {
    this.hideDialog();
    if (this.battle) {
      this.battle.baseHp = Math.floor(this.battle.baseMaxHp * 0.5);
      this.battle.state = 'DEPLOY';
      this.battle.waveStartDelay = 3;
      this.showScreen('screen-battle');
      this.startBattleLoop();
      this.showToast('📤 分享成功，基地恢复50%HP');
    }
  }

  reviveByGem() {
    this.hideDialog();
    if (this.battle) {
      this.battle.baseHp = Math.floor(this.battle.baseMaxHp * 0.5);
      this.battle.state = 'DEPLOY';
      this.battle.waveStartDelay = 3;
      this.showScreen('screen-battle');
      this.startBattleLoop();
      this.showToast('💎 消耗50宝石，基地恢复50%HP');
    }
  }

  giveUp() {
    this.hideDialog();
    this.stopBattleLoop();
    this.showScreen('screen-home');
  }

  navigateChapter(action) {
    if (action === 'prev-chapter') this.showToast('‹ 上一章');
    else if (action === 'next-chapter') this.showToast('› 下一章');
  }

  showToast(msg) {
    let container = document.getElementById('toast-container');
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};
