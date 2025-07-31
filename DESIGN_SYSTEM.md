# 萌系博客设计系统规范

## 🎨 设计理念

基于xLog的现代化设计理念，结合萌系文化特色，打造温馨、现代、易用的博客UI体验。

## 🌈 配色方案

### 主题色彩
```css
:root {
  /* 萌系主色调 - 粉色系 */
  --primary-color: #ff69b4;
  --primary-light: #ffb3d9;
  --primary-dark: #cc4a8c;
  
  /* 辅助色 */
  --secondary-color: #87ceeb;
  --accent-color: #ffd700;
  --success-color: #98fb98;
  --warning-color: #ffa500;
  --error-color: #ff6b6b;
  
  /* 中性色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --text-muted: #a0aec0;
  
  /* 毛玻璃效果 */
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-tertiary: #4a5568;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --text-muted: #cbd5e0;
  
  --glass-bg: rgba(45, 55, 72, 0.25);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}
```

## 🎭 组件设计规范

### 1. 毛玻璃卡片 (Glassmorphism)
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}
```

### 2. 萌系按钮
```css
.moe-button {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.moe-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
}

.moe-button:active {
  transform: translateY(0);
}
```

### 3. 渐变文字效果
```css
.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## 🌟 动画系统

### 缓动函数
```css
:root {
  --ease-out-cubic: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out-cubic: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 关键帧动画
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 105, 180, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 105, 180, 0.6); }
}
```

## 📱 响应式断点

```css
/* Mobile First 设计 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## 🎨 组件库结构

```
src/components/MoeUI/
├── Button/
│   ├── MoeButton.jsx
│   ├── GradientButton.jsx
│   └── FloatingButton.jsx
├── Card/
│   ├── GlassCard.jsx
│   ├── HoverCard.jsx
│   └── AnimatedCard.jsx
├── Layout/
│   ├── GlassContainer.jsx
│   ├── MoeHeader.jsx
│   └── MoeSidebar.jsx
├── Effect/
│   ├── ParticleBackground.jsx
│   ├── FloatingHearts.jsx
│   └── RainbowDivider.jsx
└── Theme/
    ├── ThemeProvider.jsx
    └── ThemeToggle.jsx
```

## 🎯 实现优先级

### 第一阶段 (核心改造)
1. CSS变量系统建立
2. 毛玻璃效果实现
3. 主题切换功能
4. 基础组件重构

### 第二阶段 (视觉增强)
1. 动画系统完善
2. 萌系组件库创建
3. 特效组件开发
4. 响应式优化

### 第三阶段 (体验提升)
1. Live2D交互优化
2. 页面转场动画
3. 微交互增强
4. 性能优化

## 🎮 交互设计原则

1. **反馈即时性**：所有交互都要有即时的视觉反馈
2. **动画流畅性**：使用硬件加速，确保60fps流畅度
3. **视觉层次感**：通过毛玻璃、阴影、层级建立空间感
4. **萌系亲和力**：圆角、渐变、柔和色彩营造温馨感觉
5. **可访问性**：确保色彩对比度和键盘导航支持

## 🎨 Live2D集成优化

1. **响应式适配**：根据屏幕尺寸调整Live2D尺寸和位置
2. **交互增强**：鼠标跟随、点击反应、语音互动
3. **性能优化**：懒加载、帧率控制、内存管理
4. **多模型切换**：用户可选择不同的看板娘模型