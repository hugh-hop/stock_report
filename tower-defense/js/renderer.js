window.Renderer = class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.particles = [];
    this.damageNumbers = [];
    this.resize();
  }

  resize() {
    let parent = this.canvas.parentElement;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.scaleX = this.width / (GameConfig.GRID_COLS * GameConfig.GRID_SIZE);
    this.scaleY = this.height / (GameConfig.GRID_ROWS * GameConfig.GRID_SIZE);
    this.scale = Math.min(this.scaleX, this.scaleY);
    this.offsetX = (this.width - GameConfig.GRID_COLS * GameConfig.GRID_SIZE * this.scale) / 2;
    this.offsetY = (this.height - GameConfig.GRID_ROWS * GameConfig.GRID_SIZE * this.scale) / 2;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  beginDraw() {
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
  }

  endDraw() {
    this.ctx.restore();
  }

  screenToGame(sx, sy) {
    return {
      x: (sx - this.offsetX) / this.scale,
      y: (sy - this.offsetY) / this.scale
    };
  }

  gameToScreen(gx, gy) {
    return {
      x: gx * this.scale + this.offsetX,
      y: gy * this.scale + this.offsetY
    };
  }

  addParticle(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  addDamageNumber(x, y, value, isCrit, color) {
    this.damageNumbers.push({
      x, y, value, isCrit, color,
      life: 1.0,
      vy: -60
    });
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      let d = this.damageNumbers[i];
      d.y += d.vy * dt;
      d.vy *= 0.95;
      d.life -= dt;
      if (d.life <= 0) this.damageNumbers.splice(i, 1);
    }
  }

  renderParticles(ctx) {
    for (let p of this.particles) {
      let alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let d of this.damageNumbers) {
      let alpha = d.life;
      ctx.globalAlpha = alpha;
      ctx.font = d.isCrit ? 'bold 16px sans-serif' : '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = d.isCrit ? '#FFD23F' : (d.color || '#FFFFFF');
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeText(d.value, d.x, d.y);
      ctx.fillText(d.value, d.x, d.y);
    }
    ctx.globalAlpha = 1;
  }

  renderRangeCircle(ctx, x, y, rangePx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, rangePx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.05;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }

  renderBuildHighlight(ctx, col, row, canBuild) {
    let G = GameConfig.GRID_SIZE;
    ctx.fillStyle = canBuild ? 'rgba(78,203,113,0.3)' : 'rgba(255,107,107,0.3)';
    ctx.fillRect(col * G, row * G, G, G);
    ctx.strokeStyle = canBuild ? '#4ECB71' : '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.strokeRect(col * G, row * G, G, G);
  }
};
