window.UpgradeSystem = class UpgradeSystem {
  constructor() {
    this.towerLevels = {};
    for (let type of Object.keys(GameConfig.TOWERS)) {
      this.towerLevels[type] = { level: 1, exp: 0, branch: null };
    }
  }

  getTowerInfo(type) {
    let cfg = GameConfig.TOWERS[type];
    let info = this.towerLevels[type];
    return { ...cfg, ...info };
  }

  getUpgradeCost(type) {
    let info = this.towerLevels[type];
    let cfg = GameConfig.TOWERS[type];
    return Math.floor(cfg.cost * (info.level === 1 ? 0.6 : 1.0));
  }

  upgrade(type, gold) {
    let info = this.towerLevels[type];
    let cfg = GameConfig.TOWERS[type];
    let cost = Math.floor(cfg.cost * (info.level === 1 ? 0.6 : 1.0));
    if (gold < cost) return { success: false, msg: '金币不足' };
    info.level++;
    return { success: true, cost, newLevel: info.level };
  }

  selectBranch(type, branchIndex) {
    let info = this.towerLevels[type];
    if (info.branch !== null) return { success: false, msg: '已选择分支' };
    info.branch = branchIndex;
    return { success: true, branch: GameConfig.TOWERS[type].branches[branchIndex] };
  }
};
