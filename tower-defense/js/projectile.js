window.Projectile = class Projectile {
  constructor(attack, targets) {
    this.origin = { ...attack.origin };
    this.targets = targets || [attack.target];
    this.currentTarget = this.targets[0];
    this.targetIndex = 0;
    this.x = this.origin.x;
    this.y = this.origin.y;
    this.speed = 400;
    this.damage = attack.damage;
    this.isCrit = attack.isCrit;
    this.splashRadius = attack.splashRadius || 0;
    this.slowRate = attack.slowRate || 0;
    this.slowDuration = attack.slowDuration || 0;
    this.chainCount = attack.chainCount || 0;
    this.chainDamageFalloff = attack.chainDamageFalloff || 0.7;
    this.poisonDps = attack.poisonDps || 0;
    this.poisonDuration = attack.poisonDuration || 0;
    this.healPerHit = attack.healPerHit || 0;
    this.lifeSteal = attack.lifeSteal || 0;
    this.pierceCount = attack.pierceCount || 0;
    this.freezeChance = attack.freezeChance || 0;
    this.freezeDuration = attack.freezeDuration || 0;
    this.stunChance = attack.stunChance || 0;
    this.stunDuration = attack.stunDuration || 0;
    this.burnDps = attack.burnDps || 0;
    this.burnDuration = attack.burnDuration || 0;
    this.element = attack.element;
    this.color = attack.color;
    this.dead = false;
    this.hitEnemies = new Set();
    this.trail = [];
  }

  update(dt) {
    if (this.dead) return;
    if (!this.currentTarget || this.currentTarget.dead) {
      this._nextTarget();
      if (!this.currentTarget) { this.dead = true; return; }
    }

    let dx = this.currentTarget.x - this.x;
    let dy = this.currentTarget.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let moveDist = this.speed * dt;

    this.trail.push({ x: this.x, y: this.y, age: 0 });
    if (this.trail.length > 8) this.trail.shift();
    for (let t of this.trail) t.age += dt;

    if (dist <= moveDist + 10) {
      this._onHit(this.currentTarget);
      if (this.pierceCount > 0) {
        this.pierceCount--;
        this.hitEnemies.add(this.currentTarget.id);
        this._nextTarget();
      } else {
        this.dead = true;
      }
    } else {
      this.x += (dx / dist) * moveDist;
      this.y += (dy / dist) * moveDist;
    }
  }

  _onHit(enemy) {
    let actualDmg = enemy.takeDamage(this.damage);
    this.hitEnemies.add(enemy.id);

    if (this.slowRate > 0) enemy.applySlow(this.slowRate, this.slowDuration);
    if (Math.random() < this.freezeChance) enemy.applyFreeze(this.freezeDuration);
    if (Math.random() < this.stunChance) enemy.applyStun(this.stunDuration);
    if (this.poisonDps > 0) enemy.applyPoison(this.poisonDps, this.poisonDuration);
    if (this.burnDps > 0) enemy.applyBurn(this.burnDps, this.burnDuration);

    if (this.chainCount > 0) {
      this._chainLightning(enemy, this.chainCount, this.damage * this.chainDamageFalloff);
    }

    this._healAmount = this.healPerHit;
    this._lifeStealAmount = actualDmg * this.lifeSteal;
  }

  _chainLightning(source, count, damage) {
    let range = GameConfig.GRID_SIZE * 2;
    let targets = [];
    this._chainData = { source, count, damage, range, hitEnemies: new Set(this.hitEnemies) };
  }

  _nextTarget() {
    this.targetIndex++;
    if (this.targetIndex < this.targets.length) {
      this.currentTarget = this.targets[this.targetIndex];
    } else {
      this.currentTarget = null;
    }
  }

  render(ctx) {
    if (this.dead) return;

    for (let i = 0; i < this.trail.length; i++) {
      let t = this.trail[i];
      let alpha = (1 - t.age * 3) * 0.4;
      if (alpha <= 0) continue;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3 * (1 - t.age * 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    let size = this.isCrit ? 6 : 4;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isCrit ? 10 : 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (this.isCrit) {
      ctx.fillStyle = '#FFD23F';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💥', this.x, this.y - 10);
    }
  }
};
