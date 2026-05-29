window.Tower = class Tower {
  constructor(type, col, row) {
    let cfg = GameConfig.TOWERS[type];
    this.id = Utils.createId();
    this.type = type;
    this.col = col;
    this.row = row;
    this.level = 1;
    this.maxLevel = 3;
    this.branch = null;
    this.name = cfg.name;
    this.icon = cfg.icon;
    this.element = cfg.element;
    this.color = cfg.color;
    this.baseDamage = cfg.damage;
    this.damage = cfg.damage;
    this.baseAttackSpeed = cfg.attackSpeed;
    this.attackSpeed = cfg.attackSpeed;
    this.baseRange = cfg.range;
    this.range = cfg.range;
    this.critRate = cfg.critRate || 0;
    this.splashRadius = cfg.splashRadius || 0;
    this.slowRate = cfg.slowRate || 0;
    this.slowDuration = cfg.slowDuration || 0;
    this.chainCount = cfg.chainCount || 0;
    this.chainDamageFalloff = cfg.chainDamageFalloff || 0;
    this.poisonDps = cfg.poisonDps || 0;
    this.poisonDuration = cfg.poisonDuration || 0;
    this.healPerHit = cfg.healPerHit || 0;
    this.lifeSteal = cfg.lifeSteal || 0;
    this.armor = cfg.armor || 0;
    this.cost = cfg.cost;
    this.totalInvested = cfg.cost;
    this.attackTimer = 0;
    this.target = null;
    this.angle = 0;
    this.buffs = [];
    this.skillCooldown = 0;
    this.x = col * GameConfig.GRID_SIZE + GameConfig.GRID_SIZE / 2;
    this.y = row * GameConfig.GRID_SIZE + GameConfig.GRID_SIZE / 2;
    this._iconImage = null;
    this._iconLoaded = false;
  }

  _loadIcon() {
    if (this._iconLoaded) return;
    this._iconLoaded = true;
    if (window.Icons) {
      this._iconImage = Icons.createImage(this.icon, Math.floor(GameConfig.GRID_SIZE * 0.5), this.color);
    }
  }

  getUpgradeCost() {
    if (this.level >= this.maxLevel) return Infinity;
    let mult = this.level === 1 ? GameConfig.TOWER_UPGRADE.level2Cost : GameConfig.TOWER_UPGRADE.level3Cost;
    return Math.floor(this.cost * mult);
  }

  getSellValue() {
    return Math.floor(this.totalInvested * GameConfig.TOWER_UPGRADE.sellRefund);
  }

  upgrade() {
    if (this.level >= this.maxLevel) return false;
    let cost = this.getUpgradeCost();
    this.level++;
    this.totalInvested += cost;
    let dmgMult = GameConfig.TOWER_UPGRADE.damagePerLevel;
    let spdMult = GameConfig.TOWER_UPGRADE.speedPerLevel;
    let rngMult = GameConfig.TOWER_UPGRADE.rangePerLevel;
    this.damage = Math.floor(this.baseDamage * Math.pow(dmgMult, this.level - 1));
    this.attackSpeed = this.baseAttackSpeed * Math.pow(spdMult, this.level - 1);
    this.range = this.baseRange * Math.pow(rngMult, this.level - 1);
    this._applyBuffs();
    return true;
  }

  selectBranch(branchIndex) {
    if (this.branch !== null) return false;
    this.branch = branchIndex;
    let branchData = GameConfig.TOWERS[this.type].branches[branchIndex];
    let bonus = branchData.bonus;
    if (bonus.pierce) this.pierceCount = bonus.pierce;
    if (bonus.splashRadiusMult) this.splashRadius *= bonus.splashRadiusMult;
    if (bonus.burnDps) { this.burnDps = bonus.burnDps; this.burnDuration = bonus.burnDuration; }
    if (bonus.slowRateAdd) this.slowRate += bonus.slowRateAdd;
    if (bonus.freezeChance) { this.freezeChance = bonus.freezeChance; this.freezeDuration = bonus.freezeDuration; }
    if (bonus.chainCountAdd) this.chainCount += bonus.chainCountAdd;
    if (bonus.stunChance) { this.stunChance = bonus.stunChance; this.stunDuration = bonus.stunDuration; }
    if (bonus.poisonSpread) this.poisonSpread = true;
    if (bonus.armorReduce) this.armorReduce = bonus.armorReduce;
    if (bonus.damageReduction) this.damageReduction = bonus.damageReduction;
    if (bonus.darkBonus) this.darkBonus = bonus.darkBonus;
    if (bonus.damageMult && bonus.attackSpeedMult) { this.damage = Math.floor(this.damage * bonus.damageMult); this.attackSpeed *= bonus.attackSpeedMult; }
    else if (bonus.damageMult) this.damage = Math.floor(this.damage * bonus.damageMult);
    else if (bonus.attackSpeedMult) this.attackSpeed *= bonus.attackSpeedMult;
    if (bonus.killHealPercent) this.killHealPercent = bonus.killHealPercent;
    if (bonus.doubleDamageChance) this.doubleDamageChance = bonus.doubleDamageChance;
    return true;
  }

  applyBuff(buff) {
    this.buffs.push(buff);
    this._applyBuffs();
  }

  _applyBuffs() {
    let dmgMult = 1, spdMult = 1, rngMult = 1, critAdd = 0;
    for (let b of this.buffs) {
      if (b.target === this.type || b.target === 'all') {
        if (b.stat === 'damage') dmgMult += b.value;
        if (b.stat === 'attackSpeed') spdMult += b.value;
        if (b.stat === 'range') rngMult += b.value;
        if (b.stat === 'critRate') critAdd += b.value;
        if (b.stat === 'slowRate') this.slowRate += b.value;
        if (b.stat === 'chainCount') this.chainCount += b.value;
        if (b.stat === 'poisonDps') this.poisonDps *= (1 + b.value);
        if (b.stat === 'healPerHit') this.healPerHit *= (1 + b.value);
        if (b.stat === 'lifeSteal') this.lifeSteal += b.value;
      }
    }
    let baseDmg = Math.floor(this.baseDamage * Math.pow(GameConfig.TOWER_UPGRADE.damagePerLevel, this.level - 1));
    this.damage = Math.floor(baseDmg * dmgMult);
    this.attackSpeed = this.baseAttackSpeed * Math.pow(GameConfig.TOWER_UPGRADE.speedPerLevel, this.level - 1) * spdMult;
    this.range = this.baseRange * Math.pow(GameConfig.TOWER_UPGRADE.rangePerLevel, this.level - 1) * rngMult;
    this.critRate = (GameConfig.TOWERS[this.type].critRate || 0) + critAdd;
  }

  findTarget(enemies) {
    let rangePx = this.range * GameConfig.GRID_SIZE;
    let closest = null, closestDist = Infinity;
    for (let e of enemies) {
      if (e.dead || e.reachedEnd) continue;
      let dist = Utils.distance(this.x, this.y, e.x, e.y);
      if (dist <= rangePx && dist < closestDist) {
        closest = e;
        closestDist = dist;
      }
    }
    this.target = closest;
    return closest;
  }

  update(dt, enemies) {
    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      let target = this.findTarget(enemies);
      if (target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.attackTimer = 1 / this.attackSpeed;
        return this._createAttack(target);
      }
    }
    return null;
  }

  _createAttack(target) {
    let isCrit = Math.random() < this.critRate;
    let dmg = isCrit ? Math.floor(this.damage * 1.5) : this.damage;
    return {
      type: this.type,
      damage: dmg,
      isCrit: isCrit,
      target: target,
      origin: { x: this.x, y: this.y },
      splashRadius: this.splashRadius * GameConfig.GRID_SIZE,
      slowRate: this.slowRate,
      slowDuration: this.slowDuration,
      chainCount: this.chainCount,
      chainDamageFalloff: this.chainDamageFalloff,
      poisonDps: this.poisonDps,
      poisonDuration: this.poisonDuration,
      healPerHit: this.healPerHit,
      lifeSteal: this.lifeSteal,
      pierceCount: this.pierceCount || 0,
      freezeChance: this.freezeChance || 0,
      freezeDuration: this.freezeDuration || 0,
      stunChance: this.stunChance || 0,
      stunDuration: this.stunDuration || 0,
      burnDps: this.burnDps || 0,
      burnDuration: this.burnDuration || 0,
      element: this.element,
      color: this.color
    };
  }

  render(ctx) {
    let G = GameConfig.GRID_SIZE;
    let x = this.x, y = this.y;
    let r = G * 0.4;

    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    if (this.level > 1) {
      ctx.fillStyle = '#FFD23F';
      for (let i = 0; i < this.level - 1; i++) {
        ctx.beginPath();
        ctx.arc(x - (this.level - 2) * 4 + i * 8, y + r + 6, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.branch !== null) {
      ctx.fillStyle = this.branch === 0 ? '#4A7BF7' : '#FF8C42';
      ctx.beginPath();
      ctx.arc(x + r + 4, y - r - 4, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    this._loadIcon();
    if (this._iconImage && this._iconImage.complete && this._iconImage.naturalWidth > 0) {
      let iconSize = G * 0.5;
      ctx.drawImage(this._iconImage, x - iconSize/2, y - iconSize/2, iconSize, iconSize);
    } else {
      ctx.fillStyle = '#E8ECF4';
      ctx.font = `bold ${G * 0.35}px Rajdhani, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.name.charAt(0), x, y);
    }

    if (this.target) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(this.angle) * (r + 8), y + Math.sin(this.angle) * (r + 8));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
};
