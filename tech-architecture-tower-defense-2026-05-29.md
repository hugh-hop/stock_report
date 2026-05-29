# 塔防觉醒 — 技术架构与开发方案

> 版本：v1.0 | 日期：2025-07 | 编写：数析（Metric）
> 定位：3分钟一局的社交策略塔防 | 平台：微信小游戏(P0) + PC小游戏(P1)

---

## 目录

1. [技术选型与论证](#1-技术选型与论证)
2. [整体架构设计](#2-整体架构设计)
3. [核心模块详细设计](#3-核心模块详细设计)
4. [数据存储与同步](#4-数据存储与同步)
5. [变现技术实现](#5-变现技术实现)
6. [性能优化方案](#6-性能优化方案)
7. [动画与特效系统](#7-动画与特效系统)
8. [音频系统](#8-音频系统)
9. [测试方案](#9-测试方案)
10. [构建与发布](#10-构建与发布)
11. [项目排期](#11-项目排期)
12. [风险评估与缓解](#12-风险评估与缓解)

---

## 1. 技术选型与论证

### 1.1 游戏引擎选型

| 维度 | Cocos Creator 3.x | LayaAir 3.x | Egret |
|------|-------------------|-------------|-------|
| **微信小游戏支持** | 原生适配，官方合作引擎，首发支持新特性 | 支持良好，3D性能突出 | 已停止维护，社区萎缩 |
| **2D渲染性能** | 优秀，GPU Instancing + 动态合批 | 优秀，WebGL 2.0优化 | 中等，Canvas/WebGL混合 |
| **包体控制** | 引擎裁剪后约1.2MB（空项目），分包成熟 | 引擎约0.9MB，极致压缩 | 引擎约1.5MB，裁剪困难 |
| **对象池支持** | 内置 NodePool + 自定义扩展 | 需自行实现 | 需自行实现 |
| **Spine动画** | 官方插件，性能优秀 | 官方支持 | 社区插件，性能差 |
| **物理引擎** | 内置 Box2D / Bullet | 内置 | 需第三方 |
| **组件化开发** | 成熟的ECS组件系统 | 脚本模式为主 | 显示对象继承模式 |
| **TypeScript支持** | 原生TS，类型完善 | 原生TS | AS3→TS迁移路径差 |
| **社区与生态** | 国内最大游戏引擎社区，微信官方推荐 | 社区活跃，3D生态好 | 社区萎缩，文档陈旧 |
| **PC发布** | 原生支持 Web/Desktop | 支持 | 支持 |
| **热更新** | 原生支持 Hot Update | 支持 | 需自建 |
| **学习曲线** | 中等，文档完善 | 中等偏高 | 低但过时 |
| **长期维护** | 积极迭代，Cocos官方投入大 | 积极迭代 | ⚠️ 已停止维护 |

#### 🏆 推荐选型：Cocos Creator 3.8.x

**推荐理由：**

1. **微信小游戏首选引擎**：Cocos与微信官方深度合作，新平台特性第一时间适配，审核通过率高
2. **包体控制优势**：引擎裁剪后空项目仅~1.2MB，为4MB首包约束留出充足空间；内置分包加载方案成熟
3. **2D+轻量3D兼顾**：塔防需要2D战场+3D塔展示，Cocos 3.x统一渲染管线，2D/3D无缝混合
4. **组件化架构天然适配**：防御塔/敌人/Buff等天然适合ECS组件化，代码复用率高
5. **对象池内置**：NodePool+自定义对象池满足50同屏单位的创建/销毁需求
6. **Spine动画性能优秀**：8种塔+9种敌人均需骨骼动画，Spine官方插件+GPU蒙皮优化
7. **生态成熟**：国内开发者社区最大，遇到问题可快速找到解决方案
8. **长期保障**：Cocos公司持续投入，版本迭代活跃，不会出现Egret式断更风险

### 1.2 开发语言与工具链

| 类别 | 选型 | 说明 |
|------|------|------|
| 主开发语言 | TypeScript 5.x | 强类型+装饰器，组件开发体验好 |
| 构建工具 | Cocos Dashboard + 内置构建 | 引擎集成，零配置 |
| 包管理 | npm + Cocos Store | 第三方库npm管理，引擎插件Store |
| 代码规范 | ESLint + Prettier + husky | 提交前自动检查 |
| 调试工具 | Chrome DevTools + Cocos DevTools | 微信开发者工具联合调试 |
| 性能分析 | Cocos Profiler + 微信性能面板 | 实时FPS/DrawCall/内存监控 |
| UI设计协作 | Figma → Cocos Prefab | 设计稿标注→预制体 |

### 1.3 版本控制与CI/CD

```
Git Workflow（Git Flow 变体）：
├── main          — 稳定发布分支
├── develop       — 日常开发集成分支
├── feature/*     — 功能分支（如 feature/tower-fusion）
├── hotfix/*      — 紧急修复分支
└── release/*     — 发版准备分支

CI/CD Pipeline：
代码提交 → ESLint检查 → 单元测试 → 构建验证 → 自动提审(微信) → 通知结果
```

| 工具 | 用途 |
|------|------|
| Git + GitLab/Bitbucket | 版本控制（私有部署） |
| Jenkins / GitHub Actions | CI/CD流水线 |
| 微信CI工具 (miniprogram-ci) | 自动化提审 |
| SonarQube | 代码质量门禁 |
|蒲公英/fir.im | 测试包分发 |

---

## 2. 整体架构设计

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                     表现层 (Presentation)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  UI系统  │ │ 动画系统 │ │ 特效系统 │ │  音频系统  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
├───────┼────────────┼────────────┼──────────────┼────────┤
│       │         逻辑层 (Logic)  │              │        │
│  ┌────▼─────────────▼───────────▼──────────────▼─────┐  │
│  │                  游戏管理器 (GameMgr)              │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ │  │
│  │  │战斗系统│ │塔系统  │ │Rogue系 │ │ PVP系统    │ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────────┘ │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ │  │
│  │  │关卡系统│ │经济系统│ │社交系统│ │ 变现系统   │ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────────┘ │  │
│  └───────────────────┬───────────────────────────────┘  │
├──────────────────────┼──────────────────────────────────┤
│                  数据层 (Data)                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│  │本地存储   │ │云存储     │ │配置数据   │             │
│  │(wx storage)│ │(云开发)  │ │(JSON/TS)  │             │
│  └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 模块划分与职责

| 模块 | 职责 | 对外接口 |
|------|------|---------|
| **GameMgr** | 全局游戏生命周期管理，模块调度中心 | init(), startBattle(), pause(), resume() |
| **BattleSystem** | 战斗状态机、波次管理、伤害计算 | onBattleStart(), onWaveEnd(), onBattleEnd() |
| **TowerSystem** | 塔创建/升级/融合/技能 | createTower(), upgradeTower(), fuseTowers() |
| **EnemySystem** | 敌人生成/寻路/状态 | spawnEnemy(), onEnemyDeath(), getPath() |
| **RogueSystem** | Buff池/随机选择/叠加规则 | rollBuffs(), applyBuff(), getActiveBuffs() |
| **PVPSystem** | 匹配/同步/断线重连 | match(), syncState(), onDisconnect() |
| **LevelSystem** | 关卡加载/地图/环境机制 | loadLevel(), getMapData() |
| **EconSystem** | 资源管理/养成计算/商店 | spend(), earn(), calculateStats() |
| **SocialSystem** | 好友/分享/排行榜/体力 | share(), inviteFriend(), sendGift() |
| **MonetizeSystem** | 广告/支付/防刷 | showRewardAd(), purchase(), verifyOrder() |
| **ResMgr** | 资源加载/释放/预加载 | preload(), load(), release() |
| **PoolMgr** | 对象池管理 | get(), put(), clear() |
| **AudioMgr** | 音频播放/切换/资源管理 | playBGM(), playSFX(), stopAll() |
| **UIMgr** | UI栈管理/动画/遮罩 | open(), close(), showToast() |
| **SaveMgr** | 存档/读档/云同步 | save(), load(), syncToCloud() |

### 2.3 模块间通信机制

**核心方案：全局事件总线 + 直接引用混合模式**

```
通信层级：
├── 跨系统通信 → 事件总线 (EventBus) —— 解耦，一对多
├── 系统内通信 → 直接方法调用 —— 性能，零开销
└── UI↔Logic通信 → 事件总线 —— 表现层与逻辑层解耦
```

**EventBus 设计：**

```typescript
// 装饰器式事件监听，编译期类型检查
class BattleSystem {
    @OnEvent(EventType.WAVE_END)
    onWaveEnd(data: WaveEndData) { ... }
}

// 发射事件
EventBus.emit(EventType.WAVE_END, { waveIndex: 3, rewards: [...] });
```

**事件清单（关键事件）：**

| 事件名 | 触发时机 | 订阅者 |
|--------|---------|--------|
| BATTLE_START | 战斗开始 | TowerSys, EnemySys, AudioMgr |
| WAVE_END | 波次结束 | BattleSys, RogueSys, UIMgr |
| ROGUE_CHOOSE | 选择Rogue Buff | BattleSys, TowerSys |
| TOWER_PLACED | 放置防御塔 | BattleSys, AudioMgr |
| TOWER_UPGRADED | 塔升级 | BattleSys, UIMgr |
| TOWER_FUSED | 双塔融合 | BattleSys, VFXMgr |
| ENEMY_DEATH | 敌人死亡 | EconSys, BattleSys |
| BOSS_DEATH | Boss死亡 | BattleSys, AudioMgr, UIMgr |
| BATTLE_END | 战斗结束 | EconSys, SocialSys, UIMgr |
| PVP_MATCHED | PVP匹配成功 | PVPSys, UIMgr |
| PVP_SYNC | PVP状态同步 | PVPSys |
| COIN_CHANGE | 金币变化 | UIMgr |
| AD_REWARD | 广告奖励发放 | EconSys |

### 2.4 核心设计模式

| 设计模式 | 应用场景 | 理由 |
|----------|---------|------|
| **状态机 (FSM)** | 战斗状态流转、塔AI状态 | 流转逻辑清晰，易扩展 |
| **对象池 (Object Pool)** | 塔实例/敌人/弹道/特效 | 减少GC，保证60fps |
| **观察者 (Observer)** | 事件总线，UI数据绑定 | 模块解耦 |
| **策略 (Strategy)** | 敌人AI行为、塔攻击模式 | 行为可替换，易扩展新敌人 |
| **命令 (Command)** | 塔放置/撤销、操作回放 | PVP帧同步基础 |
| **工厂 (Factory)** | 塔/敌人/Buff创建 | 统一创建逻辑，便于对象池管理 |
| **单例 (Singleton)** | 全局管理器 (GameMgr等) | 全局唯一访问点 |

---

## 3. 核心模块详细设计

### 3.1 游戏引擎层

#### 3.1.1 渲染管线设计

```
渲染流程（每帧）：
1. 视锥剔除 → 剔除屏幕外节点
2. 脏标记检测 → 只更新变化的节点
3. 合批渲染 → 同材质节点合并DrawCall
4. 分层渲染：
   Layer 0: 地图背景（静态，不每帧重绘）
   Layer 1: 路径/网格（低频更新）
   Layer 2: 防御塔（中频更新）
   Layer 3: 敌人+血条（高频更新，合批重点）
   Layer 4: 弹道/特效（高频更新，GPU粒子）
   Layer 5: UI层（独立Canvas，不与游戏场景合批）
```

**DrawCall预算：**

| 类别 | 预算 | 说明 |
|------|------|------|
| 地图 | ≤5 | 静态合批 |
| 防御塔 | ≤15 | 8塔×平均2DC（本体+特效） |
| 敌人+血条 | ≤10 | 合批渲染 |
| 弹道+特效 | ≤10 | GPU粒子为主 |
| UI | ≤20 | 独立Canvas |
| **总计** | **≤60** | 留10个DC余量 |

#### 3.1.2 场景管理器

```typescript
class SceneMgr {
    // 场景栈，支持返回
    private sceneStack: string[] = [];

    // 预加载场景（在Loading界面预加载下一场景资源）
    async preloadScene(sceneName: string): Promise<void>;

    // 切换场景（带过渡动画）
    async switchScene(sceneName: string, transition?: TransitionType): Promise<void>;

    // 推入场景（如从主城进入战斗）
    async pushScene(sceneName: string): Promise<void>;

    // 弹出场景（如从战斗返回主城）
    async popScene(): Promise<void>;
}

// 场景清单
enum SceneType {
    LAUNCH = 'Launch',         // 启动场景（极简，<500KB）
    MAIN_MENU = 'MainMenu',   // 主菜单
    MODE_SELECT = 'ModeSelect',// 模式选择
    BATTLE = 'Battle',        // 战斗场景（核心）
    PVP_LOBBY = 'PVPLobby',   // PVP大厅
    SHOP = 'Shop',            // 商店
    SETTINGS = 'Settings',    // 设置
}
```

#### 3.1.3 资源管理器

```
资源加载策略：
┌──────────────────────────────────────────────────┐
│ 首包资源（≤4MB）                                  │
│ ├── 启动界面 + 主菜单UI                           │
│ ├── 通用框架资源（按钮/字体/通用特效）             │
│ ├── 基础防御塔资源（前4种塔的静态资源）            │
│ └── 新手关卡资源                                  │
├──────────────────────────────────────────────────┤
│ 分包1：战斗核心（~3MB）                           │
│ ├── 全部8种防御塔资源                             │
│ ├── 全部9种敌人资源                               │
│ ├── 战斗场景UI                                    │
│ └── Rogue选择界面                                 │
├──────────────────────────────────────────────────┤
│ 分包2：PVP模块（~2MB）                            │
│ ├── PVP专用UI                                     │
│ ├── ELO/段位资源                                  │
│ └── PVP特效                                      │
├──────────────────────────────────────────────────┤
│ 分包3：高级内容（~4MB）                            │
│ ├── Boss动画                                      │
│ ├── 高级关卡地图                                  │
│ ├── 融合塔特效                                    │
│ └── 稀有皮肤资源                                  │
├──────────────────────────────────────────────────┤
│ 分包4：社交+商店（~3MB）                          │
│ ├── 商店UI + 商品资源                             │
│ ├── 排行榜/好友界面                               │
│ └── 分享卡片模板                                  │
├──────────────────────────────────────────────────┤
│ 远程资源（CDN按需加载）                            │
│ ├── Spine动画文件（.skel/.atlas/.png）            │
│ ├── 活动限定资源                                  │
│ └── 语音包                                       │
└──────────────────────────────────────────────────┘
```

```typescript
class ResMgr {
    // 引用计数式资源管理
    private refCounts: Map<string, number> = new Map();

    // 预加载（Loading界面调用）
    async preloadBatch(keys: string[], onProgress?: (p: number) => void): Promise<void>;

    // 加载单个资源（自动增加引用计数）
    async load<T extends Asset>(key: string): Promise<T>;

    // 批量加载
    async loadBatch<T extends Asset>(keys: string[]): Promise<T[]>;

    // 释放资源（引用计数-1，归零时真正释放）
    release(key: string): void;

    // 释放场景所有资源
    releaseScene(sceneName: string): void;

    // 内存警告时紧急释放
    onMemoryWarning(): void;
}
```

#### 3.1.4 对象池系统

```typescript
class PoolMgr {
    private pools: Map<string, NodePool> = new Map();

    // 初始化对象池（预创建对象）
    initPool(poolName: string, prefab: Prefab, initSize: number): void;

    // 获取对象（池中无则新建）
    get(poolName: string): Node;

    // 归还对象（重置状态后放回池中）
    put(poolName: string, node: Node): void;

    // 清空指定池
    clear(poolName: string): void;

    // 内存警告时缩小池
    shrink(poolName: string, retainCount: number): void;
}

// 对象池配置
const PoolConfig = {
    tower:      { initSize: 8,  maxSize: 20 },   // 防御塔
    enemy:      { initSize: 20, maxSize: 50 },   // 敌人
    bullet:     { initSize: 30, maxSize: 100 },  // 弹道
    vfx:        { initSize: 15, maxSize: 40 },   // 特效
    damageNum:  { initSize: 10, maxSize: 30 },   // 伤害数字
    hpBar:      { initSize: 15, maxSize: 50 },   // 血条
};

// 归还时自动重置
// 每个池化对象实现 IPoolable 接口
interface IPoolable {
    reset(): void;  // 重置位置/状态/组件数据
}
```

### 3.2 战斗系统

#### 3.2.1 战斗状态机

```
战斗状态流转图：

  ┌─────────┐
  │  INIT   │ ← 进入战斗场景
  └────┬────┘
       │ onBattleStart()
  ┌────▼────┐
  │ DEPLOY  │ ← 布阵阶段（20秒/PVP15秒）
  └────┬────┘
       │ onDeployEnd()
  ┌────▼────┐     ┌─────────┐
  │ WAVE_1  │────►│ ROGUE_1 │ ← 第1波结束 → 三选一
  └────┬────┘     └────┬────┘
       │               │ onRogueChosen()
  ┌────▼────┐     ┌─────────┐
  │ WAVE_2  │────►│ ROGUE_2 │ ← 第2波结束 → 三选一
  └────┬────┘     └────┬────┘
       │               │ onRogueChosen()
  ┌────▼────┐
  │ WAVE_3  │ ← 第3波
  └────┬────┘
       │ onWave3End()
  ┌────▼────┐
  │  BOSS   │ ← Boss波
  └────┬────┘
       │ onBossDefeated() / onBaseDestroyed()
  ┌────▼────┐
  │ RESULT  │ ← 结算
  └─────────┘
```

```typescript
enum BattleState {
    INIT = 'Init',
    DEPLOY = 'Deploy',
    WAVE = 'Wave',         // 通用波次状态
    ROGUE = 'Rogue',       // Rogue选择状态
    BOSS = 'Boss',         // Boss波
    RESULT = 'Result',     // 结算
    PAUSED = 'Paused',     // 暂停
}

class BattleFSM {
    private state: BattleState = BattleState.INIT;
    private stateMap: Map<BattleState, IBattleState>;

    // 状态切换（自动触发enter/exit）
    changeState(newState: BattleState, data?: any): void;

    // 每帧更新（委托给当前状态）
    update(dt: number): void;
}

// 每个状态实现统一接口
interface IBattleState {
    enter(data?: any): void;
    update(dt: number): void;
    exit(): void;
}
```

#### 3.2.2 防御塔AI系统

```typescript
class TowerAI {
    private state: TowerAIState;
    private target: Enemy | null;
    private attackTimer: number = 0;

    update(dt: number) {
        switch (this.state) {
            case TowerAIState.IDLE:
                this.onIdle(dt);
                break;
            case TowerAIState.SEEKING:
                this.onSeeking(dt);
                break;
            case TowerAIState.ATTACKING:
                this.onAttacking(dt);
                break;
            case TowerAIState.CASTING:
                this.onCasting(dt);
                break;
        }
    }

    // 索敌算法（每0.5秒执行一次，非每帧）
    private seekTimer: number = 0;
    onSeeking(dt: number) {
        this.seekTimer += dt;
        if (this.seekTimer >= 0.5) {
            this.seekTimer = 0;
            this.target = this.findTarget();
        }
    }

    // 索敌策略（策略模式，不同塔不同策略）
    findTarget(): Enemy | null {
        return this.targetStrategy.find(
            this.tower.position,
            this.tower.range,
            this.enemyMgr.getEnemiesInRange(this.tower.position, this.tower.range)
        );
    }
}

// 索敌策略
enum TargetStrategy {
    FIRST = 'First',       // 最先到达终点
    LAST = 'Last',         // 最后到达终点
    STRONGEST = 'Strongest',// 血量最高
    WEAKEST = 'Weakest',   // 血量最低
    NEAREST = 'Nearest',   // 距离最近
    GROUP = 'Group',       // 范围AOE优先密集区
}

// 攻击流程
// 1. 索敌(0.5s间隔) → 2. 确认目标 → 3. 攻击CD判定 → 4. 创建弹道/即时伤害 → 5. 触发特效 → 回到2
```

#### 3.2.3 敌人寻路系统

**推荐方案：预计算路径点 + 局部A\*避障**

```
寻路策略分层：
┌─────────────────────────────────────────────┐
│ 全局路径：预计算的路径点（Waypoint）         │
│ → 地图编辑器中预设，运行时直接使用           │
│ → 0性能开销                                  │
├─────────────────────────────────────────────┤
│ 局部避障：A* 小范围寻路                      │
│ → 仅当路径被防御塔/技能阻挡时触发            │
│ → 限制搜索范围8×8网格，≤2ms计算              │
├─────────────────────────────────────────────┤
│ 流场（Flow Field）：大量同路径敌人共享       │
│ → 每帧只计算一次流场，所有敌人跟随           │
│ → 50个敌人共享同一流场，CPU开销O(1)         │
└─────────────────────────────────────────────┘
```

```typescript
class PathfindingMgr {
    // 预计算路径（地图加载时计算流场）
    private flowField: Grid<Direction>;

    // 初始化流场（一次计算，所有敌人共享）
    initFlowField(mapData: MapData): void {
        // BFS从终点反向扩散，每个格子记录指向终点的方向
        // O(W×H) 一次性计算
    }

    // 获取移动方向（O(1)查询）
    getDirection(pos: Vec2): Direction {
        return this.flowField.get(pos);
    }

    // 局部避障（塔阻挡时触发）
    findLocalPath(from: Vec2, to: Vec2, obstacles: Set<Vec2>): Vec2[] {
        // 限制A*搜索深度≤16步
        // 超出则绕路惩罚（减速通过）
    }
}
```

**性能保障：**
- 流场计算：地图加载时一次性完成，运行时O(1)查询
- 50个敌人同帧寻路：<0.5ms
- 局部避障触发率：<5%（大部分敌人走预计算路径）

#### 3.2.4 弹道系统

```typescript
enum BulletType {
    DIRECT = 'Direct',     // 直线弹道（弓箭塔）
    HOMING = 'Homing',     // 追踪弹道（法术塔）
    ARC = 'Arc',           // 抛物线（炮塔）
    AOE = 'AOE',           // 范围伤害（无弹道，即时）
    CHAIN = 'Chain',       // 链式弹道（闪电塔）
}

class Bullet {
    type: BulletType;
    target: Enemy | null;
    startPos: Vec2;
    speed: number;
    damage: DamageInfo;
    // 弹道池化管理，不每帧new
}

// 弹道更新（每帧）
// 1. 直线弹道：向目标方向移动，到达后命中
// 2. 追踪弹道：每帧修正方向追踪目标，目标死亡则选最近敌人
// 3. 抛物线：预计算贝塞尔曲线，沿曲线移动
// 4. AOE：即时在目标区域播放特效+计算伤害
// 5. 链式：命中后跳转范围内下一个目标（最多3跳）
```

#### 3.2.5 伤害计算引擎

```typescript
class DamageEngine {
    // 伤害计算公式
    calculateDamage(attacker: DamageSource, defender: Enemy, context: BattleContext): DamageResult {
        let damage = attacker.baseDamage;

        // 1. 攻击加成（塔等级+Rogue Buff+天赋）
        damage *= this.getAttackMultiplier(attacker);

        // 2. 属性克制
        damage *= this.getElementMultiplier(attacker.element, defender.element);

        // 3. 暴击判定
        const isCrit = Math.random() < attacker.critRate;
        if (isCrit) damage *= attacker.critMultiplier;

        // 4. 防御减伤
        damage *= 1 - (defender.armor / (defender.armor + 100));

        // 5. Rogue Buff叠加
        for (const buff of context.activeBuffs) {
            damage = buff.modifyDamage(damage, attacker, defender);
        }

        // 6. 最小伤害保底
        damage = Math.max(1, Math.floor(damage));

        return { damage, isCrit, element: attacker.element };
    }

    // 伤害数字飘字（对象池）
    showDamageNumber(pos: Vec2, result: DamageResult): void {
        const numNode = PoolMgr.get('damageNum');
        // 设置数值/颜色/大小
        // 1秒后自动回池
    }
}
```

#### 3.2.6 波次管理器

```typescript
interface WaveData {
    waveIndex: number;
    enemyGroups: EnemyGroup[];  // 敌人编组
    spawnInterval: number;      // 生成间隔
    bossId?: string;            // Boss波专属
}

interface EnemyGroup {
    enemyId: string;
    count: number;
    spawnDelay: number;    // 组间延迟
    pathIndex: number;     // 路径编号（多路径地图）
}

class WaveMgr {
    private currentWave: number = 0;
    private spawnQueue: EnemyGroup[] = [];
    private adaptiveDifficulty: number = 1.0; // 自适应难度系数

    // 开始波次
    startWave(waveIndex: number): void;

    // 生成逻辑（每帧检查生成队列）
    update(dt: number): void;

    // 自适应难度（根据玩家表现动态调整）
    adjustDifficulty(): void {
        // 基地剩余血量 > 80% → 难度+15%
        // 基地剩余血量 < 30% → 难度-15%
        // 连续3波0漏怪 → 难度+10%
        // 连续3波有漏怪 → 难度-10%
    }

    // 波次结束判定
    isWaveEnd(): boolean {
        return this.spawnQueue.length === 0 && this.enemyMgr.aliveCount === 0;
    }
}
```

### 3.3 防御塔系统

#### 3.3.1 塔数据结构

```typescript
// 塔基础数据（静态配置）
interface TowerData {
    id: string;                    // 塔ID，如 "archer_tower"
    name: string;                  // 显示名
    element: ElementType;          // 属性：火/冰/雷/毒/物理
    baseStats: TowerStats;         // 基础属性
    attackType: BulletType;        // 攻击类型
    targetStrategy: TargetStrategy;// 索敌策略
    upgradeBranches: [TowerBranch, TowerBranch]; // 二选一分支
    skills: TowerSkill[];          // 技能列表
    cost: number;                  // 建造费用
    spineId: string;               // Spine动画ID
}

interface TowerStats {
    damage: number;
    attackSpeed: number;   // 攻击/秒
    range: number;         // 攻击范围（像素）
    critRate: number;      // 暴击率
    critMultiplier: number;// 暴击倍率
}

// 升级分支
interface TowerBranch {
    branchId: string;      // 分支ID
    name: string;          // 分支名（如 "烈焰箭塔" / "冰霜箭塔"）
    level: number;         // 等级 2 or 3
    stats: TowerStats;     // 升级后属性
    newSkill?: TowerSkill; // 新增技能
    spineId: string;       // 新外观
    upgradeCost: number;   // 升级费用
}

// 技能数据
interface TowerSkill {
    skillId: string;
    name: string;
    type: SkillType;       // 主动/被动/Auto
    cooldown: number;
    effect: SkillEffect;
    description: string;
}
```

#### 3.3.2 升级分支逻辑

```
升级路径可视化：

  弓箭塔 (Lv1)
    ├── 烈焰箭塔 (Lv2) ──► 烈焰风暴塔 (Lv3)
    │   +溅射伤害             +全屏火焰雨
    └── 冰霜箭塔 (Lv2) ──► 极寒冰塔 (Lv3)
        +减速效果             +冻结概率

升级流程：
1. 点击已放置的塔 → 弹出升级面板
2. 显示两个分支预览（属性对比+技能预览）
3. 选择分支 → 扣除金币 → 播放升级动画 → 替换Spine
4. Lv2→Lv3自动沿已选分支升级
5. 升级期间塔暂停攻击（0.5秒动画）
```

#### 3.3.3 双塔融合算法

```typescript
class TowerFusion {
    // 融合配方表（静态配置）
    private fusionRecipes: Map<string, FusionRecipe> = new Map();

    // 判断两塔是否可融合
    canFuse(tower1: Tower, tower2: Tower): boolean {
        // 1. 两塔必须相邻（上下左右）
        // 2. 两塔等级必须≥Lv2
        // 3. 查找融合配方
        const key = this.getFusionKey(tower1, tower2);
        return this.fusionRecipes.has(key);
    }

    // 执行融合
    fuse(tower1: Tower, tower2: Tower): Tower {
        const recipe = this.fusionRecipes.get(this.getFusionKey(tower1, tower2));
        // 1. 销毁两座原始塔
        // 2. 在tower1位置创建融合塔
        // 3. 继承两塔中较高的等级
        // 4. 获得融合专属技能
        // 5. 播放融合特效（0.8秒）
        // 6. 返回融合塔实例
    }

    // 融合键（无序组合）
    private getFusionKey(t1: Tower, t2: Tower): string {
        const ids = [t1.branchId, t2.branchId].sort();
        return `${ids[0]}+${ids[1]}`;
    }
}

// 融合示例：
// 烈焰箭塔 + 冰霜箭塔 = 蒸汽炮塔（冰火双属性，范围蒸发）
// 雷电塔 + 毒素塔 = 瘟疫雷塔（连锁毒素，持续雷击）
```

#### 3.3.4 技能树可视化渲染

```
技能树渲染方案：
├── 使用Cocos Graphics组件绘制连线
├── 节点使用Prefab（可复用）
├── 动画：解锁时连线从起点向终点延伸（0.5秒）
├── 布局算法：自顶向下树形布局
└── 交互：点击节点 → 弹出技能详情 → 确认解锁
```

### 3.4 Rogue系统

#### 3.4.1 Buff池设计与权重

```typescript
interface RogueBuff {
    id: string;
    name: string;
    description: string;
    rarity: BuffRarity;         // 普通/稀有/史诗/传说
    weight: number;             // 基础权重
    maxStack: number;           // 最大叠加层数
    stackRule: StackRule;       // 叠加规则
    effect: BuffEffect;         // 效果实现
    icon: string;               // 图标资源key
    prerequisite?: string;      // 前置Buff ID
}

enum BuffRarity {
    COMMON = 1,    // 权重基础值 100
    RARE = 2,      // 权重基础值 40
    EPIC = 3,      // 权重基础值 15
    LEGENDARY = 4, // 权重基础值 3
}

// Buff池（分层抽取）
const BuffPool = {
    // 第1次Rogue：偏基础Buff
    firstRoll: {
        commonWeight: 1.5,   // 普通权重×1.5
        rareWeight: 1.0,
        epicWeight: 0.5,     // 史诗降权
        legendaryWeight: 0,  // 不出传说
    },
    // 第2次Rogue：偏强力Buff
    secondRoll: {
        commonWeight: 0.8,
        rareWeight: 1.2,
        epicWeight: 1.0,
        legendaryWeight: 0.3,// 小概率出传说
    }
};
```

#### 3.4.2 三选一随机算法

```typescript
class RogueRoller {
    // 三选一抽取
    rollBuff(context: RogueContext): RogueBuff[] {
        const candidates: RogueBuff[] = [];
        const pool = this.getAvailablePool(context);

        // 保证至少1个普通+1个稀有
        candidates.push(this.weightedPick(pool, BuffRarity.COMMON));
        candidates.push(this.weightedPick(pool, BuffRarity.RARE));

        // 第3个随机品质
        const thirdRarity = this.rollRarity(context.rollIndex);
        candidates.push(this.weightedPick(pool, thirdRarity));

        // 去重（不出现相同Buff）
        this.deduplicate(candidates, pool);

        // 洗牌（不暴露品质排序）
        this.shuffle(candidates);

        return candidates;
    }

    // 加权随机选择
    private weightedPick(pool: RogueBuff[], targetRarity?: BuffRarity): RogueBuff {
        const filtered = targetRarity
            ? pool.filter(b => b.rarity === targetRarity)
            : pool;

        const totalWeight = filtered.reduce((sum, b) => sum + b.weight, 0);
        let roll = Math.random() * totalWeight;

        for (const buff of filtered) {
            roll -= buff.weight;
            if (roll <= 0) return buff;
        }
        return filtered[filtered.length - 1];
    }
}
```

#### 3.4.3 Buff叠加规则

```typescript
enum StackRule {
    ADDITIVE = 'Additive',       // 加法叠加（如+10%攻击力 ×3 = +30%）
    MULTIPLICATIVE = 'Multiplicative', // 乘法叠加（如×1.1 ×3 = ×1.331）
    REPLACE = 'Replace',         // 替换（只取最高值）
    UNIQUE = 'Unique',           // 唯一（不可叠加，重复出现则升级效果）
}

// 叠加计算示例
class BuffCombiner {
    combine(buffs: RogueBuff[]): CombinedEffect {
        const grouped = this.groupByEffectType(buffs);
        const result: CombinedEffect = {};

        for (const [type, group] of grouped) {
            switch (group[0].stackRule) {
                case StackRule.ADDITIVE:
                    result[type] = group.reduce((sum, b) => sum + b.value, 0);
                    break;
                case StackRule.MULTIPLICATIVE:
                    result[type] = group.reduce((prod, b) => prod * (1 + b.value), 1) - 1;
                    break;
                case StackRule.REPLACE:
                    result[type] = Math.max(...group.map(b => b.value));
                    break;
                case StackRule.UNIQUE:
                    result[type] = group[group.length - 1].value; // 取最新
                    break;
            }
        }
        return result;
    }
}
```

#### 3.4.4 高级Rogue事件触发逻辑

```
高级Rogue事件触发条件：
├── 「连锁反应」：连续选择同属性Buff → 第3次触发属性共鸣事件
├── 「命运交汇」：第2次Rogue选择后，若两个Buff品质≥稀有 → 额外奖励事件
├── 「绝境逆袭」：基地血量<20%时Rogue选择 → 出现专属救场Buff
└── 「双生之力」：Rogue Buff与已融合塔属性匹配 → 强化版Buff

触发检测时机：
1. 每次Rogue选择后检测
2. 在三选一界面展示前插入特殊事件
3. 特殊事件为可选，玩家可跳过选择普通Buff
```

### 3.5 PVP系统

#### 3.5.1 网络同步方案

**🏆 推荐方案：状态同步（非帧同步）**

| 方案 | 帧同步 | 状态同步 ⭐ |
|------|--------|-----------|
| 原理 | 每帧同步操作指令，两端各自模拟 | 同步关键状态，服务器权威判定 |
| 一致性 | 依赖浮点数确定性，JS不保证 ✗ | 服务器权威，天然一致 ✓ |
| 断线重连 | 需回放所有帧，耗时长 | 拉取最新状态，秒级恢复 ✓ |
| 防作弊 | 客户端可注入非法指令 ✗ | 服务器验证，难以作弊 ✓ |
| 微信兼容 | 需要稳定长连接 ✗ | HTTP短连接也可行 ✓ |
| 开发成本 | 确定性逻辑调试极难 | 逻辑清晰，调试方便 ✓ |
| 带宽需求 | 每帧小包，总量大 | 关键事件发包，总量小 ✓ |

**状态同步架构：**

```
PVP「镜像攻防」同步流程：

服务器（云函数/MatchVS）：
├── 房间管理（创建/匹配/销毁）
├── 回合调度（3轮攻防 + 决胜轮）
├── 状态验证（布阵合法性/伤害合法性）
└── 结果判定（基地血量比较）

客户端A（攻方）              客户端B（守方）
    │                            │
    │── 布阵数据 ──────────────►│  服务器转发布阵
    │◄──────────────── 布阵数据 ──│
    │                            │
    │  本地模拟攻击B的防守        │  本地模拟B攻击A的防守
    │                            │
    │── 攻击结果(血量/击杀) ───►│  服务器验证
    │◄── 防守结果(血量/击杀) ────│
    │                            │
    │── 3轮攻防结果汇总 ────────►│  服务器判定胜负
    │◄─────── 最终结果 ──────────│
```

```typescript
// 网络通信方案
class PVPNetwork {
    // 微信WebSocket（游戏帧同步专用通道）
    // 微信小游戏支持 wx.connectSocket，但需注意：
    // 1. 小游戏切后台5秒后WebSocket可能断开
    // 2. 需实现心跳保活（3秒一次）
    // 3. 断线后使用 wx.request 短连接恢复

    private ws: WechatWebSocket | null = null;
    private httpFallback: boolean = false;

    // 连接（优先WebSocket，失败降级HTTP轮询）
    async connect(roomId: string): Promise<void> {
        try {
            this.ws = wx.connectSocket({ url: WS_URL + roomId });
            this.setupHeartbeat();
        } catch (e) {
            this.httpFallback = true;
            this.startPolling(roomId);
        }
    }

    // 发送状态（关键事件驱动，非每帧）
    sendState(event: PVPEvent): void {
        const data = this.serialize(event);
        if (this.ws && !this.httpFallback) {
            this.ws.send({ data });
        } else {
            wx.request({ url: HTTP_URL, method: 'POST', data });
        }
    }

    // 心跳保活
    private setupHeartbeat(): void {
        setInterval(() => {
            if (this.ws) this.ws.send({ data: '{"type":"ping"}' });
        }, 3000);
    }
}

// PVP事件类型
interface PVPEvent {
    type: 'deploy' | 'attack_result' | 'round_end' | 'surrender';
    roomId: string;
    playerId: string;
    timestamp: number;
    data: any;  // 根据type不同
    checksum: string; // 数据校验
}
```

#### 3.5.2 匹配算法（ELO实现）

```typescript
class ELOMatcher {
    private K = 32; // ELO系数

    // 计算ELO变化
    calculateELO(winnerRating: number, loserRating: number): [number, number] {
        const expectedWin = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
        const expectedLose = 1 - expectedWin;

        const winnerGain = Math.round(this.K * (1 - expectedWin));
        const loserLoss = Math.round(this.K * (0 - expectedLose));

        return [winnerGain, loserLoss];
    }

    // 段位映射
    getRank(rating: number): Rank {
        if (rating >= 2000) return Rank.LEGEND;     // 传奇
        if (rating >= 1600) return Rank.DIAMOND;    // 钻石
        if (rating >= 1200) return Rank.PLATINUM;   // 铂金
        if (rating >= 800)  return Rank.GOLD;       // 黄金
        if (rating >= 400)  return Rank.SILVER;     // 白银
        return Rank.BRONZE;                          // 青铜
    }

    // 匹配逻辑
    async findMatch(playerRating: number): Promise<Opponent> {
        // 1. 查找±200分范围内的对手
        // 2. 等待5秒未找到 → 扩大到±400
        // 3. 等待15秒未找到 → 匹配AI（评分接近的AI对手）
        // 4. 新手保护：前5场只匹配新手
    }
}
```

#### 3.5.3 断线重连机制

```
断线重连流程：
1. 检测断线（心跳超时/WebSocket error）
2. 本地暂停游戏，显示重连UI
3. 尝试重连（最多3次，间隔2/4/8秒）
4. 重连成功：
   a. 请求服务器获取最新游戏状态
   b. 快进模拟（跳过断线期间的回合）
   c. 继续当前回合
5. 重连失败：
   a. 对手AI替代（服务器控制）
   b. 本地玩家可选择等待或AI托管
   c. 超时60秒 → 判负（不扣额外ELO）
```

#### 3.5.4 AI超时替代方案

```typescript
class AITimeoutProxy {
    // 玩家超时时代替操作
    // 布阵超时 → 使用预设布阵模板
    // 攻击超时 → AI自动攻击（策略：优先攻击血量最低的建筑）
    // 整局超时 → AI接管全部操作

    private deploymentTemplates: DeploymentTemplate[] = [
        // 预设3套常见布阵
        { name: '均衡防守', towers: [...] },
        { name: '核心堡垒', towers: [...] },
        { name: '全面覆盖', towers: [...] },
    ];

    getDeployment(): DeploymentData {
        // 随机选一套预设布阵
        return this.deploymentTemplates[Math.floor(Math.random() * 3)];
    }
}
```

#### 3.5.5 防作弊设计

```
防作弊策略（服务器权威）：
├── 布阵合法性
│   ├── 塔数量不超过上限
│   ├── 塔位置在合法区域
│   ├── 金币消耗正确
│   └── 服务器验证布阵数据
├── 伤害合法性
│   ├── 伤害数值在合理范围（服务器计算基准值±20%容差）
│   ├── 攻击速度不超过上限
│   └── 异常高伤害触发服务器日志+人工审核
├── 行为检测
│   ├── 反应时间异常（始终0延迟 → 可能是外挂）
│   ├── 操作频率异常
│   └── 模式识别（操作过于规律化）
├── 数据加密
│   ├── 通信加密（TLS + 自定义校验）
│   ├── 关键数据签名（checksum）
│   └── 本地存储加密（AES-128）
└── 封禁策略
    ├── 异常数据标记 → 人工复核 → 封禁
    ├── 封禁梯度：1天 → 7天 → 永久
    └── 申诉通道
```

### 3.6 关卡系统

#### 3.6.1 关卡数据结构

```typescript
interface LevelData {
    id: string;                       // 关卡ID
    name: string;                     // 关卡名
    chapter: number;                  // 章节号
    difficulty: number;               // 难度系数
    map: MapData;                     // 地图数据
    waves: WaveData[];                // 波次配置
    boss?: BossData;                  // Boss配置
    environment?: EnvironmentData;    // 环境机制
    rewards: RewardData;              // 通关奖励
    starConditions: StarCondition[];  // 3星条件
}

interface MapData {
    width: number;                    // 地图宽度（格子数）
    height: number;                   // 地图高度
    tileSize: number;                 // 格子像素尺寸
    paths: PathData[];                // 敌人路径（支持多路径）
    buildableAreas: boolean[][];      // 可建造区域
    spawnPoints: Vec2[];              // 敌人生成点
    basePosition: Vec2;               // 基地位置
    environmentObjects: EnvObject[];  // 环境物件
}

interface PathData {
    pathIndex: number;
    waypoints: Vec2[];                // 路径点坐标
}

// 关卡数据以JSON格式存储，运行时解析
// 存储：assets/configs/levels/chapter_{n}/level_{id}.json
```

#### 3.6.2 地图编辑器设计

```
方案：基于Cocos Creator场景编辑器 + 自定义插件

地图编辑器功能：
├── 可视化网格编辑（拖拽放置/删除地形块）
├── 路径绘制工具（点击设定路径点，自动连线）
├── 可建造区域标记（框选/反选）
├── 生成点/基地标记
├── 环境物件放置
├── 实时预览（运行敌人寻路测试）
└── 导出为JSON（LevelData格式）

技术方案：
- 使用Cocos Creator自定义Inspector插件
- 编辑器内Scene可视化
- 数据序列化为JSON
- 支持Undo/Redo
```

#### 3.6.3 路径点配置

```typescript
// 路径点编辑器
class PathEditor {
    // 在编辑器中可视化编辑路径点
    // 支持：添加/删除/拖拽路径点
    // 自动生成贝塞尔平滑曲线
    // 导出为waypoints数组

    // 运行时路径插值（敌人平滑移动）
    getPositionOnPath(progress: number, path: PathData): Vec2 {
        // progress: 0~1，表示在路径上的进度
        // 使用Catmull-Rom样条插值实现平滑移动
        const segments = path.waypoints;
        const totalLength = this.calculateTotalLength(segments);
        const targetDist = progress * totalLength;

        // 二分查找当前所在线段
        // 线性插值得到精确位置
    }
}
```

#### 3.6.4 环境机制实现

```typescript
enum EnvironmentType {
    FOG = 'Fog',             // 迷雾（降低塔攻击范围）
    RAIN = 'Rain',           // 雨天（减速效果，冰属性增强）
    SANDSTORM = 'Sandstorm', // 沙暴（敌人获得护盾）
    VOLCANO = 'Volcano',     // 火山（随机区域喷发伤害）
    ICE = 'Ice',             // 冰原（敌人移动减速，火属性增强）
}

class EnvironmentSystem {
    private currentEnv: EnvironmentType;
    private envTimer: number = 0;

    // 环境效果每帧更新
    update(dt: number): void {
        switch (this.currentEnv) {
            case EnvironmentType.FOG:
                // 每个塔的攻击范围 *= 0.7
                this.applyRangeModifier(0.7);
                break;
            case EnvironmentType.VOLCANO:
                // 每10秒随机区域喷发
                this.envTimer += dt;
                if (this.envTimer >= 10) {
                    this.envTimer = 0;
                    this.triggerEruption();
                }
                break;
            // ...
        }
    }
}
```

### 3.7 经济与养成系统

#### 3.7.1 资源管理器

```typescript
enum ResourceType {
    GOLD = 'Gold',           // 金币（通用货币）
    DIAMOND = 'Diamond',     // 钻石（付费货币）
    ENERGY = 'Energy',       // 体力
    TOWER_EXP = 'TowerExp',  // 塔经验
    PLAYER_EXP = 'PlayerExp',// 玩家经验
    ROGUE_COIN = 'RogueCoin',// Rogue代币（单局内）
}

class EconMgr {
    private resources: Map<ResourceType, number> = new Map();

    // 消耗资源（带校验）
    spend(type: ResourceType, amount: number): boolean {
        if (this.resources.get(type) < amount) return false;
        this.resources.set(type, this.resources.get(type) - amount);
        EventBus.emit(EventType.RESOURCE_CHANGE, { type, amount: -amount });
        return true;
    }

    // 获得资源
    earn(type: ResourceType, amount: number): void {
        this.resources.set(type, this.resources.get(type) + amount);
        EventBus.emit(EventType.RESOURCE_CHANGE, { type, amount });
    }

    // 体力恢复（每6分钟1点，上限120）
    updateEnergyRecovery(dt: number): void;
}
```

#### 3.7.2 塔养成数值引擎

```typescript
class TowerProgression {
    // 塔养成维度
    interface TowerProgress {
        towerId: string;
        level: number;        // 1~30级
        star: number;         // 1~6星
        awaken: number;       // 0~3觉
        talents: number[];    // 天赋点分配
    }

    // 数值计算（等级+星级+觉醒 → 最终属性）
    calculateFinalStats(base: TowerStats, progress: TowerProgress): TowerStats {
        let stats = { ...base };

        // 等级加成（每级+5%）
        stats.damage *= (1 + 0.05 * (progress.level - 1));
        stats.attackSpeed *= (1 + 0.02 * (progress.level - 1));
        stats.range *= (1 + 0.01 * (progress.level - 1));

        // 星级加成（每星+8%全属性）
        const starMult = 1 + 0.08 * (progress.star - 1);
        stats.damage *= starMult;
        stats.attackSpeed *= starMult;
        stats.range *= starMult;

        // 觉醒加成（每觉+15%，解锁觉醒技能）
        const awakenMult = 1 + 0.15 * progress.awaken;
        stats.damage *= awakenMult;

        // 天赋加成
        for (const talentId of progress.talents) {
            const talent = this.talentData.get(talentId);
            talent.apply(stats);
        }

        return stats;
    }
}
```

#### 3.7.3 天赋树数据结构

```typescript
interface TalentNode {
    id: string;
    name: string;
    description: string;
    maxLevel: number;
    currentLevel: number;
    effectPerLevel: TalentEffect;
    prerequisite?: string;     // 前置天赋ID
    position: Vec2;            // UI位置
}

interface TalentTree {
    towerId: string;
    nodes: TalentNode[];
    connections: [string, string][]; // [from, to] 连线
    totalPoints: number;             // 可用天赋点
}

// 天赋树存储：JSON配置 + 运行时状态存本地
```

#### 3.7.4 商店系统

```typescript
class ShopSystem {
    // 商品分类
    enum ShopCategory {
        DIAMOND_PACK = 'DiamondPack',    // 钻石礼包
        GOLD_PACK = 'GoldPack',          // 金币礼包
        TOWER_PACK = 'TowerPack',        // 塔碎片礼包
        SKIN = 'Skin',                    // 皮肤
        BATTLE_PASS = 'BattlePass',       // 通行证
        MONTHLY_CARD = 'MonthlyCard',     // 月卡
    }

    // 商品数据
    interface ShopItem {
        id: string;
        category: ShopCategory;
        name: string;
        price: number;          // 价格（分）
        currency: 'CNY';       // 人民币
        contents: Reward[];     // 包含内容
        limit?: number;         // 限购次数
        discount?: number;      // 折扣
        startTime?: number;     // 限时开始
        endTime?: number;       // 限时结束
    }

    // 购买流程
    async purchase(itemId: string): Promise<PurchaseResult> {
        // 1. 检查限购/限时
        // 2. 调用微信支付
        // 3. 服务器验证订单
        // 4. 发放奖励
        // 5. 更新本地数据
    }
}
```

### 3.8 社交系统

#### 3.8.1 微信SDK集成方案

```typescript
class WeChatSDK {
    // 初始化
    init(): void {
        // wx.miniGame.init()
        // 获取openid/unionid
        // 检查更新
    }

    // 登录
    async login(): Promise<LoginResult> {
        const { code } = await wx.login();
        // 发送code到服务器换取openid
        return await this.serverLogin(code);
    }

    // 用户信息
    async getUserInfo(): Promise<UserInfo> {
        return await wx.getUserInfo();
    }

    // 分享
    shareAppMessage(config: ShareConfig): void {
        wx.shareAppMessage({
            title: config.title,
            imageUrl: config.imageUrl,
            query: config.query,  // 携带邀请参数
        });
    }

    // 好友关系链
    getFriendCloudStorage(keys: string[]): Promise<FriendData[]> {
        return wx.getFriendCloudStorage({ keyList: keys });
    }

    // 开放数据域（排行榜）
    getOpenDataContext(): OpenDataContext {
        return wx.getOpenDataContext();
    }
}
```

#### 3.8.2 好友关系链

```typescript
class FriendSystem {
    // 微信好友数据（通过开放数据域获取）
    private friends: Map<string, FriendData> = new Map();

    // 刷新好友列表
    async refreshFriends(): Promise<void> {
        const data = await wx.getFriendCloudStorage({
            keyList: ['rank_score', 'level', 'last_login']
        });
        // 更新本地好友缓存
    }

    // 好友约战
    async challengeFriend(friendId: string): Promise<void> {
        // 1. 生成约战链接
        const inviteCode = this.generateInviteCode();
        // 2. 分享给好友
        wx.shareAppMessage({
            title: '来一局塔防对决！',
            query: `action=challenge&from=${myId}&code=${inviteCode}`,
        });
    }

    // 处理好友约战邀请
    async handleChallengeInvite(query: Record<string, string>): Promise<void> {
        if (query.action === 'challenge') {
            // 弹出约战确认弹窗
            // 确认后进入PVP房间
        }
    }
}
```

#### 3.8.3 分享系统（6种场景实现）

```typescript
class ShareSystem {
    // 6种分享场景配置
    private shareConfigs: Map<ShareScene, ShareConfig> = new Map([
        [ShareScene.INVITE, {
            title: '来玩塔防觉醒！3分钟一局，超上头！',
            imageUrl: 'share/invite.png',
            query: 'action=invite&from={userId}',
        }],
        [ShareScene.REVIVE, {
            title: '我快撑不住了！来帮我复活！',
            imageUrl: 'share/revive.png',
            query: 'action=revive&from={userId}&battle={battleId}',
        }],
        [ShareScene.GIFT_ENERGY, {
            title: '送你一点体力，继续战斗！',
            imageUrl: 'share/energy.png',
            query: 'action=energy_gift&from={userId}',
        }],
        [ShareScene.PVP_CHALLENGE, {
            title: '敢来挑战我的防线吗？',
            imageUrl: 'share/pvp.png',
            query: 'action=challenge&from={userId}&code={inviteCode}',
        }],
        [ShareScene.ACHIEVEMENT, {
            title: '我通关了第{chapter}章！你能行吗？',
            imageUrl: 'share/achievement.png',
            query: 'action=achieve&from={userId}&chapter={chapter}',
        }],
        [ShareScene.DAILY, {
            title: '今日挑战已刷新！来比比谁分数高',
            imageUrl: 'share/daily.png',
            query: 'action=daily&from={userId}',
        }],
    ]);

    // 执行分享
    share(scene: ShareScene, params: Record<string, string>): void {
        const config = this.shareConfigs.get(scene);
        const query = this.fillTemplate(config.query, params);
        const title = this.fillTemplate(config.title, params);

        wx.shareAppMessage({ title, imageUrl: config.imageUrl, query });
    }

    // 处理分享回调
    handleShareEntry(query: Record<string, string>): void {
        const action = query.action;
        switch (action) {
            case 'invite': this.onInviteEntry(query); break;
            case 'revive': this.onReviveEntry(query); break;
            case 'energy_gift': this.onEnergyGiftEntry(query); break;
            case 'challenge': this.onChallengeEntry(query); break;
            case 'achieve': this.onAchieveEntry(query); break;
            case 'daily': this.onDailyEntry(query); break;
        }
    }
}
```

#### 3.8.4 排行榜

```typescript
class LeaderboardSystem {
    // 排行榜类型
    enum LeaderboardType {
        FRIEND = 'Friend',       // 好友排行
        WORLD = 'World',         // 世界排行
        SEASON = 'Season',       // 赛季排行
    }

    // 使用微信开放数据域渲染好友排行
    // 使用云函数+云数据库实现世界/赛季排行

    // 好友排行（开放数据域，无需服务器）
    renderFriendLeaderboard(canvas: Canvas): void {
        const openDataContext = wx.getOpenDataContext();
        // 在开放数据域中渲染排行榜UI
        // 通过postMessage传递数据
    }

    // 世界/赛季排行（云函数查询）
    async getWorldLeaderboard(page: number): Promise<LeaderboardEntry[]> {
        return await CloudFunction.call('getLeaderboard', { type: 'world', page });
    }

    // 上报分数
    async submitScore(score: number): Promise<void> {
        // 云函数写入排行榜
        await CloudFunction.call('submitScore', { score });
        // 开放数据域写入好友数据
        wx.setUserCloudStorage({
            KVDataList: [{ key: 'rank_score', value: String(score) }]
        });
    }
}
```

#### 3.8.5 体力互赠/助战

```typescript
class SocialHelper {
    // 体力互赠
    async sendEnergy(toUserId: string): Promise<void> {
        // 每日最多赠送10次，每次5体力
        // 通过云函数记录赠送记录
        await CloudFunction.call('sendEnergy', { to: toUserId, amount: 5 });
    }

    // 接收体力
    async receiveEnergy(): Promise<EnergyGift[]> {
        return await CloudFunction.call('receiveEnergy');
    }

    // 好友助战（关卡中选择好友塔助战）
    async getAssistTowers(): Promise<AssistTower[]> {
        // 获取好友的已放置塔数据
        const friends = await this.friendSystem.getOnlineFriends();
        return friends.map(f => ({
            friendId: f.id,
            friendName: f.name,
            towerData: f.placedTowers[0], // 取好友最强的塔
        }));
    }

    // 使用助战塔
    async useAssistTower(assistTower: AssistTower, position: Vec2): Promise<void> {
        // 在关卡中放置好友的塔（AI控制）
        // 助战塔持续1波，冷却时间2小时
    }
}
```

---

## 4. 数据存储与同步

### 4.1 本地存储方案

```typescript
// 本地存储结构设计
interface LocalSaveData {
    version: number;                 // 存档版本号
    player: PlayerData;              // 玩家基础数据
    towers: TowerSaveData[];         // 塔养成数据
    levels: LevelSaveData[];         // 关卡进度
    resources: ResourceSaveData;     // 资源数据
    settings: SettingsData;          // 设置数据
    pvp: PVPSaveData;               // PVP数据
    social: SocialSaveData;          // 社交数据
    shop: ShopSaveData;             // 商店数据
}

// 使用微信本地存储
class SaveMgr {
    private SAVE_KEY = 'tower_defense_save';

    // 存档（增量保存+定期全量保存）
    save(data: Partial<LocalSaveData>): void {
        const current = this.load();
        const merged = { ...current, ...data };
        const encrypted = this.encrypt(JSON.stringify(merged));
        wx.setStorageSync(this.SAVE_KEY, encrypted);
    }

    // 读档
    load(): LocalSaveData {
        const encrypted = wx.getStorageSync(this.SAVE_KEY);
        if (!encrypted) return this.getDefaultSave();
        const decrypted = this.decrypt(encrypted);
        return JSON.parse(decrypted);
    }

    // 存档时机
    // 1. 战斗结算后（立即）
    // 2. 商店购买后（立即）
    // 3. 养成操作后（立即）
    // 4. 每5分钟自动保存（定时）
    // 5. 切后台时（onHide事件）
}
```

### 4.2 云存储方案

**🏆 推荐：微信云开发（首选）+ 自建服务器（PVP核心逻辑）**

| 方案 | 微信云开发 ⭐ | 自建服务器 |
|------|-------------|-----------|
| 开发成本 | 极低，免运维 | 高，需运维 |
| 扩展性 | 自动扩缩 | 手动扩容 |
| 成本 | 免费额度覆盖中小规模 | 固定成本 |
| 微信集成 | 原生，零配置 | 需要额外开发 |
| 实时通信 | 支持 | 需自建WebSocket |
| 数据安全 | 微信保障 | 自行保障 |

```
数据存储分层：
├── 微信云开发（云数据库）
│   ├── 玩家基础数据（openid/昵称/头像/等级）
│   ├── 排行榜数据
│   ├── 好友互动数据（赠送/助战记录）
│   └── 广告观看记录
├── 自建服务器（ECS/容器）
│   ├── PVP房间管理
│   ├── ELO匹配系统
│   ├── 订单系统
│   ├── 防作弊验证
│   └── 关键业务日志
└── 本地存储（wx.setStorageSync）
    ├── 养成进度（塔等级/星级/天赋）
    ├── 关卡进度
    ├── 设置偏好
    └── 缓存数据
```

### 4.3 数据安全

```typescript
class SecurityMgr {
    // AES-128 加密
    encrypt(data: string): string {
        // 使用设备唯一标识+固定盐生成密钥
        const key = this.generateKey();
        return AES.encrypt(data, key);
    }

    decrypt(encrypted: string): string {
        const key = this.generateKey();
        return AES.decrypt(encrypted, key);
    }

    // 数据校验（防篡改）
    generateChecksum(data: LocalSaveData): string {
        // 对关键字段计算HMAC
        const fields = JSON.stringify({
            resources: data.resources,
            towers: data.towers,
            levels: data.levels,
        });
        return HMAC_SHA256(fields, SERVER_SECRET);
    }

    // 关键操作服务器验证
    async validateOperation(op: GameOperation): Promise<boolean> {
        // 购买/升级/抽卡等关键操作
        // 服务器验证资源是否足够
        // 服务器记录操作日志
        return await CloudFunction.call('validateOp', op);
    }
}
```

### 4.4 PC+移动双端进度同步方案

```
双端同步架构：

微信小游戏端                    PC小游戏端
    │                              │
    │─── wx.login() ──► openid ────│─── PC登录 ──► 绑定openid
    │                              │
    │◄─────── 云端存档 ────────────►│
    │                              │

同步策略：
1. 以微信openid为唯一标识，PC端绑定微信账号
2. 每次进入游戏时拉取云端最新存档
3. 冲突解决：以时间戳较新者为准
4. 关键数据（资源/养成）以服务器数据为准
5. 本地存档作为离线缓存

同步数据范围：
├── 玩家基础数据 ✓
├── 养成进度 ✓
├── 关卡进度 ✓
├── PVP数据 ✓
├── 资源数据 ✓（以服务器为准）
├── 设置数据 ✗（各端独立）
└── 社交数据 ✓（微信端为权威）

PC端适配：
- 微信开放能力降级处理（分享→复制链接/截图）
- PC端使用键盘+鼠标操作
- 分辨率自适应（1920×1080基准）
```

### 4.5 离线收益计算

```typescript
class OfflineReward {
    // 计算离线收益
    calculateOfflineReward(lastLoginTime: number): OfflineRewardData {
        const offlineMinutes = (Date.now() - lastLoginTime) / 60000;
        const maxOfflineHours = 12; // 最长计算12小时

        const effectiveMinutes = Math.min(offlineMinutes, maxOfflineHours * 60);

        // 基础收益 = 离线分钟 × 每分钟基础产出
        const goldPerMinute = 10 * (1 + this.playerLevel * 0.1);
        const gold = Math.floor(effectiveMinutes * goldPerMinute);

        // 体力恢复
        const energyPerMinute = 1 / 6; // 6分钟1点
        const energy = Math.floor(effectiveMinutes * energyPerMinute);

        return {
            gold,
            energy: Math.min(energy, 120 - this.currentEnergy),
            offlineMinutes: effectiveMinutes,
        };
    }
}
```

---

## 5. 变现技术实现

### 5.1 微信广告SDK集成

```typescript
class AdSystem {
    // 7种激励视频触发点
    private rewardAdPoints: Map<AdPoint, RewardAdConfig> = new Map([
        [AdPoint.REVIVE, {          // 复活
            reward: 'battle_revive',
            title: '观看广告复活',
            cooldown: 0,             // 无冷却
            dailyLimit: 3,           // 每日3次
        }],
        [AdPoint.DOUBLE_REWARD, {   // 双倍奖励
            reward: 'double_reward',
            title: '观看广告获得双倍奖励',
            cooldown: 0,
            dailyLimit: 5,
        }],
        [AdPoint.FREE_DRAW, {       // 免费抽卡
            reward: 'free_draw',
            title: '观看广告免费抽卡1次',
            cooldown: 3600000,       // 1小时冷却
            dailyLimit: 3,
        }],
        [AdPoint.ENERGY_REFILL, {   // 体力恢复
            reward: 'energy_refill_30',
            title: '观看广告恢复30体力',
            cooldown: 0,
            dailyLimit: 3,
        }],
        [AdPoint.ROGUE_REROLL, {    // Rogue重选
            reward: 'rogue_reroll',
            title: '观看广告重新选择Buff',
            cooldown: 0,
            dailyLimit: 2,
        }],
        [AdPoint.TOWER_EXP, {       // 塔经验加成
            reward: 'tower_exp_1.5x',
            title: '观看广告获得1.5倍塔经验',
            cooldown: 0,
            dailyLimit: 3,
        }],
        [AdPoint.SHOP_DISCOUNT, {   // 商店折扣
            reward: 'shop_discount_8',
            title: '观看广告获得8折优惠',
            cooldown: 7200000,       // 2小时冷却
            dailyLimit: 2,
        }],
    ]);

    private rewardedVideoAd: WechatRewardedVideoAd | null = null;

    // 初始化激励视频广告
    initRewardedVideo(adUnitId: string): void {
        this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId });
        this.rewardedVideoAd.onClose(this.onAdClose.bind(this));
        this.rewardedVideoAd.onError(this.onAdError.bind(this));
    }

    // 展示激励视频
    async showRewardAd(point: AdPoint): Promise<boolean> {
        const config = this.rewardAdPoints.get(point);
        if (!this.checkLimit(point, config)) return false;

        try {
            await this.rewardedVideoAd.show();
            return true;
        } catch (e) {
            // 广告加载失败，静默降级
            await this.rewardedVideoAd.load();
            await this.rewardedVideoAd.show();
            return true;
        }
    }

    // 广告关闭回调
    private onAdClose(res: { isEnded: boolean }): void {
        if (res.isEnded) {
            // 完整观看 → 发放奖励
            this.grantReward(this.currentAdPoint);
        }
        // 未完整观看 → 不发放奖励
    }
}
```

### 5.2 微信支付SDK集成

```typescript
class PaymentSystem {
    // 内购5层
    private productTiers: ProductTier[] = [
        { id: 'tier1', name: '新手礼包', price: 600, originalPrice: 1800 },  // ¥6
        { id: 'tier2', name: '钻石补给', price: 1800 },                       // ¥18
        { id: 'tier3', name: '钻石大礼包', price: 6800 },                     // ¥68
        { id: 'tier4', name: '尊享礼包', price: 12800 },                      // ¥128
        { id: 'tier5', name: '至尊礼包', price: 32800 },                      // ¥328
    ];

    // 购买流程
    async purchase(productId: string): Promise<PurchaseResult> {
        // 1. 创建订单（服务器端）
        const order = await CloudFunction.call('createOrder', { productId });

        // 2. 调用微信支付
        const payResult = await this.requestWxPay(order);

        // 3. 服务器验证支付结果
        if (payResult.errCode === 0) {
            const verified = await CloudFunction.call('verifyPayment', {
                orderId: order.id,
                transactionId: payResult.transactionId,
            });

            if (verified.success) {
                // 4. 发放商品
                this.grantProduct(productId);
                return { success: true };
            }
        }

        return { success: false, reason: 'payment_failed' };
    }

    // 微信支付请求
    private async requestWxPay(order: OrderData): Promise<WxPayResult> {
        return new Promise((resolve, reject) => {
            wx.requestPayment({
                timeStamp: order.timeStamp,
                nonceStr: order.nonceStr,
                package: order.package,
                signType: 'MD5',
                paySign: order.paySign,
                success: resolve,
                fail: reject,
            });
        });
    }
}
```

### 5.3 内购商品管理

```
商品管理架构：
├── 商品配置（服务器端）
│   ├── 商品ID/名称/描述
│   ├── 价格（分）
│   ├── 包含内容
│   ├── 限购/限时配置
│   └── 折扣配置
├── 商品展示（客户端）
│   ├── 首页推荐位
│   ├── 商店页面
│   └── 弹窗推荐（触发条件：关卡失败/资源不足）
├── 通行证系统
│   ├── 免费轨道 + 付费轨道
│   ├── 50级奖励
│   └── 赛季主题
└── 月卡系统
    ├── 30天每日领取
    ├── 即时奖励+每日奖励
    └── 自动续费（微信委托代扣）
```

### 5.4 防刷/防作弊策略

```
防刷策略矩阵：
├── 广告防刷
│   ├── 服务器记录每次广告观看
│   ├── 每日上限检查（服务器端）
│   ├── 异常频率检测（1分钟内>5次 → 标记）
│   └── 广告SDK回调验证（isEnded检查）
├── 支付防刷
│   ├── 订单唯一ID（防重复支付）
│   ├── 服务器验证微信支付回调签名
│   ├── 订单状态机（待支付→已支付→已发货→已完成）
│   └── 对账系统（每日与微信对账）
├── 资源防刷
│   ├── 关键资源变更服务器验证
│   ├── 资源变动日志（审计）
│   └── 异常增长检测（1小时内增长超阈值 → 人工审核）
└── 数据防篡改
    ├── 本地存档加密+校验
    ├── 关键操作服务器校验
    └── 客户端完整性检查
```

### 5.5 订单系统与对账

```typescript
class OrderSystem {
    // 订单状态机
    enum OrderStatus {
        PENDING = 'pending',       // 待支付
        PAID = 'paid',             // 已支付
        DELIVERED = 'delivered',   // 已发货
        COMPLETED = 'completed',   // 已完成
        REFUNDED = 'refunded',     // 已退款
        EXPIRED = 'expired',       // 已过期
    }

    // 创建订单
    async createOrder(productId: string, userId: string): Promise<Order> {
        return await CloudFunction.call('createOrder', {
            productId,
            userId,
            timestamp: Date.now(),
            expireTime: Date.now() + 30 * 60 * 1000, // 30分钟过期
        });
    }

    // 每日自动对账
    async dailyReconciliation(): Promise<ReconcileResult> {
        // 1. 从微信支付平台获取昨日交易流水
        // 2. 与本地订单表逐笔比对
        // 3. 标记差异订单（多付/少付/未发货）
        // 4. 生成对账报告
        // 5. 异常订单人工处理
    }
}
```

---

## 6. 性能优化方案

### 6.1 渲染优化

```
合批策略：
├── 静态合批
│   ├── 地图背景 → 1个DrawCall（初始化时合批）
│   └── 路径/网格 → 1个DrawCall
├── 动态合批
│   ├── 同类型敌人 → 合批渲染（同Spine动画帧的敌人合并）
│   ├── 血条 → 合批渲染（单独Camera/RenderTexture）
│   └── 弹道 → 合批渲染（同材质弹道合并）
├── GPU Instancing
│   └── 同类型防御塔 → Instancing渲染
└── 脏标记
    └── 只更新变化的节点（位置/颜色/可见性）
```

| 优化项 | 目标 | 措施 |
|--------|------|------|
| DrawCall | ≤60 | 合批+Instancing+分层渲染 |
| 三角形数 | ≤30K | LOD简化+视锥剔除 |
| Shader切换 | ≤10 | 统一Shader+变体 |
| Overdraw | ≤2x | 粒子数量控制+遮挡剔除 |

### 6.2 内存优化

```
内存预算（微信小游戏限制1GB，目标控制在300MB以内）：
├── 纹理：≤120MB
│   ├── 压缩格式：ASTC(6x6) / ETC2
│   ├── 最大单张：1024×1024
│   └── 图集合并：同类资源打包同一图集
├── Spine动画：≤50MB
│   ├── .skel文件二进制格式
│   ├── 纹理图集复用
│   └── 非活动动画释放
├── 音频：≤20MB
│   ├── BGM：MP3格式，单流加载
│   └── SFX：MP3格式，按场景预加载
├── 配置数据：≤10MB
│   └── JSON → 运行时二进制格式
└── 运行时：≤100MB
    ├── 对象池预分配
    ├── 限制同时存在的特效数量
    └── GC优化减少临时对象
```

```typescript
class MemoryMgr {
    // 内存警告处理
    onMemoryWarning(level: number): void {
        if (level >= 5) {
            // 严重内存警告
            // 1. 释放所有非必要资源
            this.releaseNonEssentialResources();
            // 2. 缩小对象池
            PoolMgr.shrinkAll(0.3);
            // 3. 清理纹理缓存
            ResMgr.clearTextureCache();
        } else if (level >= 3) {
            // 中等内存警告
            // 1. 释放远程加载资源
            this.releaseRemoteResources();
            // 2. 缩小对象池50%
            PoolMgr.shrinkAll(0.5);
        }
    }

    // 场景切换时资源释放
    onSceneUnload(sceneName: string): void {
        // 1. 释放场景专属资源
        // 2. 保留跨场景共享资源
        // 3. 清空场景对象池
        // 4. 强制GC（Cocos自动）
    }
}
```

### 6.3 CPU优化

| 优化项 | 方案 | 预期收益 |
|--------|------|---------|
| 逻辑帧分离 | 渲染60fps，逻辑30fps，非关键逻辑15fps | CPU占用-30% |
| 寻路优化 | 流场O(1)查询 + 局部A*限制深度 | 寻路开销-90% |
| 索敌优化 | 空间哈希网格，0.5秒间隔 | 索敌开销-70% |
| 物理优化 | 不使用物理引擎，纯数学碰撞检测 | 碰撞开销-80% |
| GC优化 | 对象池+避免闭包+预分配数组 | GC暂停-90% |
| 热点函数 | 手动内联+位运算替代浮点 | 关键路径-20% |

```typescript
// 逻辑帧分离方案
class GameLoop {
    private renderFPS = 60;
    private logicFPS = 30;
    private aiFPS = 15;

    update(dt: number) {
        this.accumulatedLogicTime += dt;
        this.accumulatedAITime += dt;

        // 渲染帧（每帧）
        this.renderUpdate(dt);

        // 逻辑帧（30fps）
        const logicInterval = 1 / this.logicFPS;
        while (this.accumulatedLogicTime >= logicInterval) {
            this.logicUpdate(logicInterval);
            this.accumulatedLogicTime -= logicInterval;
        }

        // AI帧（15fps，索敌/策略更新）
        const aiInterval = 1 / this.aiFPS;
        while (this.accumulatedAITime >= aiInterval) {
            this.aiUpdate(aiInterval);
            this.accumulatedAITime -= aiInterval;
        }
    }
}

// 空间哈希网格（加速索敌）
class SpatialHash {
    private cellSize: number = 64; // 格子大小
    private grid: Map<string, Enemy[]> = new Map();

    // 插入敌人
    insert(enemy: Enemy): void {
        const key = this.getCellKey(enemy.position);
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(enemy);
    }

    // 查询范围内敌人（O(1)级别查找，而非遍历全部）
    queryInRange(center: Vec2, range: number): Enemy[] {
        const results: Enemy[] = [];
        const minCell = this.getCellPos({ x: center.x - range, y: center.y - range });
        const maxCell = this.getCellPos({ x: center.x + range, y: center.y + range });

        for (let cx = minCell.x; cx <= maxCell.x; cx++) {
            for (let cy = minCell.y; cy <= maxCell.y; cy++) {
                const key = `${cx},${cy}`;
                const enemies = this.grid.get(key);
                if (enemies) results.push(...enemies);
            }
        }
        return results;
    }
}
```

### 6.4 网络优化

```
网络优化策略：
├── 协议优化
│   ├── 使用Protobuf替代JSON（体积减少60%+）
│   ├── 字段编号替代字段名
│   └── 差量同步（只发送变化的字段）
├── 连接策略
│   ├── 优先WebSocket，降级HTTP轮询
│   ├── 心跳间隔3秒
│   └── 自动重连（指数退避，最大30秒）
├── 弱网策略
│   ├── 本地预测（客户端先行，服务器确认）
│   ├── 命令缓冲（网络恢复后批量发送）
│   ├── 超时判定（5秒无响应→本地AI接管）
│   └── 降级体验（弱网时关闭实时同步，结算时合并）
└── 缓存策略
    ├── 离线数据缓存
    ├── 请求去重（相同请求短时间内不重复发）
    └── 数据预取（进入PVP大厅时预加载匹配数据）
```

### 6.5 包体优化

```
包体控制策略（总包≤20MB，首包≤4MB硬约束）：

首包构成（≤4MB）：
├── 引擎裁剪后          ~1.2MB
├── 启动画面+主菜单UI    ~0.5MB
├── 通用框架资源          ~0.8MB
│   ├── 通用UI组件（按钮/面板/字体）
│   ├── 通用特效（伤害数字/选中高亮）
│   └── 通用音效（点击/确认）
├── 新手引导资源          ~0.3MB
├── 基础4种塔资源         ~0.8MB
│   ├── 4个Spine动画(~0.4MB)
│   └── 4组纹理图集(~0.4MB)
└── 代码                  ~0.4MB
    合计：~4.0MB

分包策略：
├── 分包1（战斗核心，~3MB）
│   ├── 剩余4种塔资源
│   ├── 全部9种敌人资源
│   ├── 战斗UI
│   └── Rogue界面
├── 分包2（PVP，~2MB）
│   ├── PVP UI
│   ├── 段位资源
│   └── PVP特效
├── 分包3（高级内容，~4MB）
│   ├── Boss动画
│   ├── 融合塔特效
│   ├── 高级关卡地图
│   └── 皮肤资源
├── 分包4（社交+商店，~3MB）
│   ├── 商店UI+商品图
│   ├── 排行榜UI
│   └── 分享模板
└── 远程资源（CDN按需加载）
    ├── Spine动画文件
    ├── 语音包
    └── 活动资源

纹理压缩：
├── ASTC 6×6（移动端，质量/体积平衡）
├── ETC2（ASTC不支持时的降级方案）
├── 最大纹理尺寸：1024×1024
├── 图集利用率≥85%
└── 透明通道分离（节省50%内存）

代码压缩：
├── UglifyJS压缩
├── Tree-shaking移除未使用代码
├── 引擎模块裁剪（移除3D物理/地形等不需要的模块）
└── 预估代码体积：~400KB（压缩后）
```

### 6.6 关键性能指标与监控

```
性能KPI：
| 指标 | 目标 | 报警阈值 |
|------|------|---------|
| FPS | ≥60 | <55 |
| 帧耗时 | ≤16.7ms | >20ms |
| DrawCall | ≤60 | >80 |
| 内存占用 | ≤300MB | >400MB |
| 首屏加载 | ≤3秒 | >5秒 |
| 场景切换 | ≤1秒 | >2秒 |
| PVP延迟 | ≤100ms | >200ms |
| 崩溃率 | <0.1% | >0.5% |
| 包体大小 | ≤20MB | >25MB |

监控方案：
├── 客户端：Cocos Profiler + 自定义性能打点
├── 微信平台：微信小游戏性能监控面板
├── 服务端：云函数执行时间/错误率监控
└── 报警：企业微信机器人推送
```

---

## 7. 动画与特效系统

### 7.1 骨骼动画方案

**🏆 推荐：Spine（首选）**

| 方案 | Spine ⭐ | DragonBones | 程序化动画 |
|------|---------|-------------|-----------|
| 运行时大小 | ~150KB | ~200KB | 0 |
| Cocos支持 | 官方插件，性能优秀 | 社区插件 | 原生 |
| 动画质量 | 专业级，流畅 | 中等 | 简单 |
| 制作工具 | Spine Editor（付费） | 免费 | 代码 |
| 包体贡献 | .skel+.atlas+.png | .dbjson+.png | 无 |
| 适用场景 | 8种塔+9种敌人+5种Boss | 简单角色 | UI动画 |

**Spine资源规范：**

```
Spine动画资源规范：
├── 单个角色动画文件大小：≤50KB（.skel二进制格式）
├── 纹理图集：多个角色共享图集，单张≤512×512
├── 动画帧率：30fps导出
├── 每个角色动画数：idle + attack + hit + death + skill = 5个
├── Boss额外动画：special1 + special2 = 7个
├── 总Spine角色数：8塔 + 9敌 + 5Boss = 22个
├── 总.skel体积：22 × 50KB ≈ 1.1MB
└── 总纹理图集：~8MB（共享图集约6张512×512）
```

### 7.2 粒子特效规范

```
粒子特效性能预算：
├── 同时存在粒子系统数：≤20
├── 单个粒子系统最大粒子数：≤30
├── 同屏最大粒子总数：≤300
├── 粒子贴图：共享1张256×256图集
└── 粒子类型：
    ├── 弹道拖尾（5种元素颜色）
    ├── 命中效果（5种元素颜色）
    ├── 升级光效
    ├── 融合特效
    ├── Boss技能特效
    └── 死亡爆炸
```

### 7.3 战斗特效层次

```
特效层次设计：
┌────────────────────────────────────┐
│ Layer 3: UI特效                     │
│ ├── 伤害数字飘字                    │
│ ├── 暴击提示                        │
│ ├── Buff获得提示                    │
│ └── 金币获取动画                    │
├────────────────────────────────────┤
│ Layer 2: 技能特效                   │
│ ├── 塔技能释放效果                  │
│ ├── Boss技能效果                    │
│ ├── Rogue Buff触发效果              │
│ └── 融合特效                        │
├────────────────────────────────────┤
│ Layer 1: 弹道特效                   │
│ ├── 弹道拖尾                        │
│ ├── 命中效果                        │
│ └── AOE范围指示                     │
└────────────────────────────────────┘

特效对象池：
- 每种特效预创建N个实例
- 播放时从池中取出，播放完毕归还
- 限制同屏特效数量，超出则丢弃最低优先级
```

### 7.4 特效性能预算

| 特效类型 | 单次DrawCall | 同屏最大数 | 总DC预算 |
|----------|-------------|-----------|---------|
| 弹道拖尾 | 1 | 15 | 15 |
| 命中效果 | 1 | 10 | 10 |
| 技能效果 | 2 | 5 | 10 |
| 升级光效 | 1 | 3 | 3 |
| 融合特效 | 3 | 1 | 3 |
| 伤害数字 | 1 | 10 | 10 |
| **总计** | - | - | **≤51** |

---

## 8. 音频系统

### 8.1 音频引擎选型

**使用Cocos Creator内置音频引擎**，无需额外引入。

Cocos 3.x 音频引擎基于WebAudio API，支持：
- 多通道混音
- 音量控制/淡入淡出
- 循环播放
- 音效池（同时播放多个音效）

### 8.2 BGM/音效/语音管理

```typescript
class AudioMgr {
    private bgmId: number = -1;
    private sfxPool: Map<string, number[]> = new Map(); // 音效实例池

    // BGM管理
    playBGM(name: string, fadeIn: number = 1.0): void {
        // 淡出当前BGM → 淡入新BGM
        // BGM资源加载策略：场景切换时预加载
    }

    stopBGM(fadeOut: number = 1.0): void { ... }

    // 音效管理
    playSFX(name: string, volume: number = 1.0): void {
        // 从音效池中获取一个空闲实例播放
        // 同一音效最大同时播放数：3
    }

    // 3D音效（距离衰减）
    playSFX3D(name: string, position: Vec2): void {
        const dist = position.sub(Camera.main.position).length();
        const volume = Math.max(0, 1 - dist / 500);
        this.playSFX(name, volume);
    }

    // 语音管理
    playVoice(name: string): void {
        // 语音播放时降低BGM音量至30%
        // 语音结束后恢复BGM音量
    }
}
```

### 8.3 音频资源加载策略

```
音频资源管理：
├── BGM（MP3，128kbps）
│   ├── 主菜单BGM：~800KB
│   ├── 战斗BGM：~1MB
│   ├── Boss BGM：~800KB
│   ├── PVP BGM：~800KB
│   └── 加载策略：场景切换时预加载，单流播放
├── 音效（MP3，64kbps，短音效）
│   ├── UI音效（10个）：~50KB
│   ├── 战斗音效（20个）：~200KB
│   ├── 塔攻击音效（8个）：~100KB
│   └── 加载策略：首包预加载UI音效，战斗分包加载战斗音效
├── 语音（MP3，96kbps）
│   ├── 新手引导语音（10段）：~500KB
│   ├── Boss登场语音（5段）：~300KB
│   └── 加载策略：远程按需加载（非首包）
└── 音频总计
    ├── 首包：~150KB（UI音效）
    ├── 分包：~2MB（BGM+战斗音效）
    └── 远程：~800KB（语音）
```

---

## 9. 测试方案

### 9.1 单元测试策略

```typescript
// 使用 Jest + Cocos Test Framework
// 覆盖核心逻辑模块

测试覆盖率目标：
├── 伤害计算引擎：100%
├── Rogue随机算法：100%
├── ELO匹配算法：100%
├── 经济数值引擎：100%
├── 资源管理器：90%
├── 对象池：90%
├── 战斗状态机：85%
└── 总体目标：≥80%

// 示例测试
describe('DamageEngine', () => {
    it('should calculate base damage correctly', () => {
        const result = engine.calculateDamage(archerTower, basicEnemy, context);
        expect(result.damage).toBeCloseTo(100, -1);
    });

    it('should apply element multiplier', () => {
        const result = engine.calculateDamage(fireTower, iceEnemy, context);
        expect(result.damage).toBeGreaterThan(baseDamage);
    });

    it('should guarantee minimum damage of 1', () => {
        const result = engine.calculateDamage(weakTower, tankyBoss, context);
        expect(result.damage).toBeGreaterThanOrEqual(1);
    });
});
```

### 9.2 自动化测试框架

```
自动化测试方案：
├── Cocos自动化测试框架
│   ├── 录制回放（录制操作序列，自动回放验证）
│   ├── UI自动化（基于节点查找+事件模拟）
│   └── 回归测试套件
├── 持续集成
│   ├── 每次提交触发单元测试
│   ├── 每日构建触发自动化回归
│   └── 发版前全量测试
└── 测试数据
    ├── Mock战斗数据（预设波次/敌人/塔配置）
    ├── Mock PVP数据（预设匹配/同步场景）
    └── Mock网络数据（延迟/丢包/断线模拟）
```

### 9.3 兼容性测试方案

```
兼容性测试矩阵：
├── 微信版本
│   ├── 最新稳定版
│   ├── 前2个主要版本
│   └── 微信PC版
├── 机型覆盖
│   ├── iOS：iPhone 8 → iPhone 15 Pro
│   ├── Android：低端(骁龙660) → 高端(骁龙8 Gen3)
│   ├── Android内存：2GB → 12GB
│   └── 屏幕比例：16:9 / 18:9 / 19.5:9 / 折叠屏
├── 性能基线设备
│   ├── 低端基准：骁龙660 + 4GB RAM（必须30fps+）
│   └── 中端基准：骁龙778G + 6GB RAM（必须60fps）
└── 已知问题设备
    └── 建立问题设备列表，针对性优化

测试方法：
├── 真机测试（核心设备采购）
├── 微信开发者工具模拟
├── WeTest云真机平台
└── 内测用户众包测试
```

### 9.4 性能测试方案

```
性能测试项：
├── 极端场景测试
│   ├── 50个敌人同屏 + 8个塔同时攻击
│   ├── 全特效开启 + Boss技能
│   └── 长时间运行（30分钟，检测内存泄漏）
├── 加载性能
│   ├── 冷启动时间
│   ├── 首屏渲染时间
│   └── 分包加载时间
├── 帧率稳定性
│   ├── 不同场景的FPS曲线
│   ├── 帧耗时分布（P50/P90/P99）
│   └── GC暂停时间
└── 内存分析
    ├── 各场景内存占用
    ├── 内存增长趋势
    └── 内存泄漏检测
```

### 9.5 PVP压测方案

```
PVP压测方案：
├── 压测场景
│   ├── 同时匹配：100/500/1000/5000组
│   ├── 长时间对局：1000组同时进行
│   └── 断线重连：100组同时断线重连
├── 压测指标
│   ├── 匹配延迟：P50/P90/P99
│   ├── 同步延迟：P50/P90/P99
│   ├── 服务器CPU/内存占用
│   └── 错误率
├── 压测工具
│   ├── 自研压测客户端（模拟PVP行为）
│   ├── 云函数并发测试
│   └── WebSocket压力测试
└── 通过标准
    ├── 1000组对局同时进行：匹配<3s，同步<100ms
    ├── 错误率<0.1%
    └── 断线重连成功率>99%
```

---

## 10. 构建与发布

### 10.1 构建流程

```
构建流程：
1. 代码质量检查（ESLint + 单元测试）
2. TypeScript编译
3. 资源处理
   ├── 纹理压缩（ASTC/ETC2）
   ├── Spine优化（二进制格式）
   ├── 音频压缩
   └── 图集打包
4. 引擎裁剪（移除不需要的模块）
5. 代码压缩（UglifyJS + Tree-shaking）
6. 分包配置
7. 构建微信小游戏工程
8. 微信开发者工具验证
9. 自动提审

CI/CD流水线：
git push → 代码检查 → 测试 → 构建 → 上传体验版 → 通知测试
```

### 10.2 代码分包策略

```
微信小游戏分包配置（game.json）：
{
    "subpackages": [
        {
            "name": "battle",
            "root": "subpackages/battle/"
        },
        {
            "name": "pvp",
            "root": "subpackages/pvp/"
        },
        {
            "name": "advanced",
            "root": "subpackages/advanced/"
        },
        {
            "name": "social",
            "root": "subpackages/social/"
        }
    ]
}

分包加载时机：
├── 首包：启动时自动加载（≤4MB）
├── battle：点击"开始战斗"时预加载
├── pvp：进入PVP大厅时预加载
├── advanced：解锁高级内容时按需加载
└── social：首次打开社交/商店时加载

预加载策略：
- 在Loading界面后台预加载下一场景的分包
- 使用 wx.loadSubpackage() API
- 加载进度显示在Loading界面
- 加载失败重试3次
```

### 10.3 多端构建配置

```typescript
// Cocos Creator多端构建配置
// 微信小游戏构建
const wechatConfig = {
    platform: 'wechatgame',
    appid: 'wx1234567890',
    subpackages: [...],
    orientation: 'portrait',
    seprateEngine: true,      // 引擎分离（微信提供公共引擎库）
    buildFragShader: false,
};

// PC小游戏构建
const pcConfig = {
    platform: 'wechatgame-pc',
    appid: 'wx1234567890',
    orientation: 'landscape',  // PC横屏
    resolution: { width: 1920, height: 1080 },
    inputMode: 'keyboard_mouse', // 键鼠输入
};

// 双端差异处理（运行时判断）
class PlatformAdapter {
    static isPC(): boolean {
        return wx.getSystemInfoSync().platform === 'windows'
            || wx.getSystemInfoSync().platform === 'mac';
    }

    // 输入适配
    static getInputMode(): InputMode {
        return this.isPC() ? InputMode.KEYBOARD_MOUSE : InputMode.TOUCH;
    }

    // 分辨率适配
    static getDesignResolution(): Size {
        return this.isPC()
            ? { width: 1920, height: 1080 }
            : { width: 750, height: 1334 };
    }

    // 社交功能降级
    static canShare(): boolean {
        return !this.isPC(); // PC端降级为截图+复制链接
    }
}
```

### 10.4 发布流程与审核

```
发布流程：
1. 代码冻结 → 构建Release包
2. 内部测试（冒烟测试 + 性能测试）
3. 体验版测试（10人内测）
4. 提交微信审核
5. 审核通过 → 发布上线
6. 灰度发布（5% → 20% → 50% → 100%）

审核注意事项：
├── 微信小游戏内容规范
│   ├── 不含暴力/色情/政治敏感内容
│   ├── 用户隐私合规
│   └── 未成年人保护
├── 技术审核
│   ├── 首包≤4MB
│   ├── 不含违规API调用
│   └── 性能达标
└── 审核周期：1-3个工作日
```

### 10.5 热更新方案

```typescript
class HotUpdateSystem {
    // Cocos原生热更新方案
    private hotUpdate: HotUpdate;

    // 检查更新
    async checkUpdate(): Promise<UpdateInfo> {
        const localManifest = this.getLocalManifest();
        const remoteManifest = await this.fetchRemoteManifest();

        if (remoteManifest.version > localManifest.version) {
            return {
                hasUpdate: true,
                version: remoteManifest.version,
                size: this.calculateUpdateSize(localManifest, remoteManifest),
                assets: this.getDiffAssets(localManifest, remoteManifest),
            };
        }
        return { hasUpdate: false };
    }

    // 下载更新（后台下载，不阻塞游戏）
    async downloadUpdate(updateInfo: UpdateInfo): Promise<void> {
        // 1. 下载差异资源到临时目录
        // 2. 校验MD5
        // 3. 替换本地资源
        // 4. 更新版本号
        // 5. 重启生效（提示用户）
    }
}

// 热更新范围
// ✅ 可热更：Spine动画、纹理、配置JSON、音频
// ❌ 不可热更：代码逻辑（需提审发布新版本）
// ⚠️ 变通：关键逻辑用配置驱动（JSON配置热更），减少代码变更需求
```

---

## 11. 项目排期

### 11.1 里程碑规划（5个月开发周期）

```
┌──────────────────────────────────────────────────────────────────┐
│ Phase 0: 技术预研（第1-2周）                                      │
│ ├── 引擎裁剪验证（首包4MB可行性验证）                              │
│ ├── Spine性能基准测试（50同屏单位）                               │
│ ├── PVP同步原型验证                                              │
│ └── 交付物：技术可行性报告                                        │
├──────────────────────────────────────────────────────────────────┤
│ Phase 1: 核心框架（第3-6周）                                      │
│ ├── 游戏框架搭建（架构/模块/通信）                                 │
│ ├── 资源管理器 + 对象池                                           │
│ ├── 战斗系统基础（状态机/波次管理）                                 │
│ ├── 防御塔系统（创建/攻击/索敌）                                   │
│ ├── 敌人系统（生成/寻路/状态）                                     │
│ ├── 地图编辑器初版                                                │
│ └── 交付物：可运行的1关战斗Demo                                   │
├──────────────────────────────────────────────────────────────────┤
│ Phase 2: 玩法完善（第7-12周）                                     │
│ ├── 8种防御塔完整实现                                             │
│ ├── 9种敌人+5种Boss实现                                          │
│ ├── 升级分支 + 双塔融合                                            │
│ ├── Rogue系统（Buff池/三选一/叠加）                               │
│ ├── 关卡系统（10+关卡）                                           │
│ ├── 闯关/挑战模式                                                 │
│ ├── 经济系统 + 养成系统                                           │
│ └── 交付物：完整PVE玩法可玩版本                                   │
├──────────────────────────────────────────────────────────────────┤
│ Phase 3: 社交与PVP（第13-16周）                                   │
│ ├── PVP匹配 + 状态同步                                            │
│ ├── 镜像攻防模式                                                  │
│ ├── ELO匹配 + 段位系统                                            │
│ ├── 好友约战                                                      │
│ ├── 微信分享（6种场景）                                           │
│ ├── 排行榜                                                        │
│ ├── 体力互赠/助战                                                 │
│ └── 交付物：PVP可对战版本                                        │
├──────────────────────────────────────────────────────────────────┤
│ Phase 4: 变现与打磨（第17-20周）                                  │
│ ├── 广告SDK集成（7个触发点）                                      │
│ ├── 支付SDK集成（5层内购）                                        │
│ ├── 通行证/月卡系统                                               │
│ ├── 商店系统                                                      │
│ ├── 每日挑战模式                                                  │
│ ├── PC端适配                                                      │
│ └── 交付物：功能完整版本                                         │
├──────────────────────────────────────────────────────────────────┤
│ Phase 5: 测试与优化（第21-22周）                                  │
│ ├── 性能优化（60fps+50同屏）                                      │
│ ├── 包体优化（首包4MB+总包20MB）                                  │
│ ├── 兼容性测试                                                    │
│ ├── PVP压测                                                      │
│ ├── Bug修复                                                       │
│ └── 交付物：发布候选版本(RC)                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 11.2 人员配置建议（15-20人团队）

| 角色 | 人数 | 职责 |
|------|------|------|
| **项目经理** | 1 | 项目管理、进度把控、资源协调 |
| **主程** | 1 | 架构设计、技术攻关、代码审查 |
| **客户端程序** | 4 | 战斗系统/塔系统/敌人系统/UI系统 |
| **服务端程序** | 2 | PVP服务/云函数/数据库/支付 |
| **技术美术(TA)** | 1 | Spine/特效/Shader/性能优化 |
| **游戏策划** | 2 | 关卡设计/数值设计/玩法设计 |
| **UI设计师** | 2 | 界面设计/交互设计/切图 |
| **角色美术** | 2 | Spine角色动画/敌人动画 |
| **特效美术** | 1 | 战斗特效/技能特效/粒子 |
| **测试** | 2 | 功能测试/性能测试/兼容性测试 |
| **运营** | 1 | 活动配置/数据分析/社区 |
| **合计** | **19** | |

### 11.3 各阶段交付物

| 阶段 | 交付物 | 验收标准 |
|------|--------|---------|
| Phase 0 | 技术可行性报告 | 首包≤4MB验证通过，50同屏60fps验证通过 |
| Phase 1 | 战斗Demo | 可运行1关战斗，8塔可放置攻击 |
| Phase 2 | PVE可玩版 | 10+关卡完整可玩，Rogue系统可用 |
| Phase 3 | PVP可玩版 | PVP匹配+对战可用，分享功能可用 |
| Phase 4 | 功能完整版 | 所有功能实现，PC端适配完成 |
| Phase 5 | RC版本 | 性能达标，Bug<50个，可提审 |

---

## 12. 风险评估与缓解

### 12.1 技术风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **首包4MB超标** | 高 | 致命 | Phase 0优先验证；引擎深度裁剪；纹理极致压缩；代码Tree-shaking |
| **PVP同步延迟** | 中 | 高 | 状态同步+本地预测；弱网降级方案；AI超时替代 |
| **50同屏卡顿** | 中 | 高 | 流场寻路；空间哈希索敌；逻辑帧分离；对象池 |
| **Spine性能不达标** | 低 | 中 | 预先基准测试；备选程序化动画；GPU蒙皮优化 |
| **微信API限制** | 中 | 中 | 提前研究API文档；降级方案；关注平台更新 |

### 12.2 性能风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **低端机无法60fps** | 高 | 高 | 低端机30fps保底；画质分级（3档）；低模LOD |
| **内存溢出** | 中 | 致命 | 内存预算+监控；内存警告处理；资源释放策略 |
| **GC卡顿** | 中 | 中 | 对象池；避免闭包；预分配数组；减少临时对象 |
| **加载时间过长** | 中 | 中 | 分包加载；预加载策略；资源优先级排序 |

### 12.3 兼容性风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **老旧微信版本不支持** | 低 | 中 | 设置最低微信版本要求；优雅降级提示 |
| **Android碎片化** | 高 | 中 | 核心设备真机测试；WeTest云真机；问题设备黑名单 |
| **PC端微信差异** | 中 | 中 | 提前PC端适配；输入方式降级；社交功能降级 |
| **iOS内存限制** | 低 | 高 | iOS内存预算更严格；WKWebView限制考虑 |

### 12.4 安全风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **存档篡改** | 高 | 中 | AES加密+校验；关键数据服务器验证 |
| **PVP作弊** | 中 | 高 | 服务器权威判定；操作合法性验证；行为模式检测 |
| **支付漏洞** | 低 | 致命 | 服务器验证支付回调；订单状态机；每日对账 |
| **广告刷量** | 中 | 中 | 服务器记录+限频；异常检测；人工审核 |
| **DDoS攻击** | 低 | 高 | 微信云开发自带防护；CDN加速；限流 |

---

## 附录

### A. 关键技术决策汇总

| 决策项 | 选择 | 核心理由 |
|--------|------|---------|
| 游戏引擎 | Cocos Creator 3.8.x | 微信官方推荐，包体控制优，2D+3D混合 |
| PVP同步 | 状态同步 | JS浮点不确定，防作弊需要服务器权威 |
| 寻路算法 | 流场+局部A* | 50同屏性能保障 |
| 动画方案 | Spine | Cocos原生支持，性能优秀 |
| 云服务 | 微信云开发+自建服务器 | 免运维+PVP需要实时服务器 |
| 音频引擎 | Cocos内置 | 无额外包体，功能够用 |
| 分包策略 | 首包4MB+4个分包+远程资源 | 满足微信硬约束 |
| 测试框架 | Jest+Cocos自动化 | TypeScript友好 |

### B. 性能预算总览

| 资源类别 | 预算 | 说明 |
|----------|------|------|
| 首包大小 | ≤4MB | 微信硬约束 |
| 总包大小 | ≤20MB | 微信硬约束 |
| 内存占用 | ≤300MB | 运行时峰值 |
| DrawCall | ≤60 | 60fps保障 |
| 同屏三角形 | ≤30K | 中端设备保障 |
| 同屏粒子数 | ≤300 | 特效性能预算 |
| 逻辑帧率 | 30fps | 非渲染逻辑更新率 |
| 渲染帧率 | 60fps | 硬指标 |
| 首屏加载 | ≤3秒 | 用户体验 |
| PVP延迟 | ≤100ms | 对战体验 |

### C. 代码规范要点

```typescript
// 1. 组件命名：PascalCase，以Component结尾
class TowerAIComponent extends Component { }

// 2. 事件常量集中定义
export const EventType = {
    BATTLE_START: 'BattleStart',
    WAVE_END: 'WaveEnd',
    // ...
} as const;

// 3. 禁止全局变量，使用管理器单例
// ✅ GameMgr.instance.getTowerSystem()
// ❌ window.towerSystem

// 4. 对象池归还时必须重置
// ✅
onRecycle() {
    this.node.removeFromParent();
    this.resetState();
}
// ❌ 直接销毁
// destroy()

// 5. 异步操作使用async/await，禁止回调地狱
// ✅
const data = await ResMgr.load('config/level_1');
// ❌
ResMgr.load('config/level_1', (data) => { ... });

// 6. 数值配置全部外置JSON，禁止硬编码
// ✅ towerConfig.json
// ❌ const DAMAGE = 100;
```

---

> **文档版本**：v1.0
> **最后更新**：2025-07
> **编写**：数析（Metric）— 产品战略团队数据分析师
> **审核**：待团队评审
