window.GameMap = class GameMap {
  constructor(theme, level) {
    this.theme = theme;
    this.level = level;
    this.cols = GameConfig.GRID_COLS;
    this.rows = GameConfig.GRID_ROWS;
    this.grid = [];
    this.towers = new Map();
    this.waypoints = [];
    this.decorations = [];
    this._generateMap();
  }

  _generateMap() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(1));
    let pathCells = this._generatePath();
    for (let cell of pathCells) {
      this.grid[cell.row][cell.col] = 0;
    }
    this._addObstacles();
    this._addDecorations();
  }

  _generatePath() {
    let path = [];
    let startCol = 1, endCol = this.cols - 2;
    path.push({col: startCol, row: 0});
    for (let c = startCol; c <= endCol; c++) path.push({col: c, row: 1});
    for (let r = 2; r <= 4; r++) path.push({col: endCol, row: r});
    for (let c = endCol; c >= startCol; c--) path.push({col: c, row: 5});
    for (let r = 6; r <= 8; r++) path.push({col: startCol, row: r});
    for (let c = startCol; c <= endCol; c++) path.push({col: c, row: 9});
    for (let r = 10; r <= 11; r++) path.push({col: endCol, row: r});
    for (let c = endCol; c >= Math.floor(this.cols/2); c--) path.push({col: c, row: 12});
    path.push({col: Math.floor(this.cols/2), row: 13});
    this.waypoints = this._simplifyPath(path);
    return path;
  }

  _simplifyPath(path) {
    if (path.length <= 2) return path;
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

  _addObstacles() {
    let blockedPositions = [
      {col:0, row:3}, {col:0, row:7}, {col:this.cols-1, row:3}, {col:this.cols-1, row:10}
    ];
    for (let pos of blockedPositions) {
      if (pos.row < this.rows && pos.col < this.cols && this.grid[pos.row][pos.col] === 1) {
        this.grid[pos.row][pos.col] = 2;
      }
    }
  }

  _addDecorations() {
    let themeDecor = {
      forest: { trees: 'tree', rocks: 'rock', flowers: 'flower' },
      lava: { trees: 'volcano', rocks: 'rock', flowers: 'flameLord' },
      ice: { trees: 'tree', rocks: 'iceCrystal', flowers: 'iceCrystal' }
    };
    let decor = themeDecor[this.theme] || themeDecor.forest;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 2 && Math.random() > 0.3) {
          let iconName = Math.random() > 0.5 ? decor.trees : decor.rocks;
          this.decorations.push({ col: c, row: r, icon: iconName });
        }
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
    let themeColors = {
      forest: { bg: '#2d5a2d', path: '#8B7355', pathBorder: '#6B5335', buildable: '#3a6b3a', blocked: '#1a3a1a', grid: 'rgba(255,255,255,0.05)' },
      lava: { bg: '#5a2d2d', path: '#8B6B55', pathBorder: '#6B4B35', buildable: '#6b3a3a', blocked: '#3a1a1a', grid: 'rgba(255,255,255,0.05)' },
      ice: { bg: '#2d3d5a', path: '#7B8B9B', pathBorder: '#5B6B7B', buildable: '#3a4b6b', blocked: '#1a2a3a', grid: 'rgba(255,255,255,0.05)' }
    };
    let colors = themeColors[this.theme] || themeColors.forest;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, this.cols * G, this.rows * G);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let x = c * G, y = r * G;
        let cellType = this.grid[r][c];
        if (cellType === 0) {
          ctx.fillStyle = colors.path;
          ctx.fillRect(x + 1, y + 1, G - 2, G - 2);
          ctx.strokeStyle = colors.pathBorder;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, G - 2, G - 2);
        } else if (cellType === 1) {
          ctx.fillStyle = colors.buildable;
          ctx.fillRect(x + 1, y + 1, G - 2, G - 2);
        } else if (cellType === 2) {
          ctx.fillStyle = colors.blocked;
          ctx.fillRect(x, y, G, G);
        }
      }
    }

    for (let d of this.decorations) {
      let pos = Utils.gridToPixel(d.col, d.row);
      if (window.Icons) {
        let img = Icons.createImage(d.icon, Math.floor(GameConfig.GRID_SIZE * 0.6), '#5A6380');
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, pos.x - GameConfig.GRID_SIZE * 0.3, pos.y - GameConfig.GRID_SIZE * 0.3, GameConfig.GRID_SIZE * 0.6, GameConfig.GRID_SIZE * 0.6);
        }
      }
    }

    let entryIcon = window.Icons ? Icons.createImage('entry', Math.floor(GameConfig.GRID_SIZE * 0.7), '#4ECB71') : null;
    let exitIcon = window.Icons ? Icons.createImage('exit', Math.floor(GameConfig.GRID_SIZE * 0.7), '#FF6B6B') : null;
    let entry = this.getEntryPixel();
    let exit = this.getExitPixel();
    let markerSize = GameConfig.GRID_SIZE * 0.7;
    if (entryIcon && entryIcon.complete && entryIcon.naturalWidth > 0) {
      ctx.drawImage(entryIcon, entry.x - markerSize/2, entry.y - markerSize/2, markerSize, markerSize);
    } else {
      ctx.fillStyle = '#4ECB71';
      ctx.beginPath();
      ctx.arc(entry.x, entry.y, markerSize/3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (exitIcon && exitIcon.complete && exitIcon.naturalWidth > 0) {
      ctx.drawImage(exitIcon, exit.x - markerSize/2, exit.y - markerSize/2, markerSize, markerSize);
    } else {
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(exit.x, exit.y, markerSize/3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= this.rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * G); ctx.lineTo(this.cols * G, r * G); ctx.stroke();
    }
    for (let c = 0; c <= this.cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * G, 0); ctx.lineTo(c * G, this.rows * G); ctx.stroke();
    }
  }
};
