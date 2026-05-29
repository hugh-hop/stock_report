window.BattlePassSystem = class BattlePassSystem {
  constructor() {
    this.level = 15;
    this.maxLevel = 50;
    this.exp = 0;
    this.expPerLevel = 100;
    this.isPremium = false;
    this.seasonName = '觉醒赛季 · 第三季';
    this.daysRemaining = 18;
    this.freeRewards = this._generateRewards(false);
    this.paidRewards = this._generateRewards(true);
  }

  _generateRewards(isPremium) {
    let rewards = [];
    let types = isPremium
      ? [{ icon: '💎', count: 50 }, { icon: '📦', count: 1 }, { icon: '🎭', count: 1 }, { icon: '🏹', count: 1 }, { icon: '👑', count: 1 }]
      : [{ icon: '🪙', count: 500 }, { icon: '⚡', count: 30 }, { icon: '📦', count: 1 }, { icon: '💎', count: 20 }, { icon: '🏆', count: 1 }];
    for (let i = 0; i < this.maxLevel; i += 5) {
      let t = types[(i / 5) % types.length];
      rewards.push({ level: i + 1, icon: t.icon, count: t.count, claimed: i < this.level });
    }
    return rewards;
  }

  addExp(amount) {
    this.exp += amount;
    while (this.exp >= this.expPerLevel && this.level < this.maxLevel) {
      this.exp -= this.expPerLevel;
      this.level++;
    }
  }

  claimReward(level, isPremiumTrack) {
    let rewards = isPremiumTrack ? this.paidRewards : this.freeRewards;
    let reward = rewards.find(r => r.level === level);
    if (!reward || reward.claimed) return { success: false, msg: '无法领取' };
    if (level > this.level) return { success: false, msg: '等级不足' };
    if (isPremiumTrack && !this.isPremium) return { success: false, msg: '需要高级战令' };
    reward.claimed = true;
    return { success: true, reward };
  }

  unlockPremium() {
    this.isPremium = true;
    return { success: true };
  }

  getProgress() {
    return { level: this.level, maxLevel: this.maxLevel, exp: this.exp, expPerLevel: this.expPerLevel, percent: this.level / this.maxLevel };
  }
};
