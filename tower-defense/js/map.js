window.GameMap = class GameMap {
  constructor(theme, level) {
    this.theme = theme;
    this.level = level;
    this.chapterIndex = theme === 'forest' ? 0 : theme === 'lava' ? 1 : 2;
    this.cols = GameConfig.GRID_COLS;
    this.rows = GameConfig.GRID_ROWS;
    this.grid = [];
    this.towers = new Map();
    this.waypoints = [];
    this.decorations = [];
    this.strategicZones = [];
    this.ambientParticles = [];
    this.animTime = 0;
    this._iconCache = {};
    this._generateMap();
  }

  _generateMap() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(1));
    let layout = this._getLayout();
    let pathCells = layout.path;
    for (let cell of pathCells) {
      if (cell.row >= 0 && cell.row < this.rows && cell.col >= 0 && cell.col < this.cols) {
        this.grid[cell.row][cell.col] = 0;
      }
    }
    if (layout.obstacles) {
      for (let obs of layout.obstacles) {
        if (obs.row >= 0 && obs.row < this.rows && obs.col >= 0 && obs.col < this.cols) {
          this.grid[obs.row][obs.col] = 2;
        }
      }
    }
    this.strategicZones = layout.strategicZones || [];
    this.waypoints = this._simplifyPath(pathCells);
    this._addThemeDecorations();
    this._initAmbientParticles();
  }

  _getLayout() {
    let idx = ((this.chapterIndex * 9) + (this.level - 1)) % GameMap.LAYOUTS.length;
    return GameMap.LAYOUTS[idx];
  }

  _simplifyPath(path) {
    if (path.length <= 2) return [path[0], path[path.length-1]];
    let result = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      let prev = path[i-1], curr = path[i], next = path[i+1];
      let dx1 = curr.col - prev.col, dy1 = curr.row - prev.row;
      let dx2 = next.col - curr.col, dy2 = next.row - curr.row;
      if (dx1 !== dx2 || dy1 !== dy2) result.push(curr);
    }
    result.push(path[path.length - 1]);
    return result;
  }

  _addThemeDecorations() {
    let themeDecor = {
      forest: ['tree','rock','flower','tree'],
      lava: ['volcano','rock','rock','volcano'],
      ice: ['iceCrystal','rock','iceCrystal','tree']
    };
    let decorTypes = themeDecor[this.theme] || themeDecor.forest;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 2 && Math.random() > 0.25) {
          this.decorations.push({ col: c, row: r, icon: decorTypes[Math.floor(Math.random() * decorTypes.length)] });
        }
      }
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1 && Math.random() > 0.92) {
          let nearPath = false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              let nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] === 0) nearPath = true;
            }
          }
          if (!nearPath) {
            this.decorations.push({ col: c, row: r, icon: decorTypes[Math.floor(Math.random() * decorTypes.length)], small: true });
          }
        }
      }
    }
  }

  _initAmbientParticles() {
    this.ambientParticles = [];
    let count = this.theme === 'lava' ? 12 : this.theme === 'ice' ? 15 : 10;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.cols * GameConfig.GRID_SIZE,
        y: Math.random() * this.rows * GameConfig.GRID_SIZE,
        vx: (Math.random() - 0.5) * 8,
        vy: this.theme === 'ice' ? 5 + Math.random() * 10 : (this.theme === 'lava' ? -8 - Math.random() * 12 : -2 - Math.random() * 5),
        size: 1 + Math.random() * 2,
        life: Math.random(),
        maxLife: 2 + Math.random() * 3
      });
    }
  }

  update(dt) {
    this.animTime += dt;
    let G = GameConfig.GRID_SIZE;
    for (let p of this.ambientParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;
      if (p.life > p.maxLife || p.y < -10 || p.y > this.rows * G + 10 || p.x < -10 || p.x > this.cols * G + 10) {
        p.x = Math.random() * this.cols * G;
        p.y = this.theme === 'lava' ? this.rows * G : (this.theme === 'ice' ? -5 : Math.random() * this.rows * G);
        p.life = 0;
      }
    }
  }

  canBuild(col, row) {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows && this.grid[row][col] === 1;
  }

  placeTower(col, row, tower) {
    this.grid[row][col] = 3;
    this.towers.set(`${col},${row}`, tower);
  }

  removeTower(col, row) {
    this.grid[row][col] = 1;
    this.towers.delete(`${col},${row}`);
  }

  getTowerAt(col, row) {
    return this.towers.get(`${col},${row}`) || null;
  }

  getWaypoints() { return this.waypoints; }

  getEntryPixel() {
    let wp = this.waypoints[0];
    return Utils.gridToPixel(wp.col, wp.row);
  }

  getExitPixel() {
    let wp = this.waypoints[this.waypoints.length - 1];
    return Utils.gridToPixel(wp.col, wp.row);
  }

  render(ctx) {
    let G = GameConfig.GRID_SIZE;
    let C = this.cols, R = this.rows;
    let themes = {
      forest: {
        bg1: '#1a3a1a', bg2: '#2d5a2d',
        path: '#8B7355', pathAlt: '#7A6345', pathBorder: '#6B5335',
        buildable: '#2a5a2a', buildableNear: '#3a6b3a',
        blocked: '#0d2e0d', strategic: 'rgba(78,203,113,0.15)',
        grid: 'rgba(255,255,255,0.04)', particle: '#4ECB71',
        entry: '#4ECB71', exit: '#FF6B6B',
        terrain: ['#1e4a1e','#2a5a2a','#1a3a1a']
      },
      lava: {
        bg1: '#3a1a1a', bg2: '#5a2d2d',
        path: '#8B6B55', pathAlt: '#7A5A45', pathBorder: '#6B4B35',
        buildable: '#5a2a2a', buildableNear: '#6b3a3a',
        blocked: '#2a0d0d', strategic: 'rgba(255,122,61,0.15)',
        grid: 'rgba(255,200,100,0.04)', particle: '#FF7A3D',
        entry: '#FF7A3D', exit: '#FF6B6B',
        terrain: ['#4a1a1a','#5a2d2d','#3a1a1a']
      },
      ice: {
        bg1: '#1a2a3a', bg2: '#2d3d5a',
        path: '#7B8B9B', pathAlt: '#6A7A8A', pathBorder: '#5B6B7B',
        buildable: '#2a3a4a', buildableNear: '#3a4b6b',
        blocked: '#0d1a2a', strategic: 'rgba(91,141,239,0.15)',
        grid: 'rgba(200,220,255,0.04)', particle: '#7BA4FF',
        entry: '#5B8DEF', exit: '#FF6B6B',
        terrain: ['#1a2a3a','#2d3d5a','#1a2a3a']
      }
    };
    let t = themes[this.theme] || themes.forest;

    let grad = ctx.createLinearGradient(0, 0, 0, R * G);
    grad.addColorStop(0, t.bg1);
    grad.addColorStop(1, t.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, C * G, R * G);

    for (let i = 0; i < 5; i++) {
      let tx = ((i * 73 + 17) % C) * G;
      let ty = ((i * 53 + 31) % R) * G;
      let tr = G * (1.5 + (i % 3));
      ctx.fillStyle = t.terrain[i % 3];
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(tx, ty, tr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        let x = c * G, y = r * G;
        let cellType = this.grid[r][c];
        if (cellType === 0) {
          let isAlt = (r + c) % 2 === 0;
          ctx.fillStyle = isAlt ? t.path : t.pathAlt;
          ctx.fillRect(x + 1, y + 1, G - 2, G - 2);
          ctx.strokeStyle = t.pathBorder;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, G - 2, G - 2);
        } else if (cellType === 1) {
          let nearPath = false;
          for (let dr = -1; dr <= 1 && !nearPath; dr++) {
            for (let dc = -1; dc <= 1 && !nearPath; dc++) {
              let nr = r+dr, nc = c+dc;
              if (nr >=0 && nr < R && nc >=0 && nc < C && this.grid[nr][nc] === 0) nearPath = true;
            }
          }
          ctx.fillStyle = nearPath ? t.buildableNear : t.buildable;
          ctx.fillRect(x + 1, y + 1, G - 2, G - 2);
        } else if (cellType === 2) {
          ctx.fillStyle = t.blocked;
          ctx.fillRect(x, y, G, G);
        }
      }
    }

    for (let sz of this.strategicZones) {
      if (this.grid[sz.row] && this.grid[sz.row][sz.col] === 1) {
        let x = sz.col * G, y = sz.row * G;
        ctx.fillStyle = t.strategic;
        ctx.fillRect(x, y, G, G);
        ctx.strokeStyle = t.strategic.replace('0.15', '0.4');
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x + 2, y + 2, G - 4, G - 4);
        ctx.setLineDash([]);
      }
    }

    for (let d of this.decorations) {
      let pos = Utils.gridToPixel(d.col, d.row);
      let size = d.small ? G * 0.35 : G * 0.55;
      if (window.Icons) {
        let cacheKey = d.icon + '_' + Math.floor(size);
        if (!this._iconCache[cacheKey]) {
          this._iconCache[cacheKey] = Icons.createImage(d.icon, Math.floor(size), '#5A6380');
        }
        let img = this._iconCache[cacheKey];
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, pos.x - size/2, pos.y - size/2, size, size);
        }
      }
    }

    let entry = this.getEntryPixel();
    let pulse = Math.sin(this.animTime * 3) * 0.3 + 0.7;
    ctx.fillStyle = t.entry;
    ctx.globalAlpha = 0.3 * pulse;
    ctx.beginPath();
    ctx.arc(entry.x, entry.y, G * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = t.entry;
    ctx.beginPath();
    ctx.arc(entry.x, entry.y, G * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0B0E17';
    ctx.beginPath();
    ctx.moveTo(entry.x, entry.y + 4);
    ctx.lineTo(entry.x - 4, entry.y - 2);
    ctx.lineTo(entry.x + 4, entry.y - 2);
    ctx.closePath();
    ctx.fill();

    let exit = this.getExitPixel();
    ctx.fillStyle = t.exit;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, G * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = t.exit;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, G * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(exit.x, exit.y - G * 0.35);
    ctx.lineTo(exit.x + G * 0.3, exit.y - G * 0.15);
    ctx.lineTo(exit.x + G * 0.25, exit.y + G * 0.15);
    ctx.lineTo(exit.x, exit.y + G * 0.3);
    ctx.lineTo(exit.x - G * 0.25, exit.y + G * 0.15);
    ctx.lineTo(exit.x - G * 0.3, exit.y - G * 0.15);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = t.grid;
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= R; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * G); ctx.lineTo(C * G, r * G); ctx.stroke();
    }
    for (let c = 0; c <= C; c++) {
      ctx.beginPath(); ctx.moveTo(c * G, 0); ctx.lineTo(c * G, R * G); ctx.stroke();
    }

    for (let p of this.ambientParticles) {
      let alpha = 1 - (p.life / p.maxLife);
      ctx.fillStyle = t.particle;
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
};

