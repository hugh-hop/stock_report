
# 开发指引

本文档说明如何在 Cocos Creator 中使用此项目代码。

## 项目初始化

### 1. 创建新项目

1. 打开 Cocos Creator 3.8+
2. 创建新的空项目，命名为 "elimination-master"
3. 选择 2D 项目模板

### 2. 复制项目代码

将本项目中的以下内容复制到您的 Cocos Creator 项目中：

- `assets/scripts/` - 脚本文件
- `assets/data/` - 数据文件
- `.trae/documents/` - 文档（可选）
- `README.md` - 说明文档

## 场景创建

### 开始场景 (Start.scene)

创建一个名为 "Start" 的场景，并配置：

1. **添加 Canvas 节点**
2. **添加 StartUI 脚本**
3. **创建以下节点并绑定到脚本属性：**
   - `startButton` - 开始游戏按钮
   - `dailyGiftButton` - 每日礼包按钮
   - `musicButton` - 音乐开关按钮
   - `soundButton` - 音效开关按钮
   - `coinsLabel` - 金币显示标签
   - `dailyGiftPanel` - 每日礼包弹窗（默认隐藏）

### 关卡选择场景 (LevelSelect.scene)

创建一个名为 "LevelSelect" 的场景：

1. **添加 Canvas 节点**
2. **添加 LevelSelectUI 脚本**
3. **创建以下节点：**
   - `backButton` - 返回按钮
   - `levelsContainer` - 关卡容器（ScrollView）
   - `highestLevelLabel` - 最高关卡显示

### 游戏场景 (Game.scene)

创建一个名为 "Game" 的场景：

1. **添加 Canvas 节点**
2. **添加 GameUI 脚本**
3. **创建以下节点：**
   - `backButton` - 返回按钮
   - `levelLabel` - 关卡标签
   - `timeLabel` - 时间标签
   - `targetLabel` - 目标标签
   - `coinsLabel` - 金币标签
   - `gridContainer` - 游戏网格容器
   - `hintButton` - 提示按钮
   - `removeButton` - 移除按钮
   - `addTimeButton` - 加时按钮
   - 对应的数量标签

### 结算场景 (Result.scene)

创建一个名为 "Result" 的场景：

1. **添加 Canvas 节点**
2. **添加 ResultUI 脚本**
3. **创建成功和失败面板：**
   - `successPanel` - 成功面板
   - `failurePanel` - 失败面板
   - 各种按钮和标签

## 预制体创建

### GridItem.prefab

创建网格元素预制体：

1. 创建空节点，命名为 "GridItem"
2. 添加 Sprite 组件
3. 添加 Button 组件（可选）
4. 设置合适的尺寸（建议 80x80）

### LevelItem.prefab

创建关卡选择项预制体：

1. 创建空节点，命名为 "LevelItem"
2. 添加 Button 组件
3. 添加 Label 显示关卡号
4. 添加 Stars 子节点（3个星星）

### Star.prefab

创建星星预制体：

1. 创建 Sprite 节点，命名为 "Star"
2. 设置星星图片

## 资源准备

### 图片资源

在 `assets/textures/` 目录下准备：

- `icons/` - 8种不同的图标（水果/动物等）
- `ui/` - UI 元素（按钮背景、图标等）
- `backgrounds/` - 背景图片

### 音频资源

在 `assets/audio/` 目录下准备：

- `music/` - 背景音乐
- `sounds/` - 音效（点击、消除、成功等）

## 脚本配置

### 1. 设置初始场景

在 Cocos Creator 的项目设置中，设置开始场景为 "Start"。

### 2. 配置广告

在 `AdManager.ts` 中配置您的微信广告位 ID。

### 3. 配置云开发（可选）

如需使用排行榜功能，需要：

1. 开通微信云开发
2. 创建数据库集合
3. 在 `SocialManager.ts` 中配置相关逻辑

## 构建和发布

### 1. 构建项目

1. 在 Cocos Creator 中选择：项目 -&gt; 构建发布
2. 平台选择：微信小游戏
3. 配置发布选项
4. 点击构建

### 2. 微信开发者工具

1. 打开微信开发者工具
2. 导入构建后的项目
3. 配置 AppID
4. 测试游戏功能
5. 上传并提交审核

## 测试建议

### 功能测试

- [ ] 关卡解锁功能
- [ ] 消除逻辑验证
- [ ] 计时功能
- [ ] 道具使用
- [ ] 广告展示
- [ ] 数据存储
- [ ] 分享功能

### 兼容性测试

- [ ] iOS 设备测试
- [ ] Android 设备测试
- [ ] 不同屏幕尺寸适配

### 性能测试

- [ ] 内存占用
- [ ] 帧率稳定性
- [ ] 加载时间

## 常见问题

### 1. 场景切换问题

确保所有场景都已添加到项目的构建场景列表中。

### 2. 数据存储问题

检查 DataManager 中的 localStorage 读写操作是否正常。

### 3. 广告无法加载

确保：
- 已正确配置广告位 ID
- 微信开发者工具中已打开广告调试
- 已在真机上测试

## 下一步

完成基础功能后，可以考虑：

1. 添加更多关卡
2. 优化 UI/UX
3. 添加更多音效
4. 实现成就系统
5. 添加排行榜功能
6. 优化性能

---

祝开发顺利！
