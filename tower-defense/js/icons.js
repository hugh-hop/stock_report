window.Icons = {
  _cache: {},

  defs: {
    archer: {
      d: 'M12 2L8 8h8L12 2zM12 8v6M9 14h6M10 11h4M7 17l-3 5M17 17l3 5M12 14v3',
      aria: '弓箭塔'
    },
    mage: {
      d: 'M12 2c-2 4-4 6-4 10a4 4 0 008 0c0-4-2-6-4-10zM10 9h4M12 12v2M10 18h4l-1 4h-2l-1-4z',
      aria: '法师塔'
    },
    ice: {
      d: 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 2l2 3-2 2-2-2 2-3zM12 17l2 3-2 2-2-2 2-3zM2 12l3 2 2-2-2-2-3 2zM17 12l3 2 2-2-2-2-3 2z',
      aria: '冰霜塔'
    },
    thunder: {
      d: 'M13 2L4 14h7l-2 8 9-12h-7l2-8z',
      aria: '雷电塔'
    },
    poison: {
      d: 'M12 2c-4 0-7 3-7 7 0 3 2 5 4 7v2h6v-2c2-2 4-4 4-7 0-4-3-7-7-7zM9 18h6M10 21h4M10 9a2 2 0 014 0',
      aria: '剧毒塔'
    },
    light: {
      d: 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1M12 7a5 5 0 100 10 5 5 0 000-10z',
      aria: '圣光塔'
    },
    mech: {
      d: 'M12 2a3 3 0 100 6 3 3 0 000-6zM12 8v3M8 11h8M7 14l-2 4M17 14l2 4M9 14v4M15 14v4M6 22h12',
      aria: '机械塔'
    },
    dark: {
      d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
      aria: '暗影塔'
    },

    goblin: {
      d: 'M12 4c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5zM7 6l-3-2M17 6l3-2M9 9h.01M15 9h.01M10 13h4M8 14c-2 1-3 3-3 5h14c0-2-1-4-3-5',
      aria: '哥布林'
    },
    skeleton: {
      d: 'M12 3a4 4 0 100 8 4 4 0 000-8zM10 6h1M13 6h1M12 9v1M8 12l-3 4M16 12l3 4M9 11c-3 0-5 2-5 4h4M15 11c3 0 5 2 5 4h-4M10 17h4l-1 4h-2l-1-4z',
      aria: '骷髅兵'
    },
    bat: {
      d: 'M12 6c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zM4 4c0 4 2 7 6 8M20 4c0 4-2 7-6 8M2 2c2 3 4 4 6 4M22 2c-2 3-4 4-6 4M12 10v4M10 14h4M9 18h6',
      aria: '暗夜蝠'
    },
    orc: {
      d: 'M12 3c-4 0-6 3-6 7s2 7 6 7 6-3 6-7-2-7-6-7zM6 5l-2-3M18 5l2-3M9 8h1M14 8h1M10 12h4M8 17c-3 1-4 3-4 5h16c0-2-1-4-4-5',
      aria: '兽人战士'
    },
    slime: {
      d: 'M12 6c-5 0-8 3-8 7s3 7 8 7 8-3 8-7-3-7-8-7zM9 10h1M14 10h1M10 14c1 1 3 1 4 0',
      aria: '史莱姆'
    },
    knight: {
      d: 'M12 3l-5 3v5c0 4 2 7 5 9 3-2 5-5 5-9V6l-5-3zM9 9h6M12 9v5M9 13h6',
      aria: '暗黑骑士'
    },
    darkMage: {
      d: 'M12 2l-3 6h6l-3-6zM9 8v4l3 2 3-2V8M7 14l5 4 5-4M12 18v4M8 22h8M15 5c2-1 4 0 5 2M9 5c-2-1-4 0-5 2',
      aria: '暗影法师'
    },
    dragon: {
      d: 'M12 4c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zM6 6c-2-1-4 0-4 2M18 6c2-1 4 0 4 2M8 12l-4 4M16 12l4 4M10 16l-2 5M14 16l2 5M12 12v4',
      aria: '幼龙'
    },
    golem: {
      d: 'M12 2L6 6v5l6 4 6-4V6l-6-4zM6 11l-3 5M18 11l3 5M9 15v5M15 15v5M6 16h12',
      aria: '岩石巨人'
    },

    forestGuardian: {
      d: 'M12 2L7 8v4l5 3 5-3V8l-5-6zM7 12l-4 6M17 12l4 6M9 15l-2 7M15 15l2 7M12 15v7M5 8c-3 1-4 3-3 6M19 8c3 1 4 3 3 6',
      aria: '森林守护者'
    },
    flameLord: {
      d: 'M12 2c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9zM10 8c-1 2-2 3-2 5M14 8c1 2 2 3 2 5M12 11v3M9 16c0 2 1 4 3 6 2-2 3-4 3-6',
      aria: '炎魔领主'
    },
    iceWitch: {
      d: 'M12 2l-4 5v6l4 3 4-3V7l-4-5zM8 7l-4-2M16 7l4-2M8 13l-4 3M16 13l4 3M12 16v6M9 22h6M10 10h4M12 10v3',
      aria: '冰霜女巫'
    },
    thunderTitan: {
      d: 'M12 2L6 8v4h3l-1 4h8l-1-4h3V8l-6-6zM9 16l-3 6M15 16l3 6M10 20h4',
      aria: '雷霆泰坦'
    },
    shadowKing: {
      d: 'M3 18l3-6 3 3 3-9 3 9 3-3 3 6M6 12V8c0-3 3-6 6-6s6 3 6 6v4M9 6h6M12 3v2',
      aria: '暗影之王'
    },

    gold: {
      d: 'M12 2L8 8h8L12 2zM8 8l-4 8h16l-4-8M4 16l8 6 8-6',
      aria: '金币'
    },
    gem: {
      d: 'M6 3h12l4 7-10 12L2 10l4-7zM6 3l6 19M18 3L12 22M2 10h20M6 3l6 7 6-7',
      aria: '宝石'
    },
    energy: {
      d: 'M13 2L4 14h7l-2 8 9-12h-7l2-8z',
      aria: '体力'
    },

    home: {
      d: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10',
      aria: '主页'
    },
    battle: {
      d: 'M14.5 17.5L3 6V3h3l11.5 11.5M9.5 12.5l-4 4M14.5 7.5l4-4M10 21h4M12 17v4',
      aria: '战斗'
    },
    shop: {
      d: 'M6 2L3 7v12a2 2 0 002 2h14a2 2 0 002-2V7l-3-5H6zM3 7h18M16 11a4 4 0 01-8 0',
      aria: '商店'
    },
    upgrade: {
      d: 'M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6l3-7z',
      aria: '养成'
    },
    social: {
      d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
      aria: '社交'
    },

    pause: {
      d: 'M6 4h4v16H6zM14 4h4v16h-4z',
      aria: '暂停'
    },
    play: {
      d: 'M5 3l14 9-14 9V3z',
      aria: '继续'
    },
    speed: {
      d: 'M13 19l7-7-7-7M5 19l7-7-7-7',
      aria: '加速'
    },
    upgradeAction: {
      d: 'M12 19V5M5 12l7-7 7 7',
      aria: '升级'
    },
    sell: {
      d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h6M9 14h6',
      aria: '出售'
    },
    skill: {
      d: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z',
      aria: '技能'
    },

    meteor: {
      d: 'M12 2c-4 0-7 3-7 7 0 2 1 4 3 5v4h8v-4c2-1 3-3 3-5 0-4-3-7-7-7zM9 18h6M10 21h4M17 3l4-1M19 7l3 2M3 3l4 1M2 9l3-2',
      aria: '陨石坠落'
    },
    freeze: {
      d: 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 2l1.5 3-1.5 1.5-1.5-1.5L12 2zM12 17l1.5 3-1.5 1.5-1.5-1.5L12 17z',
      aria: '冰封领域'
    },
    heal: {
      d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      aria: '生命恢复'
    },

    heart: {
      d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      aria: '生命值'
    },
    star: {
      d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      aria: '星级'
    },
    starEmpty: {
      d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      aria: '未获得星级',
      fill: false
    },
    lock: {
      d: 'M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2zM7 11V7a5 5 0 0110 0v4M12 16v2',
      aria: '锁定'
    },
    trophy: {
      d: 'M6 9H3V6a1 1 0 011-1h2M18 9h3V6a1 1 0 00-1-1h-2M6 5h12v7a6 6 0 01-12 0V5zM9 18h6M12 15v3',
      aria: '奖杯'
    },
    crown: {
      d: 'M3 18l3-6 3 3 3-9 3 9 3-3 3 6H3z',
      aria: '王冠'
    },

    chest: {
      d: 'M4 8h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V8zM4 8l2-4h12l2 4M12 8v13M8 8v13M16 8v13M2 8h20',
      aria: '宝箱'
    },
    potion: {
      d: 'M9 2h6v3l-1 1v3l3 4v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5l3-4V6L9 5V2zM11 6h2',
      aria: '药水'
    },
    bag: {
      d: 'M6 2h12l2 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6l2-4zM6 6h12M10 10v4M14 10v4M9 2v4M15 2v4',
      aria: '背包'
    },
    skin: {
      d: 'M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zM12 7a2 2 0 110 4 2 2 0 010-4z',
      aria: '皮肤'
    },
    map: {
      d: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v20M16 6v20',
      aria: '地图'
    },
    monthly: {
      d: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
      aria: '月卡'
    },

    friend: {
      d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zM16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      aria: '好友'
    },
    challenge: {
      d: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z',
      aria: '挑战'
    },
    share: {
      d: 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98',
      aria: '分享'
    },
    leaderboard: {
      d: 'M7 3h10v18H7V3zM3 9h4v12H3V9zM17 7h4v14h-4V7z',
      aria: '排行榜'
    },
    online: {
      d: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a4 4 0 110 8 4 4 0 010-8z',
      aria: '在线'
    },

    vs: {
      d: 'M7 5L3 19M17 5l4 14M5 12h14M7 5l5 7-5 7M17 5l-5 7 5 7',
      aria: '对战'
    },
    rank: {
      d: 'M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-6z',
      aria: '段位'
    },

    back: {
      d: 'M19 12H5M12 19l-7-7 7-7',
      aria: '返回'
    },
    close: {
      d: 'M18 6L6 18M6 6l12 12',
      aria: '关闭'
    },
    check: {
      d: 'M20 6L9 17l-5-5',
      aria: '确认'
    },
    settings: {
      d: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
      aria: '设置'
    },
    daily: {
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 014 0M9 5h6M9 14l2 2 4-4',
      aria: '每日任务'
    },
    checkin: {
      d: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
      aria: '签到'
    },
    video: {
      d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      aria: '视频广告'
    },

    tree: { d: 'M12 2L7 10h10L12 2zM7 10l-3 8h16l-3-8M12 18v4', aria: '树木' },
    rock: { d: 'M4 18l4-8 3 4 4-6 5 10H4z', aria: '岩石' },
    flower: { d: 'M12 7a3 3 0 110-6 3 3 0 010 6zM12 7v5M9 9l3 3 3-3M9 12h6M10 17l2-5 2 5M10 17l-2 4M14 17l2 4', aria: '花朵' },
    volcano: { d: 'M4 20l5-10 3 3 3-3 5 10H4zM12 2c-1 2-2 4-2 5s1 2 2 2 2-1 2-2-1-3-2-5z', aria: '火山' },
    iceCrystal: { d: 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19', aria: '冰晶' },

    entry: { d: 'M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3', aria: '入口' },
    exit: { d: 'M3 3h4M3 3v4M3 21h4M3 21v-4M21 3h-4M21 3v4M21 21h-4M21 21v-4M8 12h8M13 9l3 3-3 3', aria: '出口' },

    pierceArrow: { d: 'M5 12h14M13 5l6 7-6 7M5 12l6-7M5 12l6 7', aria: '穿透' },
    arrowRain: { d: 'M12 2v8M8 6v6M16 6v6M4 10v6M20 10v6M12 10v4M8 14h8l-4 8-4-8z', aria: '箭雨' },
    flameStorm: { d: 'M12 2c-3 4-6 6-6 10a6 6 0 0012 0c0-4-3-6-6-10zM10 8c-1 2-2 4-2 6M14 8c1 2 2 4 2 6', aria: '烈焰风暴' },
    burnTouch: { d: 'M12 2c-2 3-4 5-4 8a4 4 0 008 0c0-3-2-5-4-8zM10 7h4M12 10v3', aria: '灼烧' },
    frostDomain: { d: 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19', aria: '极寒' },
    freezeBind: { d: 'M12 2a5 5 0 100 10 5 5 0 000-10zM12 12v4M9 16h6M10 19h4', aria: '冰封' },
    thunderFury: { d: 'M13 2L4 14h7l-2 8 9-12h-7l2-8z', aria: '雷怒' },
    empPulse: { d: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2M12 2v4M12 18v4M2 12h4M18 12h4', aria: '电磁脉冲' },
    plagueSpread: { d: 'M12 2c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zM8 9h8M8 12h8M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2', aria: '瘟疫' },
    corrodeMist: { d: 'M12 2c-3 0-6 2-6 5s3 5 6 5 6-2 6-5-3-5-6-5zM8 12c-2 0-4 2-4 4s2 4 4 4M16 12c2 0 4 2 4 4s-2 4-4 4', aria: '腐蚀' },
    holyShield: { d: 'M12 2L4 7v5c0 5 3.5 9.74 8 11 4.5-1.26 8-6 8-11V7l-8-5zM9 12h6M12 9v6', aria: '圣盾' },
    judgment: { d: 'M12 2l-4 8h8l-4-8zM8 10l-4 6h16l-4-6M12 16v4M9 20h6', aria: '审判' },
    heavyCannon: { d: 'M5 12h14M19 8l4 4-4 4M5 8l-4 4 4 4M12 4v16', aria: '重炮' },
    rapidFire: { d: 'M5 12h14M12 5v14M8 8l4-4 4 4M8 16l4 4 4-4', aria: '速射' },
    soulReap: { d: 'M12 2c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zM9 8h6M12 11v4M8 20h8', aria: '灵魂收割' },
    shadowStrike: { d: 'M12 2L8 12h8L12 2zM8 12l-4 8M16 12l4 8M12 12v6', aria: '暗影突袭' },
    tornado: { d: 'M12 2c-3 0-6 2-6 4s3 4 6 4 6-2 6-4-3-4-6-4zM8 10c-2 1-4 3-4 5s2 4 4 4M16 10c2 1 4 3 4 5s-2 4-4 4M12 14v4', aria: '龙卷风' },
    target: { d: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a6 6 0 110 12 6 6 0 010-12zM12 10a2 2 0 110 4 2 2 0 010-4z', aria: '精准' },
    explosion: { d: 'M12 2l2 5 5-1-3 4 4 3-5 1 1 5-4-3-4 3 1-5-5-1 4-3-3-4 5 1-2-5z', aria: '爆炸' },
    cyclone: { d: 'M12 2C8 2 5 5 5 8s3 6 7 6 7-3 7-6-3-6-7-6zM8 14c-2 0-4 2-4 4s2 4 4 4M16 14c2 0 4 2 4 4s-2 4-4 4', aria: '旋风' }
  },

  get(name, size, color) {
    size = size || 24;
    color = color || 'currentColor';
    let def = this.defs[name];
    if (!def) return '';
    let key = name + '_' + size + '_' + color;
    if (this._cache[key]) return this._cache[key];
    let fillRule = def.fill === false ? 'none' : 'none';
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + fillRule + '" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="' + def.aria + '"><path d="' + def.d + '"/></svg>';
    this._cache[key] = svg;
    return svg;
  },

  getDataUri(name, color) {
    color = color || '%23E8ECF4';
    let def = this.defs[name];
    if (!def) return '';
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + def.d + '"/></svg>';
    return 'data:image/svg+xml,' + svg.replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23');
  },

  createImage(name, size, color) {
    size = size || 24;
    color = color || '#E8ECF4';
    let svg = this.get(name, size, color);
    let blob = new Blob([svg], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    let img = new Image();
    img.src = url;
    img.onload = () => URL.revokeObjectURL(url);
    return img;
  },

  preload(size, color) {
    size = size || 24;
    color = color || '#E8ECF4';
    let images = {};
    for (let name of Object.keys(this.defs)) {
      images[name] = this.createImage(name, size, color);
    }
    return images;
  },

  replaceInText(text, size, color) {
    return text.replace(/\[icon:(\w+)\]/g, (match, name) => {
      return this.get(name, size, color);
    });
  },

  init() {
    document.querySelectorAll('[data-icon]').forEach(el => {
      let name = el.getAttribute('data-icon');
      let size = parseInt(el.getAttribute('data-icon-size')) || 24;
      let color = el.getAttribute('data-icon-color') || 'currentColor';
      el.innerHTML = this.get(name, size, color);
      el.setAttribute('role', 'img');
      let def = this.defs[name];
      if (def) el.setAttribute('aria-label', def.aria);
    });
  }
};
