# 视频分享平台 - 技术架构文档

## 1. 技术栈选择

| 类别 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | React 18 + TypeScript | 类型安全，生态完善 |
| 构建工具 | Vite 5 | 快速的开发体验 |
| 样式方案 | Tailwind CSS 3 | 原子化 CSS，快速开发 |
| 状态管理 | Zustand | 轻量级状态管理 |
| 路由 | React Router v6 | 声明式路由 |
| 图标 | Lucide React | 统一风格图标库 |
| 包管理 | pnpm | 高效的包管理工具 |

## 2. 项目初始化

### 2.1 创建项目
```bash
pnpm create vite-init . --template react-ts --force
```

### 2.2 目录结构
```
/workspace/
├── .trae/
│   └── documents/          # 项目文档
├── src/
│   ├── assets/             # 静态资源
│   ├── components/         # 通用组件
│   │   ├── layout/         # 布局组件
│   │   ├── video/          # 视频相关组件
│   │   ├── common/         # 通用UI组件
│   │   └── danmu/          # 弹幕组件
│   ├── hooks/              # 自定义Hooks
│   ├── pages/              # 页面组件
│   ├── store/              # Zustand状态管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── data/               # Mock数据
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 3. 组件设计

### 3.1 布局组件
- **Layout**: 主布局组件，包含导航栏和内容区
- **Navbar**: 顶部导航栏（Logo、搜索框、用户信息）
- **Sidebar**: 侧边栏（分区导航）
- **Footer**: 页脚

### 3.2 视频组件
- **VideoCard**: 视频卡片（封面、标题、UP主、播放量）
- **VideoList**: 视频列表容器
- **VideoPlayer**: 视频播放器
- **Danmaku**: 弹幕系统组件

### 3.3 通用组件
- **Button**: 按钮组件
- **Input**: 输入框组件
- **Avatar**: 用户头像
- **Carousel**: 轮播图组件

## 4. 页面路由

| 路径 | 页面 | 文件 |
|------|------|------|
| `/` | 首页 | `pages/Home.tsx` |
| `/category/:id` | 分区页 | `pages/Category.tsx` |
| `/watch/:id` | 播放页 | `pages/Watch.tsx` |
| `/search` | 搜索页 | `pages/Search.tsx` |
| `/user/:id` | 用户中心 | `pages/User.tsx` |

## 5. 状态管理 (Zustand Store)

### 5.1 VideoStore
- 当前播放视频信息
- 播放状态（播放/暂停）
- 音量设置
- 全屏状态

### 5.2 DanmakuStore
- 弹幕开关状态
- 弹幕透明度
- 弹幕列表

### 5.3 UserStore
- 当前用户信息
- 登录状态
- 收藏列表

## 6. Mock 数据结构

### 6.1 视频数据
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: number; // 秒
  viewCount: number;
  likeCount: number;
  coinCount: number;
  favoriteCount: number;
  danmakuCount: number;
  uploadTime: string;
  category: Category;
  author: User;
}
```

### 6.2 用户数据
```typescript
interface User {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  sign: string;
  followCount: number;
  fanCount: number;
}
```

### 6.3 分区数据
```typescript
type Category = 
  | 'animation'  // 动画
  | 'anime'       // 番剧
  | 'music'       // 音乐
  | 'game'        // 游戏
  | 'tech'        // 科技
  | 'life'        // 生活
  | 'entertainment' // 娱乐
  | 'film';       // 影视
```

## 7. 弹幕系统设计

### 7.1 弹幕类型
- **滚动弹幕**：从右向左滚动
- **顶部弹幕**：固定在顶部
- **底部弹幕**：固定在底部

### 7.2 弹幕样式
- 白色描边文字
- 支持透明度调节
- 随机颜色（柔和色调）

## 8. 样式规范

### 8.1 色彩变量 (Tailwind)
```javascript
colors: {
  primary: '#00A1D6',
  secondary: '#FB7299',
  accent: '#FFD700',
  background: '#1A1A2E',
  card: '#252540',
  text: '#FFFFFF',
  'text-secondary': '#99A2B8',
}
```

### 8.2 间距系统
- 基础单位：4px
- 页面内边距：16px / 24px / 32px
- 组件间距：8px / 12px / 16px / 24px

### 8.3 圆角
- 按钮/输入框：6px
- 卡片：8px / 12px
- 头像：50%（圆形）
- 视频封面：8px

## 9. 动画规范

### 9.1 过渡动画
- 默认过渡时长：200ms
- 缓动函数：ease-out

### 9.2 Hover 效果
- 卡片：scale(1.02) + shadow
- 按钮：背景色加深 10%

### 9.3 页面切换
- 淡入淡出：opacity 0→1, 300ms
