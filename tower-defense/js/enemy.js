window.Enemy = class Enemy {
  constructor(type, waypointPixels, isBoss = false) {
    let cfg = isBoss ? GameConfig.BOSSES[type] : GameConfig.ENEMIES[type];
    this.id = Utils.createId();
    this.type = type;
    this.isBoss = isBoss;
    this.name = cfg.name;
    this.icon = cfg.icon;
    this.color = cfg.color;
    this.size = cfg.size || 1;
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.baseSpeed = cfg.speed * GameConfig.GRID_SIZE;
    this.speed = this.baseSpeed;
    this.armor = cfg.armor || 0;
    this.reward = cfg.reward;
    this.flying = cfg.flying || false;
    this.splitOnDeath = cfg.splitOnDeath || false;
    this.shieldHp = cfg.shieldHp || 0;
    this.shieldMaxHp = cfg.shieldHp || 0;
    this.skill = cfg.skill || null;
    this.waypoints = waypointPixels;
    this.waypointIndex = 0;
    this.x = waypointPixels[0].x;
    this.y = waypointPixels[0].y;
    this.dead = false;
    this.reachedEnd = false;
    this.slowTimer = 0;
    this.slowRate = 0;
    this.freezeTimer = 0;
    this.stunTimer = 0;
    this.poisonTimer = 0;
    this.poisonDps = 0;
    this.burnTimer = 0;
    this.burnDps = 0;
    this.armorReduced = 0;
    this.animTimer = 0;
    this.hitFlash = 0;
    this.skillTimer = isBoss ? 5 : 0;
    this._iconImage = null;
    this._iconLoaded = false;
  }

  _loadIcon() {
    if (this._iconLoaded) return;
    this._iconLoaded = true;
    if (window.Icons) {
      let size = Math.floor(GameConfig.GRID_SIZE * 0.35 * this.size * 1.4);
      this._iconImage = Icons.createImage(this.icon, size, this.color);
    }
  }

  takeDamage(dmg, armorPen = 0) {
    if (this.shieldHp > 0) {
      let shieldDmg = Math.min(this.shieldHp, dmg);
      this.shieldHp -= shieldDmg;
      dmg -= shieldDmg;
    }
    let effectiveArmor = Math.max(0, this.armor - this.armorReduced - armorPen);
    let reduction = effectiveArmor / (effectiveArmor + 100);
    let actualDmg = Math.floor(dmg * (1 - reduction));
    this.hp -= actualDmg;
    this.hitFlash = 0.15;
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
    return actualDmg;
  }

  applySlow(rate, duration) {
    if (rate > this.slowRate) {
      this.slowRate = rate;
      this.slowTimer = duration;
    }
  }

  applyFreeze(duration) {
    this.freezeTimer = duration;
    this.stunTimer = Math.max(this.stunTimer, duration);
  }

  applyStun(duration) {
    this.stunTimer = Math.max(this.stunTimer, duration);
  }

  applyPoison(dps, duration) {
    this.poisonDps = Math.max(this.poisonDps, dps);
    this.poisonTimer = Math.max(this.poisonTimer, duration);
  }

  applyBurn(dps, duration) {
    this.burnDps = Math.max(this.burnDps, dps);
    this.burnTimer = Math.max(this.burnTimer, duration);
  }

  applyArmorReduce(reduce) {
    this.armorReduced = Math.max(this.armorReduced, reduce);
  }

  update(dt) {
    if (this.dead || this.reachedEnd) return;

    this.animTimer += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt);

    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      if (this.stunTimer <= 0) this.freezeTimer = 0;
      return;
    }
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowRate = 0;
    }
    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      this.hp -= this.poisonDps * dt;
      if (this.hp <= 0) { this.hp = 0; this.dead = true; }
    }
    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      this.hp -= this.burnDps * dt;
      if (this.hp <= 0) { this.hp = 0; this.dead = true; }
    }

    this.speed = this.baseSpeed * (1 - this.slowRate);
    if (this.freezeTimer > 0) this.speed = 0;

    if (this.waypointIndex < this.waypoints.length - 1) {
      let target = this.waypoints[this.waypointIndex + 1];
      let dx = target.x - this.x;
      let dy = target.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let moveDist = this.speed * dt;
      if (dist <= moveDist) {
        this.x = target.x;
        this.y = target.y;
        this.waypointIndex++;
        if (this.waypointIndex >= this.waypoints.length - 1) {
          this.reachedEnd = true;
        }
      } else {
        this.x += (dx / dist) * moveDist;
        this.y += (dy / dist) * moveDist;
      }
    }

    if (this.isBoss && this.skill) {
      this.skillTimer -= dt;
    }
  }

  shouldUseSkill() {
    if (!this.isBoss || !this.skill) return false;
    if (this.skillTimer <= 0) {
      this.skillTimer = 8 + Math.random() * 4;
      return true;
    }
    return false;
  }

  render(ctx) {
    if (this.dead) return;
    let G = GameConfig.GRID_SIZE;
    let r = G * 0.35 * this.size;
    let x = this.x, y = this.y;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.8, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    let bobY = Math.sin(this.animTimer * 3) * 2;
    ctx.fillStyle = this.hitFlash > 0 ? '#FFFFFF' : this.color;
    ctx.beginPath();
    ctx.arc(x, y + bobY, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y + bobY, r, 0, Math.PI * 2);
    ctx.stroke();

    this._loadIcon();
    if (this._iconImage && this._iconImage.complete && this._iconImage.naturalWidth > 0) {
      let iconSize = G * 0.35 * this.size * 1.4;
      ctx.drawImage(this._iconImage, x - iconSize/2, y + bobY - iconSize/2, iconSize, iconSize);
    } else {
      ctx.fillStyle = '#E8ECF4';
      ctx.font = `bold ${G * 0.25 * this.size}px Rajdhani, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.name.charAt(0), x, y + bobY);
    }

    let barW = r * 2.5, barH = 4;
    let barX = x - barW / 2, barY = y - r - 10 + bobY;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(barX, barY, barW, barH);
    let hpRatio = this.hp / this.maxHp;
    let hpColor = hpRatio > 0.5 ? '#4ECB71' : hpRatio > 0.25 ? '#FFD23F' : '#FF6B6B';
    ctx.fillStyle = hpColor;
    ctx.fillRect(barX, barY, barW * hpRatio, barH);

    if (this.shieldMaxHp > 0) {
      let shieldRatio = this.shieldHp / this.shieldMaxHp;
      ctx.fillStyle = '#4A7BF7';
      ctx.fillRect(barX, barY - 5, barW * shieldRatio, 3);
    }

    let statusIcons = [];
    if (this.freezeTimer > 0) statusIcons.push({ color: '#5B8DEF', label: 'F' });
    if (this.stunTimer > 0 && this.freezeTimer <= 0) statusIcons.push({ color: '#FFD700', label: 'S' });
    if (this.slowTimer > 0) statusIcons.push({ color: '#7BA4FF', label: 'W' });
    if (this.poisonTimer > 0) statusIcons.push({ color: '#84CC16', label: 'P' });
    if (this.burnTimer > 0) statusIcons.push({ color: '#FF7A3D', label: 'B' });
    for (let i = 0; i < statusIcons.length; i++) {
      let si = statusIcons[i];
      let sx = x + r + 3, sy = y - r + bobY + i * 12;
      ctx.fillStyle = si.color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(sx + 5, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0B0E17';
      ctx.font = 'bold 7px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(si.label, sx + 5, sy);
      ctx.globalAlpha = 1;
    }

    if (this.isBoss) {
      ctx.fillStyle = '#FFD700';
      let cr = G * 0.15 * this.size;
      let cy = y - r - 14 + bobY;
      ctx.beginPath();
      ctx.moveTo(x - cr, cy + cr);
      ctx.lineTo(x - cr, cy);
      ctx.lineTo(x - cr/2, cy + cr/2);
      ctx.lineTo(x, cy);
      ctx.lineTo(x + cr/2, cy + cr/2);
      ctx.lineTo(x + cr, cy);
      ctx.lineTo(x + cr, cy + cr);
      ctx.closePath();
      ctx.fill();
    }
  }
};
