window.WaveManager = class WaveManager {
  constructor(gameMap, difficulty) {
    this.map = gameMap;
    this.difficulty = difficulty;
    this.currentWave = 0;
    this.maxWaves = GameConfig.MAX_WAVES;
    this.spawnTimer = 0;
    this.spawnInterval = 0.8;
    this.spawnQueue = [];
    this.waveActive = false;
    this.allWavesComplete = false;
    this.bossWave = false;
    this.waveTemplates = this._buildWaveList();
  }

  _buildWaveList() {
    let waves = [];
    let diff = this.difficulty;
    for (let i = 0; i < this.maxWaves; i++) {
      let template;
      if (i < 3) template = GameConfig.WAVE_TEMPLATES.easy;
      else if (i < 6) template = GameConfig.WAVE_TEMPLATES.medium;
      else template = GameConfig.WAVE_TEMPLATES.hard;
      let templateIndex = i % template.length;
      let waveData = template[templateIndex];
      let enemies = [];
      for (let j = 0; j < waveData.length; j += 2) {
        let count = waveData[j];
        let type = waveData[j + 1];
        for (let k = 0; k < count; k++) {
          enemies.push(type);
        }
      }
      let hpScale = 1 + (diff - 1) * 0.15 + i * 0.1;
      waves.push({ enemies, hpScale, isBoss: false });
    }
    let chapterIndex = Math.floor((diff - 1) / 9);
    let bossTypes = ['forestGuardian', 'flameLord', 'iceWitch', 'thunderTitan', 'shadowKing'];
    let bossType = bossTypes[Math.min(chapterIndex, bossTypes.length - 1)];
    waves.push({ enemies: [], hpScale: 1, isBoss: true, bossType });
    return waves;
  }

  startNextWave() {
    if (this.currentWave >= this.waveTemplates.length) {
      this.allWavesComplete = true;
      return false;
    }
    let wave = this.waveTemplates[this.currentWave];
    this.spawnQueue = [];
    if (wave.isBoss) {
      this.bossWave = true;
      this.spawnQueue.push({ type: wave.bossType, isBoss: true, hpScale: wave.hpScale });
    } else {
      for (let type of wave.enemies) {
        this.spawnQueue.push({ type, isBoss: false, hpScale: wave.hpScale });
      }
    }
    this.spawnTimer = 0;
    this.waveActive = true;
    this.currentWave++;
    return true;
  }

  update(dt) {
    if (!this.waveActive || this.spawnQueue.length === 0) return null;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      let spawnData = this.spawnQueue.shift();
      this.spawnTimer = spawnData.isBoss ? 0.5 : this.spawnInterval;
      let enemy = this._createEnemy(spawnData);
      if (this.spawnQueue.length === 0) {
        this.waveActive = false;
      }
      return enemy;
    }
    return null;
  }

  _createEnemy(spawnData) {
    let waypoints = this.map.getWaypoints().map(wp => Utils.gridToPixel(wp.col, wp.row));
    let enemy = new Enemy(spawnData.type, waypoints, spawnData.isBoss);
    enemy.maxHp = Math.floor(enemy.maxHp * spawnData.hpScale);
    enemy.hp = enemy.maxHp;
    if (enemy.shieldMaxHp > 0) {
      enemy.shieldHp = Math.floor(enemy.shieldMaxHp * spawnData.hpScale);
      enemy.shieldMaxHp = enemy.shieldHp;
    }
    return enemy;
  }

  isWaveComplete(enemies) {
    return !this.waveActive && this.spawnQueue.length === 0 && enemies.every(e => e.dead || e.reachedEnd);
  }

  shouldShowRogue() {
    return this.currentWave > 0 && this.currentWave % GameConfig.ROGUE_INTERVAL === 0 && this.currentWave < this.maxWaves;
  }

  getWaveInfo() {
    return { current: this.currentWave, total: this.waveTemplates.length, isBoss: this.bossWave };
  }
};
