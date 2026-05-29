window.PVPSystem = class PVPSystem {
  constructor() {
    this.elo = 1500;
    this.wins = 0;
    this.losses = 0;
    this.placementGames = GameConfig.PVP.placementGames;
    this.isPlacing = true;
  }

  getRank() {
    let ranks = GameConfig.PVP.ranks;
    let icons = GameConfig.PVP.rankIcons;
    let thresholds = [0, 1200, 1500, 1800, 2100, 2400];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (this.elo >= thresholds[i]) return { name: ranks[i], icon: icons[i], index: i };
    }
    return { name: ranks[0], icon: icons[0], index: 0 };
  }

  getWinRate() {
    let total = this.wins + this.losses;
    return total > 0 ? Math.floor(this.wins / total * 100) : 0;
  }

  recordResult(victory) {
    if (victory) {
      this.wins++;
      this.elo += GameConfig.PVP.eloPerWin;
    } else {
      this.losses++;
      this.elo += GameConfig.PVP.eloPerLoss;
    }
    this.elo = Math.max(0, this.elo);
    if (this.isPlacing && this.wins + this.losses >= this.placementGames) {
      this.isPlacing = false;
    }
  }

  generateOpponent() {
    let eloRange = 200;
    let oppElo = this.elo + (Math.random() - 0.5) * eloRange * 2;
    let names = ['暗影猎手', '钢铁堡垒', '森林守卫', '火焰法师', '冰霜女王', '雷霆战士', '毒蛇刺客', '光明骑士'];
    let oppRank = new PVPSystem();
    oppRank.elo = Math.floor(oppElo);
    return {
      name: names[Math.floor(Math.random() * names.length)],
      elo: Math.floor(oppElo),
      rank: oppRank.getRank(),
      winRate: 40 + Math.floor(Math.random() * 40)
    };
  }
};
