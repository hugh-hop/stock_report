# AI 智能生图平台 - Pixelforge

## 1. Concept & Vision

**Pixelforge** 是一个专业的 AI 智能生图平台，专注于高分辨率商品海报生成。界面采用深色主题搭配霓虹渐变点缀，营造出专业创意工具的氛围，让用户感受到强大的 AI 能力与精致的视觉体验。整体风格介于专业创意软件与前沿 AI 实验室之间——科技感与艺术感的平衡。

## 2. Design Language

### Aesthetic Direction
深空科技风格（Deep Space Tech）— 灵感来源于宇宙深空与粒子对撞机视觉，结合高端视频编辑软件的专业感。

### Color Palette
```css
--bg-primary: #0a0a0f;        /* 深空背景 */
--bg-secondary: #12121a;        /* 卡片/面板背景 */
--bg-tertiary: #1a1a25;        /* 输入框/次级区域 */
--accent-primary: #6366f1;     /* 主强调色-靛蓝 */
--accent-secondary: #8b5cf6;   /* 副强调色-紫 */
--accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
--text-primary: #f8fafc;       /* 主要文字 */
--text-secondary: #94a3b8;     /* 次要文字 */
--text-muted: #64748b;         /* 弱化文字 */
--border: #1e1e2e;             /* 边框色 */
--success: #10b981;            /* 成功状态 */
--warning: #f59e0b;            /* 警告状态 */
--glow: rgba(99, 102, 241, 0.4); /* 发光效果 */
```

### Typography
- **Display Font**: "Clash Display" (Google Fonts) — 用于大标题和品牌
- **Body Font**: "Space Grotesk" — 用于界面文字
- **Mono Font**: "JetBrains Mono" — 用于代码/参数显示

### Spatial System
- 基础间距单位: 4px
- 卡片圆角: 16px
- 按钮圆角: 12px
- 输入框圆角: 8px

### Motion Philosophy
- 所有交互带有微妙的 scale 和 glow 变化
- 页面加载使用 staggered fade-in（100ms 间隔）
- 图片生成时使用脉冲动画和进度指示
- 悬停效果使用 200ms ease-out 过渡

## 3. Layout & Structure

### 整体布局
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo + Navigation + User Actions                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │                 │  │                                 │  │
│  │   参数配置面板   │  │        图片预览区域              │  │
│  │   - 提示词输入   │  │        - 生成的图片展示          │  │
│  │   - 风格选择     │  │        - 图片操作按钮            │  │
│  │   - 尺寸设置     │  │                                 │  │
│  │   - 质量/数量   │  │                                 │  │
│  │                 │  │                                 │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              功能Tab切换区                              │ │
│  │  [文生图] [图生图] [智能换头] [商品海报]                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              历史记录/图库区域                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 响应式策略
- Desktop (>1200px): 双栏布局，左侧参数，右侧预览
- Tablet (768-1200px): 单栏堆叠，参数在上，预览在下
- Mobile (<768px): 全宽堆叠，底部固定生成按钮

## 4. Features & Interactions

### 核心功能

#### 4.1 文生图 (Text to Image)
- **提示词输入**: 支持中英文，支持 Ctrl+Enter 提交
- **负面提示词**: 可折叠的负向提示词输入框
- **风格预设**: 15+ 预设风格（摄影、写实、动漫、插画等）
- **尺寸选择**: 1:1, 3:4, 4:3, 16:9, 9:16 等多种比例
- **生成数量**: 1-4 张可选
- **质量等级**: 快速/标准/高清三档

#### 4.2 图生图 (Image to Image)
- 拖拽或点击上传参考图片
- 图片预览与清除功能
- 融合强度滑动条 (0-100%)
- 支持蒙版局部重绘

#### 4.3 智能换头 (Face Swap)
- 上传原图（带人脸）
- 上传目标人脸
- 实时预览换脸效果
- 一键下载结果

#### 4.4 商品海报模板
- 内置 20+ 商品海报模板
- 智能识别商品区域
- 自动背景替换
- 文字/LOGO 叠加

### 交互细节

#### 生成按钮
- Default: 渐变背景 + 微光效果
- Hover: 发光增强 + scale(1.02)
- Active: scale(0.98) + 涟漪效果
- Loading: 脉冲动画 + 进度文字

#### 图片卡片
- Hover: 边框发光 + 操作按钮浮现
- 点击: 全屏预览（Lightbox）
- 右键菜单: 下载/复制/删除/收藏

#### 滑块控件
- 拖动时显示当前数值
- 释放后有弹性回弹动画

## 5. Component Inventory

### Header
- Logo: "PIXELFORGE" 渐变字
- Navigation: 功能切换标签
- Actions: 历史、收藏、设置图标按钮

### Prompt Input
- 多行文本输入
- 字数统计
- 清空按钮
- AI 助手快捷提示按钮

### Style Selector
- 网格/列表视图切换
- 风格缩略图预览
- 当前选中高亮边框

### Parameter Slider
- 标签 + 当前值显示
- 轨道 + 滑块 + 填充色

### Image Gallery Card
- 缩略图 + 状态标签
- 悬停操作栏
- 加载骨架屏

### Generation Panel
- 进度条 + 状态文字
- 取消按钮
- 预估时间

### Toast Notifications
- 成功/错误/信息三类型
- 自动消失（3秒）
- 手动关闭按钮

## 6. Technical Approach

### 技术栈
- **Framework**: 纯 HTML5 + CSS3 + Vanilla JavaScript（无框架依赖）
- **Icons**: Lucide Icons (CDN)
- **Fonts**: Google Fonts (Clash Display, Space Grotesk, JetBrains Mono)

### 文件结构
```
/workspace/
├── index.html          # 主页面
├── SPEC.md             # 本规格文档
```

### 关键实现
1. CSS Grid + Flexbox 布局
2. CSS Custom Properties 主题系统
3. Intersection Observer 实现滚动动画
4. LocalStorage 存储历史记录
5. Canvas 实现图片预览和处理

### 模拟数据
平台使用模拟数据进行演示，实际 AI 生图功能需对接后端 API（如 Stable Diffusion、Midjourney API 等）。
