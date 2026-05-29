window.SkillSystem = class SkillSystem {
  constructor() {
    this.skills = {};
    for (let [key, cfg] of Object.entries(GameConfig.SKILLS)) {
      this.skills[key] = { ...cfg, currentCd: 0 };
    }
  }

  update(dt) {
    for (let key of Object.keys(this.skills)) {
      if (this.skills[key].currentCd > 0) {
        this.skills[key].currentCd -= dt;
        if (this.skills[key].currentCd < 0) this.skills[key].currentCd = 0;
      }
    }
  }

  canUse(skillKey) {
    return this.skills[skillKey] && this.skills[skillKey].currentCd <= 0;
  }

  use(skillKey, targetPos, enemies, baseHp, baseMaxHp) {
    if (!this.canUse(skillKey)) return null;
    let skill = this.skills[skillKey];
    skill.currentCd = skill.cooldown;
    let result = { type: skillKey, hits: [] };

    if (skillKey === 'meteor') {
      let radius = skill.radius * GameConfig.GRID_SIZE;
      for (let e of enemies) {
        if (e.dead || e.reachedEnd) continue;
        let dist = Utils.distance(targetPos.x, targetPos.y, e.x, e.y);
        if (dist <= radius) {
          let dmg = Math.floor(skill.damage * (1 - dist / radius * 0.5));
          let actualDmg = e.takeDamage(dmg);
          result.hits.push({ enemy: e, damage: actualDmg });
        }
      }
      result.areaEffect = { x: targetPos.x, y: targetPos.y, radius, color: skill.color, duration: 0.5 };
    } else if (skillKey === 'freeze') {
      let radius = skill.radius * GameConfig.GRID_SIZE;
      for (let e of enemies) {
        if (e.dead || e.reachedEnd) continue;
        let dist = Utils.distance(targetPos.x, targetPos.y, e.x, e.y);
        if (dist <= radius) {
          e.applyFreeze(skill.duration);
          result.hits.push({ enemy: e, frozen: true });
        }
      }
      result.areaEffect = { x: targetPos.x, y: targetPos.y, radius, color: skill.color, duration: 0.5 };
    } else if (skillKey === 'heal') {
      let healAmount = Math.floor(baseMaxHp * skill.healPercent);
      result.healAmount = Math.min(healAmount, baseMaxHp - baseHp);
      result.areaEffect = { x: 0, y: 0, radius: 0, color: skill.color, duration: 0.3 };
    }
    return result;
  }

  getCooldownInfo(skillKey) {
    let skill = this.skills[skillKey];
    if (!skill) return null;
    return { current: skill.currentCd, max: skill.cooldown, ready: skill.currentCd <= 0 };
  }
};
