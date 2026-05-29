window.PathFinder = class PathFinder {
  constructor() { this.cache = new Map(); }

  findPath(grid, start, end) {
    let key = `${start.col},${start.row}-${end.col},${end.row}`;
    if (this.cache.has(key)) return this.cache.get(key);

    let open = [], closed = new Set(), cameFrom = new Map();
    let gScore = new Map(), fScore = new Map();
    let startKey = `${start.col},${start.row}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, this._heuristic(start, end));
    open.push({ ...start, f: fScore.get(startKey) });

    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f);
      let current = open.shift();
      let currentKey = `${current.col},${current.row}`;

      if (current.col === end.col && current.row === end.row) {
        let path = this._reconstructPath(cameFrom, currentKey);
        this.cache.set(key, path);
        return path;
      }

      closed.add(currentKey);
      let neighbors = this._getNeighbors(grid, current);

      for (let n of neighbors) {
        let nKey = `${n.col},${n.row}`;
        if (closed.has(nKey)) continue;
        let tentativeG = (gScore.get(currentKey) || Infinity) + 1;
        if (tentativeG < (gScore.get(nKey) || Infinity)) {
          cameFrom.set(nKey, currentKey);
          gScore.set(nKey, tentativeG);
          let f = tentativeG + this._heuristic(n, end);
          fScore.set(nKey, f);
          if (!open.find(o => o.col === n.col && o.row === n.row)) {
            open.push({ ...n, f });
          }
        }
      }
    }
    return null;
  }

  _heuristic(a, b) { return Math.abs(a.col - b.col) + Math.abs(a.row - b.row); }

  _getNeighbors(grid, pos) {
    let dirs = [{col:0,row:-1},{col:1,row:0},{col:0,row:1},{col:-1,row:0}];
    let result = [];
    for (let d of dirs) {
      let nc = pos.col + d.col, nr = pos.row + d.row;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] === 0) {
        result.push({ col: nc, row: nr });
      }
    }
    return result;
  }

  _reconstructPath(cameFrom, currentKey) {
    let path = [], key = currentKey;
    while (key) {
      let [col, row] = key.split(',').map(Number);
      path.unshift({ col, row });
      key = cameFrom.get(key);
    }
    return path;
  }

  clearCache() { this.cache.clear(); }
};
