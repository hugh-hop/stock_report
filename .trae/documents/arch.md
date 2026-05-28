
# 消除达人 - 微信小游戏 - 技术架构文档

## 1. Architecture Design

```mermaid
graph TB
    subgraph "Frontend (Cocos Creator 3.8+)"
        A[GameManager]
        B[DataManager]
        C[AudioManager]
        D[LevelManager]
        E[GridManager]
        F[AdManager]
        G[SocialManager]
        H[UI System]
        
        A --&gt; B
        A --&gt; C
        A --&gt; D
        D --&gt; E
        A --&gt; F
        A --&gt; G
        A --&gt; H
    end
    
    subgraph "Data Layer"
        I[Local Storage]
        J[WeChat Cloud Development]
    end
    
    subgraph "External Services"
        K[WeChat Ads]
        L[WeChat Share]
    end
    
    B --&gt; I
    G --&gt; J
    F --&gt; K
    G --&gt; L
```

## 2. Technology Description

- **游戏引擎**：Cocos Creator 3.8+
- **开发语言**：TypeScript 3.x
- **目标平台**：微信小游戏
- **物理引擎**：Cocos 2D 内置
- **后端服务**：微信云开发
- **广告平台**：微信广告（优量汇）

## 3. Scene Definitions

| Scene Name | Purpose |
|------------|---------|
| Start | 开始界面 |
| LevelSelect | 关卡选择界面 |
| Game | 游戏主界面 |
| Result | 结算界面 |

## 4. Core Manager Classes

### 4.1 GameManager
```typescript
class GameManager {
  static instance: GameManager;
  currentScene: string;
  currentLevel: number;
  
  init(): void;
  changeScene(sceneName: string): void;
  startLevel(level: number): void;
  endLevel(success: boolean): void;
}
```

### 4.2 DataManager
```typescript
class DataManager {
  static instance: DataManager;
  
  highestLevel: number;
  coins: number;
  props: {
    tips: number;
    remove: number;
    addtime: number;
  };
  stars: Record&lt;number, number&gt;;
  achievements: Record&lt;string, boolean&gt;;
  
  load(): void;
  save(): void;
  getStars(level: number): number;
  setStars(level: number, stars: number): void;
  addCoins(amount: number): void;
  useProp(type: string): boolean;
}
```

### 4.3 LevelManager
```typescript
class LevelManager {
  static instance: LevelManager;
  
  getLevelConfig(level: number): LevelConfig;
  getGridSize(level: number): number;
  getIconCount(level: number): number;
  getTimeLimit(level: number): number;
  getTargetPairs(level: number): number;
}

interface LevelConfig {
  gridSize: number;
  iconCount: number;
  timeLimit: number;
  targetPairs: number;
}
```

### 4.4 GridManager
```typescript
class GridManager {
  gridSize: number;
  grid: GridItem[][];
  selectedItem: GridItem | null;
  targetPairs: number;
  eliminatedPairs: number;
  
  init(gridSize: number, iconCount: number, targetPairs: number): void;
  generateGrid(): void;
  selectItem(item: GridItem): void;
  tryEliminate(item1: GridItem, item2: GridItem): boolean;
  checkWin(): boolean;
  findHint(): [GridItem, GridItem] | null;
}

interface GridItem {
  iconType: number;
  x: number;
  y: number;
  node: cc.Node;
}
```

### 4.5 AdManager
```typescript
class AdManager {
  static instance: AdManager;
  
  rewardedVideoAd: any;
  
  init(): void;
  showRewardedVideo(adType: string, callback: (success: boolean) =&gt; void): void;
  canShowAd(): boolean;
}
```

### 4.6 AudioManager
```typescript
class AudioManager {
  static instance: AudioManager;
  
  musicEnabled: boolean;
  soundEnabled: boolean;
  
  init(): void;
  playMusic(name: string): void;
  stopMusic(): void;
  playSound(name: string): void;
}
```

### 4.7 SocialManager
```typescript
class SocialManager {
  static instance: SocialManager;
  
  share(level: number, success: boolean, stars: number): void;
  getRankList(): Promise&lt;any[]&gt;;
  submitScore(level: number, stars: number): Promise&lt;void&gt;;
}
```

## 5. Project Structure

```
elimination-master/
├── assets/
│   ├── scenes/
│   │   ├── Start.scene
│   │   ├── LevelSelect.scene
│   │   ├── Game.scene
│   │   └── Result.scene
│   ├── scripts/
│   │   ├── managers/
│   │   │   ├── GameManager.ts
│   │   │   ├── DataManager.ts
│   │   │   ├── LevelManager.ts
│   │   │   ├── GridManager.ts
│   │   │   ├── AdManager.ts
│   │   │   ├── AudioManager.ts
│   │   │   └── SocialManager.ts
│   │   ├── ui/
│   │   │   ├── StartUI.ts
│   │   │   ├── LevelSelectUI.ts
│   │   │   ├── GameUI.ts
│   │   │   └── ResultUI.ts
│   │   ├── game/
│   │   │   ├── GridItem.ts
│   │   │   └── PropButton.ts
│   │   └── utils/
│   │       └── Constants.ts
│   ├── prefabs/
│   │   ├── GridItem.prefab
│   │   ├── LevelItem.prefab
│   │   └── Star.prefab
│   ├── textures/
│   │   ├── icons/
│   │   ├── ui/
│   │   └── backgrounds/
│   ├── audio/
│   │   ├── music/
│   │   └── sounds/
│   └── data/
│       └── LevelConfig.json
├── settings/
├── project.json
└── README.md
```

## 6. Data Model

### 6.1 Local Storage Schema

| Key | Type | Description |
|-----|------|-------------|
| highestLevel | number | 最高通关关卡 |
| coins | number | 金币数量 |
| props_tips | number | 提示道具数量 |
| props_remove | number | 移除道具数量 |
| props_addtime | number | 加时道具数量 |
| stars_{level} | number | 单关星级(1-3) |
| last_login_date | string | 最后登录日期 |
| login_days | number | 连续登录天数 |
| achievements | object | 成就完成标记 |

### 6.2 Level Configuration

```json
[
  {
    "level": 1,
    "gridSize": 4,
    "iconCount": 4,
    "timeLimit": 60,
    "targetPairs": 8
  },
  {
    "level": 6,
    "gridSize": 4,
    "iconCount": 5,
    "timeLimit": 50,
    "targetPairs": 10
  },
  {
    "level": 11,
    "gridSize": 5,
    "iconCount": 6,
    "timeLimit": 45,
    "targetPairs": 15
  }
]
```

### 6.3 WeChat Cloud Database Collections

**users**
```json
{
  "_id": "user_openid",
  "nickname": "玩家昵称",
  "avatarUrl": "头像URL",
  "highestLevel": 10,
  "totalStars": 25,
  "createTime": "2024-01-01T00:00:00.000Z"
}
```

**leaderboard**
```json
{
  "_id": "record_id",
  "userId": "user_openid",
  "level": 10,
  "stars": 3,
  "score": 100,
  "updateTime": "2024-01-01T00:00:00.000Z"
}
```
