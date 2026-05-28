
# 消除达人 - 微信小游戏

一款基于 Cocos Creator 3.x 开发的休闲消除类微信小游戏。

## 项目简介

《消除达人》是一款面向 15-45 岁休闲游戏玩家的三消+拼图玩法限时消除微信小游戏，通过激励视频广告实现商业变现。

## 核心功能

- ✅ 999 个关卡
- ✅ 限时消除玩法
- ✅ 星级评价系统
- ✅ 道具系统（提示、移除、加时）
- ✅ 激励视频广告
- ✅ 每日登录奖励
- ✅ 好友排行榜
- ✅ 分享功能

## 技术栈

- **游戏引擎**: Cocos Creator 3.8+
- **开发语言**: TypeScript
- **目标平台**: 微信小游戏
- **后端服务**: 微信云开发
- **广告平台**: 微信广告（优量汇）

## 项目结构

```
elimination-master/
├── .trae/documents/          # 项目文档
│   ├── prd.md               # 产品需求文档
│   └── arch.md              # 技术架构文档
├── assets/
│   ├── scenes/                # 场景文件
│   ├── scripts/             # 脚本文件
│   │   ├── managers/         # 管理器类
│   │   │   ├── GameManager.ts
│   │   │   ├── DataManager.ts
│   │   │   ├── LevelManager.ts
│   │   │   ├── GridManager.ts
│   │   │   ├── AdManager.ts
│   │   │   ├── AudioManager.ts
│   │   │   └── SocialManager.ts
│   │   ├── ui/              # UI 脚本
│   │   │   ├── StartUI.ts
│   │   │   ├── LevelSelectUI.ts
│   │   │   ├── GameUI.ts
│   │   │   └── ResultUI.ts
│   │   ├── game/             # 游戏逻辑
│   │   │   └── GridItem.ts
│   │   └── utils/            # 工具类
│   │       └── Constants.ts
│   ├── prefabs/             # 预制体
│   ├── textures/             # 纹理资源
│   ├── audio/                # 音频资源
│   └── data/                # 配置数据
│       └── LevelConfig.json
├── settings/                # 项目设置
└── README.md
```

## 快速开始

### 环境要求

- Cocos Creator 3.8 或更高版本
- 微信开发者工具
- Node.js 14+

### 安装步骤

1. **克隆项目
2. 使用 Cocos Creator 打开项目
3. 配置微信小游戏项目
4. 配置微信广告位 ID
5. 构建并发布到微信小游戏平台

### 配置说明

在 `assets/scripts/managers/AdManager.ts` 中配置您的广告位 ID：

```typescript
const rewardedVideoAd = wx.createRewardedVideoAd({
  adUnitId: 'your_ad_unit_id'  // 替换为您的广告位 ID
});
```

## 核心管理器说明

### GameManager
游戏主管理器，负责游戏流程控制、场景切换等。

### DataManager
数据管理器，负责本地数据的存储和读取。

### LevelManager
关卡管理器，负责关卡配置和难度管理。

### GridManager
网格管理器，负责游戏网格的生成、消除逻辑等。

### AdManager
广告管理器，负责激励视频广告的加载和展示。

### AudioManager
音频管理器，负责背景音乐和音效的播放。

### SocialManager
社交管理器，负责分享和排行榜功能。

## 关卡配置

关卡配置文件位于 `assets/data/LevelConfig.json`，支持自定义关卡难度。

## 许可证

MIT License

## 联系方式

如有问题，请联系开发者。

---

**注意**: 这是一个完整的游戏代码结构，实际使用时需要在 Cocos Creator 中创建场景、预制体和资源。
