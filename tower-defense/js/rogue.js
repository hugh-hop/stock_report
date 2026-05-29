window.RogueSystem = class RogueSystem {
  constructor() {
    this.activeBuffs = [];
    this.countdown = 0;
    this.choices = [];
    this.selecting = false;
    this.goldMult = 1;
    this.waveGoldMult = 1;
    this.hpRegen = 0;
    this.armorPen = 0;
  }

  generateChoices() {
    let pool = [...GameConfig.ROGUE_BUFFS];
    let weights = pool.map(b => {
      switch (b.rarity) {
        case 'common': return 50;
        case 'rare': return 30;
        case 'epic': return 15;
        case 'legendary': return 5;
        default: return 25;
      }
    });
    let choices = [];
    let available = [...pool];
    let availWeights = [...weights];
    for (let i = 0; i < 3 && available.length > 0; i++) {
      let idx = this._weightedRandomIndex(availWeights);
      choices.push(available[idx]);
      available.splice(idx, 1);
      availWeights.splice(idx, 1);
    }
    this.choices = choices;
    this.countdown = GameConfig.ROGUE_COUNTDOWN;
    this.selecting = true;
    return choices;
  }

  _weightedRandomIndex(weights) {
    let total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }

  selectChoice(index) {
    if (!this.selecting || index < 0 || index >= this.choices.length) return null;
    let buff = this.choices[index];
    this.activeBuffs.push(buff);
    this.selecting = false;
    if (buff.stat === 'goldMult') this.goldMult += buff.value;
    if (buff.stat === 'waveGoldMult') this.waveGoldMult *= buff.value;
    if (buff.stat === 'hpRegen') this.hpRegen += buff.value;
    if (buff.stat === 'armorPen') this.armorPen += buff.value;
    return buff;
  }

  autoSelect() {
    return this.selectChoice(0);
  }

  update(dt) {
    if (!this.selecting) return false;
    this.countdown -= dt;
    if (this.countdown <= 0) {
      this.autoSelect();
      return true;
    }
    return false;
  }

  getGoldMultiplier() { return this.goldMult; }
  getWaveGoldMultiplier() { return this.waveGoldMult; }
  getHpRegen() { return this.hpRegen; }
  getArmorPen() { return this.armorPen; }
  getActiveBuffs() { return this.activeBuffs; }
};
