window.GameConfig = {
  CANVAS_WIDTH: 375,
  CANVAS_HEIGHT: 600,
  GRID_SIZE: 40,
  GRID_COLS: 9,
  GRID_ROWS: 14,
  MAX_WAVES: 8,
  ROGUE_INTERVAL: 2,
  ROGUE_COUNTDOWN: 8,
  BASE_HP: 100,
  STARTING_GOLD: 300,
  GOLD_PER_KILL: 15,
  GOLD_PER_WAVE: 50,
  TOWERS: {
    archer: { name: '精灵弓箭手', icon: '🏹', element: 'nature', cost: 100, damage: 25, attackSpeed: 1.2, range: 3.5, critRate: 0.15, color: '#4ECB71',
      branches: [
        { name: '穿透之箭', icon: '🏹', desc: '攻击穿透2个目标', bonus: { pierce: 2 } },
        { name: '箭雨风暴', icon: '🌪️', desc: '范围AOE伤害', bonus: { aoeRadius: 1.5 } }
      ]
    },
    mage: { name: '烈焰法师', icon: '🔮', element: 'fire', cost: 150, damage: 45, attackSpeed: 0.8, range: 3.0, splashRadius: 1.0, color: '#FF8C42',
      branches: [
        { name: '烈焰风暴', icon: '🔥', desc: '增大溅射范围50%', bonus: { splashRadiusMult: 1.5 } },
        { name: '灼烧之触', icon: '💀', desc: '攻击附带灼烧DOT', bonus: { burnDps: 15, burnDuration: 3 } }
      ]
    },
    ice: { name: '冰霜守卫', icon: '❄️', element: 'water', cost: 120, damage: 18, attackSpeed: 1.0, range: 3.0, slowRate: 0.4, slowDuration: 2.0, color: '#4A7BF7',
      branches: [
        { name: '极寒领域', icon: '🧊', desc: '减速效果+20%', bonus: { slowRateAdd: 0.2 } },
        { name: '冰封禁锢', icon: '⛓️', desc: '攻击有15%概率冻结1秒', bonus: { freezeChance: 0.15, freezeDuration: 1.0 } }
      ]
    },
    thunder: { name: '雷霆之塔', icon: '⚡', element: 'thunder', cost: 200, damage: 35, attackSpeed: 0.6, range: 3.5, chainCount: 2, chainDamageFalloff: 0.7, color: '#FFD23F',
      branches: [
        { name: '雷神之怒', icon: '⚡', desc: '连锁+2目标', bonus: { chainCountAdd: 2 } },
        { name: '电磁脉冲', icon: '💫', desc: '攻击附带1秒眩晕', bonus: { stunChance: 0.25, stunDuration: 1.0 } }
      ]
    },
    poison: { name: '剧毒喷射', icon: '☠️', element: 'poison', cost: 130, damage: 12, attackSpeed: 1.5, range: 2.5, poisonDps: 20, poisonDuration: 3, color: '#84CC16',
      branches: [
        { name: '瘟疫蔓延', icon: '🦠', desc: '毒雾扩散至周围', bonus: { poisonSpread: true } },
        { name: '腐蚀之雾', icon: '💨', desc: '中毒敌人防御-30%', bonus: { armorReduce: 0.3 } }
      ]
    },
    light: { name: '圣光之塔', icon: '✝️', element: 'light', cost: 180, damage: 30, attackSpeed: 0.9, range: 4.0, healPerHit: 5, color: '#F59E0B',
      branches: [
        { name: '神圣庇护', icon: '🛡️', desc: '范围内友方减伤15%', bonus: { damageReduction: 0.15 } },
        { name: '审判之光', icon: '☀️', desc: '对暗属性敌人伤害+50%', bonus: { darkBonus: 0.5 } }
      ]
    },
    mech: { name: '机械炮台', icon: '⚙️', element: 'mech', cost: 250, damage: 60, attackSpeed: 0.4, range: 5.0, armor: 10, color: '#6B7280',
      branches: [
        { name: '重炮模式', icon: '💣', desc: '伤害+80%但攻速-30%', bonus: { damageMult: 1.8, attackSpeedMult: 0.7 } },
        { name: '速射模式', icon: '🔫', desc: '攻速+100%但伤害-40%', bonus: { damageMult: 0.6, attackSpeedMult: 2.0 } }
      ]
    },
    dark: { name: '暗影之塔', icon: '🌑', element: 'dark', cost: 220, damage: 40, attackSpeed: 0.7, range: 3.0, lifeSteal: 0.15, color: '#7C3AED',
      branches: [
        { name: '灵魂收割', icon: '💀', desc: '击杀回复3%基地血量', bonus: { killHealPercent: 0.03 } },
        { name: '暗影突袭', icon: '👤', desc: '攻击有20%概率双倍伤害', bonus: { doubleDamageChance: 0.2 } }
      ]
    }
  },
  TOWER_UPGRADE: {
    level2Cost: 0.6,
    level3Cost: 1.0,
    damagePerLevel: 1.4,
    speedPerLevel: 1.1,
    rangePerLevel: 1.05,
    sellRefund: 0.6
  },
  ENEMIES: {
    goblin: { name: '哥布林', icon: '👺', hp: 60, speed: 2.0, armor: 0, reward: 10, color: '#4ECB71', size: 0.6 },
    skeleton: { name: '骷髅兵', icon: '💀', hp: 80, speed: 1.5, armor: 2, reward: 12, color: '#D1D5DB', size: 0.65 },
    bat: { name: '暗夜蝠', icon: '🦇', hp: 40, speed: 3.0, armor: 0, reward: 8, color: '#6B7280', size: 0.5, flying: true },
    orc: { name: '兽人战士', icon: '👹', hp: 150, speed: 1.2, armor: 5, reward: 20, color: '#B45309', size: 0.8 },
    slime: { name: '史莱姆', icon: '🟢', hp: 50, speed: 1.8, armor: 0, reward: 8, color: '#22C55E', size: 0.55, splitOnDeath: true },
    knight: { name: '暗黑骑士', icon: '🗡️', hp: 200, speed: 1.0, armor: 10, reward: 30, color: '#374151', size: 0.85 },
    darkMage: { name: '暗影法师', icon: '🧙', hp: 100, speed: 1.3, armor: 0, reward: 25, color: '#7C3AED', size: 0.7, shieldHp: 50 },
    dragon: { name: '幼龙', icon: '🐉', hp: 120, speed: 2.2, armor: 3, reward: 22, color: '#DC2626', size: 0.75, flying: true },
    golem: { name: '岩石巨人', icon: '🗿', hp: 300, speed: 0.8, armor: 15, reward: 35, color: '#78716C', size: 0.9 }
  },
  BOSSES: {
    forestGuardian: { name: '森林守护者', icon: '🌳', hp: 2000, speed: 0.6, armor: 10, reward: 200, color: '#166534', size: 1.2, skill: 'heal_aura' },
    flameLord: { name: '炎魔领主', icon: '🔥', hp: 3000, speed: 0.5, armor: 5, reward: 300, color: '#DC2626', size: 1.3, skill: 'fire_rain' },
    iceWitch: { name: '冰霜女巫', icon: '🧊', hp: 2500, speed: 0.7, armor: 8, reward: 250, color: '#1D4ED8', size: 1.1, skill: 'freeze_all' },
    thunderTitan: { name: '雷霆泰坦', icon: '⛈️', hp: 4000, speed: 0.4, armor: 20, reward: 400, color: '#CA8A04', size: 1.4, skill: 'chain_lightning' },
    shadowKing: { name: '暗影之王', icon: '👑', hp: 5000, speed: 0.5, armor: 15, reward: 500, color: '#581C87', size: 1.5, skill: 'shadow_summon' }
  },
  CHAPTERS: [
    { name: '觉醒之森', levels: 9, boss: 'forestGuardian', theme: 'forest', bgColor: '#1a3a1a', pathColor: '#3d2b1f' },
    { name: '熔岩深渊', levels: 9, boss: 'flameLord', theme: 'lava', bgColor: '#3a1a1a', pathColor: '#5c3a1f' },
    { name: '冰封王座', levels: 9, boss: 'iceWitch', theme: 'ice', bgColor: '#1a2a3a', pathColor: '#4a5a6a' }
  ],
  WAVE_TEMPLATES: {
    easy: [[5,'goblin'],[8,'goblin'],[3,'skeleton',2,'goblin'],[5,'skeleton',3,'goblin'],[2,'orc',4,'goblin']],
    medium: [[6,'skeleton',3,'goblin'],[4,'orc',4,'skeleton'],[3,'orc',5,'bat'],[2,'knight',3,'orc'],[4,'darkMage',3,'skeleton']],
    hard: [[5,'knight',3,'darkMage'],[4,'dragon',3,'orc'],[3,'golem',2,'knight'],[5,'darkMage',4,'dragon'],[2,'golem',3,'knight',2,'darkMage']]
  },
  ROGUE_BUFFS: [
    { id: 'atk_up_archer', name: '精准射击', icon: '🏹', desc: '弓箭塔攻击+15%', rarity: 'common', target: 'archer', stat: 'damage', value: 0.15, color: '#4ECB71' },
    { id: 'atk_up_mage', name: '烈焰增幅', icon: '🔮', desc: '法师塔攻击+15%', rarity: 'common', target: 'mage', stat: 'damage', value: 0.15, color: '#FF8C42' },
    { id: 'slow_up_ice', name: '极寒领域', icon: '❄️', desc: '冰塔减速+20%', rarity: 'rare', target: 'ice', stat: 'slowRate', value: 0.2, color: '#4A7BF7' },
    { id: 'chain_up_thunder', name: '雷神之怒', icon: '⚡', desc: '雷塔连锁+2目标', rarity: 'epic', target: 'thunder', stat: 'chainCount', value: 2, color: '#FFD23F' },
    { id: 'global_atk', name: '战意高昂', icon: '⚔️', desc: '全体攻击+10%', rarity: 'rare', target: 'all', stat: 'damage', value: 0.1, color: '#FF8C42' },
    { id: 'global_speed', name: '急速光环', icon: '💨', desc: '全体攻速+12%', rarity: 'rare', target: 'all', stat: 'attackSpeed', value: 0.12, color: '#4A7BF7' },
    { id: 'gold_bonus', name: '点金术', icon: '🪙', desc: '击杀金币+25%', rarity: 'common', target: 'all', stat: 'goldMult', value: 0.25, color: '#FFD23F' },
    { id: 'hp_regen', name: '生命之泉', icon: '💚', desc: '每波回复10点基地HP', rarity: 'common', target: 'all', stat: 'hpRegen', value: 10, color: '#4ECB71' },
    { id: 'crit_boost', name: '致命一击', icon: '💥', desc: '全体暴击率+8%', rarity: 'rare', target: 'all', stat: 'critRate', value: 0.08, color: '#FF6B6B' },
    { id: 'range_boost', name: '鹰眼', icon: '👁️', desc: '全体射程+10%', rarity: 'common', target: 'all', stat: 'range', value: 0.1, color: '#A855F7' },
    { id: 'armor_break', name: '破甲', icon: '🗡️', desc: '全体护甲穿透+5', rarity: 'epic', target: 'all', stat: 'armorPen', value: 5, color: '#FF6B6B' },
    { id: 'double_gold', name: '双倍奖励', icon: '💰', desc: '波次奖励翻倍', rarity: 'legendary', target: 'all', stat: 'waveGoldMult', value: 2.0, color: '#FFD23F' },
    { id: 'poison_amp', name: '剧毒强化', icon: '☠️', desc: '毒塔DOT+30%', rarity: 'rare', target: 'poison', stat: 'poisonDps', value: 0.3, color: '#84CC16' },
    { id: 'light_heal', name: '圣光庇佑', icon: '✝️', desc: '圣光塔治疗量+50%', rarity: 'rare', target: 'light', stat: 'healPerHit', value: 0.5, color: '#F59E0B' },
    { id: 'dark_steal', name: '灵魂汲取', icon: '🌑', desc: '暗影塔吸血+10%', rarity: 'epic', target: 'dark', stat: 'lifeSteal', value: 0.1, color: '#7C3AED' }
  ],
  SKILLS: {
    meteor: { name: '陨石坠落', icon: '☄️', cooldown: 30, damage: 200, radius: 2.0, color: '#FF8C42' },
    freeze: { name: '冰封领域', icon: '🧊', cooldown: 25, duration: 3, radius: 3.0, color: '#4A7BF7' },
    heal: { name: '生命恢复', icon: '💚', cooldown: 40, healPercent: 0.3, color: '#4ECB71' }
  },
  ECONOMY: {
    energyMax: 120,
    energyRegenMinutes: 6,
    energyPerBattle: 10,
    dailyGemReward: 50,
    shopItems: [
      { id: 'chest', name: '觉醒宝箱', icon: '📦', desc: '随机获得稀有塔碎片', price: 120, currency: 'gem', gradient: ['#FFD23F','#FFA000'] },
      { id: 'energy_potion', name: '体力药水', icon: '⚡', desc: '恢复60点体力', price: 50, currency: 'gem', gradient: ['#4ECB71','#22C55E'] },
      { id: 'gold_bag', name: '金币袋', icon: '🪙', desc: '获得2000金币', price: 80, currency: 'gem', gradient: ['#FF8C42','#FFA366'] },
      { id: 'skin', name: '限定皮肤', icon: '🎭', desc: '冰霜女王特效', price: 300, currency: 'gem', gradient: ['#A855F7','#C084FC'] },
      { id: 'sweep', name: '扫荡券×5', icon: '🗺️', desc: '快速通关已三星关卡', price: 1000, currency: 'gold', gradient: ['#4A7BF7','#6B93FF'] },
      { id: 'monthly', name: '月卡', icon: '💎', desc: '每日领取100宝石', price: 198, currency: 'gem', gradient: ['#FF7EB3','#FF9EC7'] }
    ]
  },
  PVP: {
    ranks: ['青铜','白银','黄金','铂金','钻石','王者'],
    rankIcons: ['🥉','🥈','🥇','💎','💠','👑'],
    eloPerWin: 25,
    eloPerLoss: -15,
    placementGames: 10
  },
  ADAPTIVE: {
    failThreshold: 3,
    hpBuffPercent: 0.15,
    goldBuffPercent: 0.2,
    maxBuffStacks: 3
  }
};
