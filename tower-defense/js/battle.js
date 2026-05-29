window.Battle = class Battle {
  constructor(canvas, level, chapter) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.chapter = chapter || 0;
    this.level = level || 1;
    let theme = GameConfig.CHAPTERS[this.chapter] ? GameConfig.CHAPTERS[this.chapter].theme : 'forest';
    this.gameMap = new GameMap(theme, this.level);
    this.waveManager = new WaveManager(this.gameMap, this.level);
    this.skillSystem = new SkillSystem();
    this.rogueSystem = new RogueSystem();
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.gold = GameConfig.STARTING_GOLD;
    this.baseHp = GameConfig.BASE_HP;
    this.baseMaxHp = GameConfig.BASE_HP;
    this.state = 'DEPLOY';
    this.speed = 1;
    this.paused = false;
    this.selectedTowerType = null;
    this.selectedTower = null;
    this.hoverCell = null;
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.battleTime = 0;
    this.failCount = 0;
    this.adaptiveBuff = 0;
    this.areaEffects = [];
    this.waveStartDelay = 0;
    this.onStateChange = null;
    this.onGoldChange = null;
    this.onHpChange = null;
    this.onWaveChange = null;
    this.onRogueChoice = null;
    this.onBattleEnd = null;
    this._applyAdaptiveDifficulty();
  }

  _applyAdaptiveDifficulty() {
    if (this.failCount >= GameConfig.ADAPTIVE.failThreshold) {
      let stacks = Math.min(this.failCount - GameConfig.ADAPTIVE.failThreshold + 1, GameConfig.ADAPTIVE.maxBuffStacks);
      this.adaptiveBuff = stacks;
      this.baseHp = Math.floor(GameConfig.BASE_HP * (1 + stacks * GameConfig.ADAPTIVE.hpBuffPercent));
      this.baseMaxHp = this.baseHp;
      this.gold = Math.floor(GameConfig.STARTING_GOLD * (1 + stacks * GameConfig.ADAPTIVE.goldBuffPercent));
    }
  }

  start() {
    this.state = 'DEPLOY';
    this.waveStartDelay = 2;
    this._notifyStateChange();
  }

  startWave() {
    if (this.state !== 'DEPLOY') return;
    let info = this.waveManager.getWaveInfo();
    this.state = info.isBoss ? 'BOSS' : 'WAVE';
    this.waveManager.startNextWave();
    this._notifyStateChange();
    this._notifyWaveChange();
  }

  update(dt) {
    if (this.paused || this.state === 'RESULT') return;
    dt *= this.speed;
    this.battleTime += dt;

    this.skillSystem.update(dt);
    this.rogueSystem.update(dt);
    this.gameMap.update(dt);
    this.renderer.updateParticles(dt);

    for (let i = this.areaEffects.length - 1; i >= 0; i--) {
      this.areaEffects[i].duration -= dt;
      if (this.areaEffects[i].duration <= 0) this.areaEffects.splice(i, 1);
    }

    if (this.state === 'DEPLOY') {
      this.waveStartDelay -= dt;
      if (this.waveStartDelay <= 0) this.startWave();
      return;
    }

    if (this.state === 'ROGUE') {
      if (this.rogueSystem.update(dt)) {
        this._applyRogueBuff(this.rogueSystem.activeBuffs[this.rogueSystem.activeBuffs.length - 1]);
        this.state = 'DEPLOY';
        this.waveStartDelay = 1;
        this._notifyStateChange();
      }
      return;
    }

    if (this.state === 'WAVE' || this.state === 'BOSS') {
      let spawned = this.waveManager.update(dt);
      if (spawned) this.enemies.push(spawned);

      for (let enemy of this.enemies) {
        enemy.update(dt);
        if (enemy.reachedEnd) {
          let dmg = enemy.isBoss ? 20 : 5;
          this.baseHp -= dmg;
          this._notifyHpChange();
          if (this.baseHp <= 0) {
            this.baseHp = 0;
            this._notifyHpChange();
            if (this.onReviveNeeded) { this.onReviveNeeded(); } else { this._endBattle(false); }
            return;
          }
        }
        if (enemy.isBoss && enemy.shouldUseSkill()) {
          this._handleBossSkill(enemy);
        }
      }

      for (let tower of this.towers) {
        let attack = tower.update(dt, this.enemies);
        if (attack) {
          let targets = [attack.target];
          if (attack.pierceCount > 0) {
            let rangePx = tower.range * GameConfig.GRID_SIZE;
            for (let e of this.enemies) {
              if (e !== attack.target && !e.dead && !e.reachedEnd) {
                let dist = Utils.distance(tower.x, tower.y, e.x, e.y);
                if (dist <= rangePx) targets.push(e);
              }
            }
          }
          let proj = new Projectile(attack, targets);
          this.projectiles.push(proj);
        }
      }

      for (let proj of this.projectiles) {
        proj.update(dt);
        if (proj._healAmount) {
          this.baseHp = Math.min(this.baseMaxHp, this.baseHp + proj._healAmount);
          proj._healAmount = 0;
          this._notifyHpChange();
        }
        if (proj._lifeStealAmount) {
          this.baseHp = Math.min(this.baseMaxHp, this.baseHp + Math.floor(proj._lifeStealAmount));
          proj._lifeStealAmount = 0;
          this._notifyHpChange();
        }
        if (proj._chainData) {
          let cd = proj._chainData;
          let chainTargets = this.enemies.filter(e => !e.dead && !e.reachedEnd && !cd.hitEnemies.has(e.id) && Utils.distance(cd.source.x, cd.source.y, e.x, e.y) <= cd.range);
          chainTargets.sort((a, b) => Utils.distance(cd.source.x, cd.source.y, a.x, a.y) - Utils.distance(cd.source.x, cd.source.y, b.x, b.y));
          for (let i = 0; i < Math.min(cd.count, chainTargets.length); i++) {
            let ct = chainTargets[i];
            let actualDmg = ct.takeDamage(Math.floor(cd.damage));
            this.renderer.addDamageNumber(ct.x, ct.y - 20, actualDmg, false, '#FFD23F');
            this.renderer.addParticle(ct.x, ct.y, '#FFD23F', 3);
            cd.hitEnemies.add(ct.id);
            cd.damage *= proj.chainDamageFalloff;
          }
          proj._chainData = null;
        }
      }

      this.enemies = this.enemies.filter(e => {
        if (e.dead) {
          this.kills++;
          let reward = Math.floor(e.reward * this.rogueSystem.getGoldMultiplier());
          this.gold += reward;
          this.renderer.addParticle(e.x, e.y, e.color, 8);
          this.renderer.addDamageNumber(e.x, e.y - 30, '+' + reward, false, '#FFD23F');
          this._notifyGoldChange();
          if (e.splitOnDeath) {
            let waypoints = this.gameMap.getWaypoints().map(wp => Utils.gridToPixel(wp.col, wp.row));
            for (let s = 0; s < 2; s++) {
              let split = new Enemy('slime', waypoints, false);
              split.maxHp = Math.floor(e.maxHp * 0.3);
              split.hp = split.maxHp;
              split.x = e.x + (Math.random() - 0.5) * 20;
              split.y = e.y + (Math.random() - 0.5) * 20;
              split.waypointIndex = e.waypointIndex;
              split.reward = 3;
              this.enemies.push(split);
            }
          }
          return false;
        }
        if (e.reachedEnd) return false;
        return true;
      });

      this.projectiles = this.projectiles.filter(p => !p.dead);

      if (this.waveManager.isWaveComplete(this.enemies)) {
        let waveGold = Math.floor(GameConfig.GOLD_PER_WAVE * this.rogueSystem.getWaveGoldMultiplier());
        this.gold += waveGold;
        let hpRegen = this.rogueSystem.getHpRegen();
        if (hpRegen > 0) {
          this.baseHp = Math.min(this.baseMaxHp, this.baseHp + hpRegen);
        }
        this._notifyGoldChange();
        this._notifyHpChange();

        if (this.waveManager.allWavesComplete) {
          this._endBattle(true);
          return;
        }

        if (this.waveManager.shouldShowRogue()) {
          this.state = 'ROGUE';
          let choices = this.rogueSystem.generateChoices();
          if (this.onRogueChoice) this.onRogueChoice(choices);
          this._notifyStateChange();
        } else {
          this.state = 'DEPLOY';
          this.waveStartDelay = 2;
          this._notifyStateChange();
        }
      }
    }
  }

  placeTower(col, row, type) {
    if (!this.gameMap.canBuild(col, row)) return false;
    let cfg = GameConfig.TOWERS[type];
    if (this.gold < cfg.cost) return false;
    this.gold -= cfg.cost;
    let tower = new Tower(type, col, row);
    this.towers.push(tower);
    this.gameMap.placeTower(col, row, tower);
    this._applyAllRogueBuffsToTower(tower);
    this._notifyGoldChange();
    return true;
  }

  upgradeTower(tower) {
    let cost = tower.getUpgradeCost();
    if (this.gold < cost) return false;
    this.gold -= cost;
    tower.upgrade();
    this._applyAllRogueBuffsToTower(tower);
    this._notifyGoldChange();
    return true;
  }

  sellTower(tower) {
    let value = tower.getSellValue();
    this.gold += value;
    this.gameMap.removeTower(tower.col, tower.row);
    this.towers = this.towers.filter(t => t.id !== tower.id);
    this._notifyGoldChange();
    return value;
  }

  selectTowerBranch(tower, branchIndex) {
    return tower.selectBranch(branchIndex);
  }

  useSkill(skillKey, targetPos) {
    let result = this.skillSystem.use(skillKey, targetPos, this.enemies, this.baseHp, this.baseMaxHp);
    if (result) {
      if (result.areaEffect) this.areaEffects.push(result.areaEffect);
      if (result.healAmount) {
        this.baseHp = Math.min(this.baseMaxHp, this.baseHp + result.healAmount);
        this._notifyHpChange();
      }
      for (let hit of result.hits) {
        if (hit.damage) {
          this.renderer.addDamageNumber(hit.enemy.x, hit.enemy.y - 20, hit.damage, false, result.areaEffect ? result.areaEffect.color : '#FFFFFF');
          this.renderer.addParticle(hit.enemy.x, hit.enemy.y, result.areaEffect ? result.areaEffect.color : '#FFFFFF', 5);
        }
      }
    }
    return result;
  }

  _applyRogueBuff(buff) {
    for (let tower of this.towers) {
      if (buff.target === tower.type || buff.target === 'all') {
        tower.applyBuff(buff);
      }
    }
  }

  _applyAllRogueBuffsToTower(tower) {
    for (let buff of this.rogueSystem.getActiveBuffs()) {
      if (buff.target === tower.type || buff.target === 'all') {
        tower.applyBuff(buff);
      }
    }
  }

  _handleBossSkill(enemy) {
    if (enemy.skill === 'heal_aura') {
      for (let e of this.enemies) {
        if (!e.dead && Utils.distance(enemy.x, enemy.y, e.x, e.y) < GameConfig.GRID_SIZE * 3) {
          e.hp = Math.min(e.maxHp, e.hp + Math.floor(e.maxHp * 0.05));
        }
      }
      this.areaEffects.push({ x: enemy.x, y: enemy.y, radius: GameConfig.GRID_SIZE * 3, color: '#4ECB71', duration: 1 });
    } else if (enemy.skill === 'fire_rain') {
      for (let t of this.towers) {
        if (Math.random() < 0.3) {
          this.areaEffects.push({ x: t.x, y: t.y, radius: GameConfig.GRID_SIZE, color: '#FF8C42', duration: 0.8 });
        }
      }
    } else if (enemy.skill === 'freeze_all') {
      for (let t of this.towers) {
        t.attackTimer = Math.max(t.attackTimer, 2);
      }
      this.areaEffects.push({ x: 0, y: 0, radius: 999, color: '#4A7BF7', duration: 0.5 });
    } else if (enemy.skill === 'chain_lightning') {
      let targets = this.towers.filter(t => Utils.distance(enemy.x, enemy.y, t.x, t.y) < GameConfig.GRID_SIZE * 4);
      for (let t of targets.slice(0, 3)) {
        t.attackTimer += 1.5;
        this.renderer.addParticle(t.x, t.y, '#FFD23F', 5);
      }
    } else if (enemy.skill === 'shadow_summon') {
      let waypoints = this.gameMap.getWaypoints().map(wp => Utils.gridToPixel(wp.col, wp.row));
      for (let i = 0; i < 3; i++) {
        let summon = new Enemy('skeleton', waypoints, false);
        summon.x = enemy.x + (Math.random() - 0.5) * 30;
        summon.y = enemy.y + (Math.random() - 0.5) * 30;
        summon.waypointIndex = enemy.waypointIndex;
        this.enemies.push(summon);
      }
    }
  }

  _endBattle(victory) {
    this.state = 'RESULT';
    let stars = 0;
    if (victory) {
      let hpRatio = this.baseHp / this.baseMaxHp;
      stars = hpRatio >= 0.9 ? 3 : hpRatio >= 0.5 ? 2 : 1;
    }
    let result = {
      victory,
      stars,
      kills: this.kills,
      time: this.battleTime,
      hpRemaining: this.baseHp,
      hpMax: this.baseMaxHp,
      goldEarned: this.kills * 15 + this.waveManager.currentWave * 50,
      gemsEarned: victory ? 20 + stars * 10 : 5
    };
    if (this.onBattleEnd) this.onBattleEnd(result);
    this._notifyStateChange();
  }

  render() {
    this.renderer.clear();
    this.renderer.beginDraw();
    let ctx = this.renderer.ctx;

    this.gameMap.render(ctx);

    if (this.hoverCell && this.selectedTowerType) {
      this.renderer.renderBuildHighlight(ctx, this.hoverCell.col, this.hoverCell.row, this.gameMap.canBuild(this.hoverCell.col, this.hoverCell.row));
      let cfg = GameConfig.TOWERS[this.selectedTowerType];
      if (cfg) {
        let pos = Utils.gridToPixel(this.hoverCell.col, this.hoverCell.row);
        this.renderer.renderRangeCircle(ctx, pos.x, pos.y, cfg.range * GameConfig.GRID_SIZE, cfg.color);
      }
    }

    if (this.selectedTower) {
      this.renderer.renderRangeCircle(ctx, this.selectedTower.x, this.selectedTower.y, this.selectedTower.range * GameConfig.GRID_SIZE, this.selectedTower.color);
    }

    for (let tower of this.towers) tower.render(ctx);
    for (let enemy of this.enemies) enemy.render(ctx);
    for (let proj of this.projectiles) proj.render(ctx);

    for (let ae of this.areaEffects) {
      ctx.fillStyle = ae.color;
      ctx.globalAlpha = 0.2 * (ae.duration / 0.5);
      ctx.beginPath();
      ctx.arc(ae.x, ae.y, ae.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    this.renderer.renderParticles(ctx);
    this.renderer.endDraw();
  }

  handleTouch(gameX, gameY) {
    let grid = Utils.pixelToGrid(gameX, gameY);
    if (this.selectedTowerType) {
      if (this.placeTower(grid.col, grid.row, this.selectedTowerType)) {
        this.selectedTowerType = null;
        this.hoverCell = null;
      }
      return;
    }
    let tower = this.gameMap.getTowerAt(grid.col, grid.row);
    this.selectedTower = tower;
  }

  handleHover(gameX, gameY) {
    this.hoverCell = Utils.pixelToGrid(gameX, gameY);
  }

  _notifyStateChange() { if (this.onStateChange) this.onStateChange(this.state); }
  _notifyGoldChange() { if (this.onGoldChange) this.onGoldChange(this.gold); }
  _notifyHpChange() { if (this.onHpChange) this.onHpChange(this.baseHp, this.baseMaxHp); }
  _notifyWaveChange() { if (this.onWaveChange) this.onWaveChange(this.waveManager.getWaveInfo()); }
};
