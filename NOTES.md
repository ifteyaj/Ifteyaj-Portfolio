# Ifteyaj-Portfolio-clone · 克隆笔记

## 源信息
- 原站 URL: https://www.simonholm.studio/
- 源码仓库:
- 原作者:
- 许可证:
- 致谢要求:

## 技术栈
- 框架 / 关键库 / Node 版本:

## 复刻前预判
- 复杂度等级: 
- 推荐模式: 
- 可高保真的部分:
- 需要近似或替代的部分:
- 不克隆的部分:
- 主要风险:

## 跑起来
```bash
python3 -m http.server 8123   # 静态版 simonholm-studio.html
cd Ifteyaj-Portfolio && npm run dev   # Next.js 复刻版 (localhost:3000)
```

## 改了什么（对照原版）
- 建 Next.js 16 + React 19 + Tailwind v4 项目 `Ifteyaj-Portfolio/`
- 从 RECON rootVariables 抽取 token 到 `src/styles/globals.css` + tailwind.config.ts
- 自托管字体 PPNeueMontrealTT / PT Serif（`public/fonts/`）
- 组件：Navbar（lottie logo + 双文本 hover 菜单 + LiveClock）、Loader（计数器/淡入淡出）、Hero（全屏主滑 + 数字导航 + 底部滑条 + prev/next + footer）、CustomCursor、Lottie 包装器
- 交互：Lenis 平滑滚动、GSAP 载入动画（counter 0→100）、滚轮/键盘/箭头切换 slide、menu-link 双文本 hover、视频 slide 自动播放、全屏 toggle
- Lottie fixtures 放入 `public/lottie/`（nav-logo / logo-loader / btn-open / btn-close）
- 依赖新增：gsap, lottie-web, lenis, framer-motion
- 验证：`npm run lint` 0 error、`npm run build` 通过、dev server HTTP 200

## 原站 vs 克隆站
| 模块 | 原站表现 | 克隆实现 | 差异 / 取舍 | 证据 |
|---|---|---|---|---|
| 首屏 |  |  |  |  |
| 导航 |  |  |  |  |
| 核心动效 |  |  |  |  |
| 内容区块 |  |  |  |  |
| 移动端 |  |  |  |  |

## 复刻评分
- 源证据: /5
- 结构保真: /5
- 视觉保真: /5
- 动效/交互: /5
- 响应式: /5
- 功能完整: /5
- 内容替换: /5
- 法务/部署风险: /5
- 总评:

## 替换地图（要换什么改哪）
- 文字 -> 文件 行
- 图片/媒体 -> 目录
- 配色 -> CSS 变量 / theme
- 3D 模型 / 字体 ->

## 验证
- [x] 本地跑通、build 通过、lint 0 error、dev server HTTP 200
- [ ] 截图对照原站（RECON/screenshots/）
- 验证不了的点（如实记，别伪造）:
  - /work /about /work/* 子路由尚未实现（导航为超链接，点击会 404）
  - 全屏 toggle 用浏览器 Fullscreen API 近似原站
  - 截图对照需 DevTools 在各视口执行，尚未做
