# 消除达人 - 资源添加指南

## 📁 资源目录结构

```
assets/
├── textures/          # 图片资源
│   ├── ui/           # UI相关图片
│   │   ├── logo.png
│   │   ├── bg.png
│   │   ├── button_normal.png
│   │   └── button_pressed.png
│   ├── icons/        # 游戏图标
│   │   ├── icon_apple.png
│   │   ├── icon_banana.png
│   │   ├── icon_cherry.png
│   │   ├── icon_grape.png
│   │   ├── icon_lemon.png
│   │   ├── icon_orange.png
│   │   ├── icon_pear.png
│   │   └── icon_watermelon.png
│   ├── effects/      # 特效图片
│   │   └── particle.png
│   └── README.md
└── audio/            # 音频资源
    ├── bgm/          # 背景音乐
    │   └── main_bgm.mp3
    ├── sfx/          # 音效
    │   ├── click.mp3
    │   ├── match.mp3
    │   ├── level_complete.mp3
    │   ├── level_fail.mp3
    │   └── use_props.mp3
    └── README.md
```

## 🖼️ 图片资源规格

### 游戏图标 (icons/)
- **尺寸**: 128x128px 或 256x256px
- **格式**: PNG (支持透明背景)
- **数量**: 至少 4 种图标 (随关卡增加可添加到 8 种)
- **建议**: 使用水果、糖果、宝石等明亮色彩的图标

### UI元素 (ui/)
- **Logo**: 建议 400x200px
- **背景**: 750x1334px (或更大的拼接图)
- **按钮**: 建议 200x80px (九宫格图片)
- **星星**: 64x64px (用于星级显示)

### 特效 (effects/)
- **粒子纹理**: 64x64px 或 128x128px (PNG 透明)

## 🔊 音频资源规格

### 背景音乐 (bgm/)
- **格式**: MP3 或 AAC
- **时长**: 约 1-2 分钟 (可循环)
- **建议**: 轻松愉快的休闲游戏风格

### 音效 (sfx/)
- **格式**: MP3 或 WAV
- **时长**: 短音效 (0.5-2秒)
- **音量**: 适中 (可在代码中调整)

## 🎯 快速添加资源

1. 将准备好的图片放入 `assets/textures/` 对应目录
2. 将准备好的音频放入 `assets/audio/` 对应目录
3. 在 Cocos Creator 中刷新项目
4. 脚本会自动加载资源（需要在管理器中配置资源路径）

## 📝 资源引用配置

请在 `Constants.ts` 中更新资源路径配置：

```typescript
// 在 Constants 类中添加
public static readonly RESOURCES = {
    TEXTURES: {
        ICONS: {
            APPLE: 'textures/icons/icon_apple',
            BANANA: 'textures/icons/icon_banana',
            // ...
        },
        UI: {
            // ...
        }
    },
    AUDIO: {
        // ...
    }
};
```

## 💡 设计建议

### 图标设计
- 使用高对比度颜色，便于识别
- 保持风格统一
- 避免过于复杂的细节（移动端看不清）

### 色彩方案
- 主色: 橙色系 (#FF6B35) - 活泼、吸引人
- 辅助色: 青色系 (#4ECDC4) - 清新、友好
- 背景: 浅灰色 (#F5F5F5) - 简洁、不刺眼
- 文字: 深灰色 (#333333) - 易读

### UI设计原则
- 按钮要足够大，便于点击（最小 44pt）
- 重要信息放在视线区域上半部分
- 色彩不要过于繁杂