GameMap.LAYOUTS = [
  {
    path: (function() {
      let p = [];
      for (let r = 0; r <= 7; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 10; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:2,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:1,row:2},{col:8,row:1},{col:3,row:8},{col:5,row:10}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:6,row:4},{col:6,row:7},{col:8,row:9}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 4; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 8; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 7; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:3},{col:4,row:3},{col:8,row:7},{col:1,row:11}],
    strategicZones: [{col:3,row:2},{col:5,row:4},{col:4,row:6},{col:3,row:8},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      for (let r = 0; r <= 10; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 7; c++) p.push({col:c,row:10});
      for (let r = 10; r >= 0; r--) p.push({col:7,row:r});
      for (let c = 7; c >= 5; c--) p.push({col:c,row:0});
      for (let r = 0; r <= 13; r++) p.push({col:5,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:4},{col:4,row:7},{col:0,row:6},{col:8,row:3}],
    strategicZones: [{col:3,row:3},{col:4,row:5},{col:6,row:3},{col:3,row:8},{col:6,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:7,row:0});
      for (let r = 0; r <= 2; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 10; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:5,row:5},{col:2,row:9},{col:8,row:12}],
    strategicZones: [{col:4,row:2},{col:2,row:4},{col:4,row:6},{col:6,row:8},{col:3,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:3,row:6},{col:5,row:9},{col:0,row:12}],
    strategicZones: [{col:2,row:2},{col:5,row:3},{col:3,row:5},{col:4,row:8},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      for (let c = 0; c <= 8; c++) p.push({col:c,row:0});
      for (let r = 1; r <= 11; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:11});
      for (let r = 11; r >= 2; r--) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:2});
      for (let r = 3; r <= 9; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 3; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:3,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:4},{col:5,row:6},{col:4,row:8}],
    strategicZones: [{col:4,row:5},{col:5,row:4},{col:3,row:7},{col:4,row:10},{col:2,row:6}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 3; c >= 2; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 7; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 10; r++) p.push({col:6,row:r});
      for (let c = 5; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:5},{col:6,row:2},{col:7,row:6},{col:1,row:10}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:1,row:7},{col:3,row:7},{col:5,row:7},{col:3,row:10},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:1});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:0,row:r});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:4,row:6},{col:2,row:8},{col:6,row:12}],
    strategicZones: [{col:2,row:2},{col:6,row:3},{col:4,row:5},{col:2,row:6},{col:6,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let c = 4; c >= 1; c--) p.push({col:c,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 10; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:4,row:2},{col:4,row:5},{col:4,row:8},{col:4,row:11}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:3,row:5},{col:7,row:5},{col:2,row:8},{col:6,row:8},{col:3,row:10},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:0,row:r});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 13; r++) p.push({col:8,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:1},{col:5,row:3},{col:3,row:6},{col:6,row:5},{col:7,row:8}],
    strategicZones: [{col:1,row:2},{col:4,row:2},{col:3,row:4},{col:5,row:7},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:8,row:0});
      for (let r = 0; r <= 2; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 8; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:1,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:6,row:4},{col:2,row:7},{col:5,row:11}],
    strategicZones: [{col:4,row:2},{col:3,row:5},{col:5,row:7},{col:4,row:10},{col:2,row:12}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 7; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 11; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 4; c++) p.push({col:c,row:12});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:6},{col:4,row:10},{col:8,row:11}],
    strategicZones: [{col:5,row:3},{col:6,row:5},{col:3,row:7},{col:2,row:10},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 4; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 7; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 10; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:3},{col:8,row:3},{col:6,row:7},{col:1,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:1,row:7},{col:3,row:7},{col:5,row:7},{col:3,row:11},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 1; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:1,row:r});
      return p;
    })(),
    obstacles: [{col:5,row:2},{col:3,row:5},{col:4,row:8},{col:7,row:11}],
    strategicZones: [{col:3,row:2},{col:5,row:4},{col:4,row:7},{col:2,row:10},{col:3,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:1});
      for (let c = 0; c <= 5; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 4; r++) p.push({col:5,row:r});
      for (let c = 5; c >= 3; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 7; r++) p.push({col:3,row:r});
      for (let c = 3; c <= 7; c++) p.push({col:c,row:8});
      for (let r = 9; r <= 10; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:3},{col:7,row:2},{col:1,row:6},{col:5,row:10},{col:8,row:7}],
    strategicZones: [{col:2,row:2},{col:4,row:4},{col:1,row:5},{col:5,row:7},{col:6,row:9}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 10; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:2},{col:2,row:6},{col:6,row:5},{col:2,row:10},{col:5,row:11}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:3,row:5},{col:5,row:5},{col:5,row:9},{col:6,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:0,row:r});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:0,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:0},{col:4,row:3},{col:4,row:6},{col:4,row:9},{col:4,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:3,row:5},{col:5,row:5},{col:3,row:8},{col:5,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:2,row:0});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 2; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 10; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 2; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:2,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:0,row:6},{col:8,row:6},{col:4,row:3},{col:4,row:9}],
    strategicZones: [{col:1,row:3},{col:3,row:3},{col:4,row:5},{col:5,row:5},{col:4,row:8},{col:5,row:8},{col:5,row:10},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:8,row:0});
      for (let r = 0; r <= 1; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 6; c--) p.push({col:c,row:2});
      for (let r = 3; r <= 4; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 4; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 7; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 10; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 4; c++) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:7,row:4},{col:3,row:3},{col:5,row:9},{col:1,row:7}],
    strategicZones: [{col:7,row:1},{col:5,row:3},{col:3,row:6},{col:3,row:9},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 11; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:5,row:5},{col:3,row:8},{col:6,row:11}],
    strategicZones: [{col:5,row:2},{col:3,row:5},{col:5,row:7},{col:3,row:10},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 4; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 1; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 9; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 6; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:6,row:r});
      return p;
    })(),
    obstacles: [{col:7,row:2},{col:6,row:4},{col:7,row:7},{col:3,row:8},{col:6,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:2,row:4},{col:3,row:7},{col:2,row:8},{col:5,row:8},{col:3,row:11},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 7; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 11; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 4; c++) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:2},{col:2,row:6},{col:5,row:10},{col:8,row:11}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:4,row:6},{col:3,row:10},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 9; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:2},{col:1,row:5},{col:0,row:8},{col:1,row:11},{col:8,row:2},{col:7,row:5},{col:8,row:8},{col:7,row:11}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:3,row:6},{col:5,row:6},{col:2,row:9},{col:6,row:9},{col:3,row:12},{col:5,row:12}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:6,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:3,row:6},{col:5,row:9},{col:1,row:12}],
    strategicZones: [{col:2,row:2},{col:6,row:3},{col:4,row:6},{col:3,row:9},{col:4,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 11; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 4; c--) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:5,row:1},{col:3,row:5},{col:4,row:8},{col:2,row:11}],
    strategicZones: [{col:5,row:2},{col:3,row:4},{col:5,row:7},{col:3,row:8},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let c = 0; c <= 6; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 3; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:3,row:r});
      for (let c = 3; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 2; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 12; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 4; c++) p.push({col:c,row:13});
      return p;
    })(),
    obstacles: [{col:1,row:3},{col:5,row:5},{col:1,row:8},{col:6,row:9},{col:4,row:12}],
    strategicZones: [{col:4,row:2},{col:2,row:5},{col:5,row:6},{col:3,row:9},{col:4,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let c = 4; c >= 1; c--) p.push({col:c,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 10; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:1,row:5},{col:7,row:5},{col:1,row:8},{col:7,row:8}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:2,row:5},{col:7,row:5},{col:2,row:9},{col:7,row:9},{col:2,row:11},{col:6,row:11}]
  }
];
