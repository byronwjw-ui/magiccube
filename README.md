# 小魔方大师 (MagicCube) 🧊

> 3x3 魔方 CFOP 公式学习 MVP。面向 9-15 岁孩子及家长，未来会扩展为 **C 端订阅 + B 端机构 SaaS**。

[亚马逊雨林][本地运行](#本地运行)· [部署](#部署到-vercel) · [架构](#项目结构) · [未来扩展](#未来扩展点)

## 功能

- 📚 **公式库**：57 OLL + 21 PLL = 78 个标准 CFOP 公式，按图形分类过滤 + 搜索。
- 🎮 **魔方动画**：使用 [cubing.js](https://js.cubing.net/cubing/) `<twisty-player>`，列表用 2D 顶面图，详情页用交互式 3D。
- 🎴 **闪卡练习**：随机 10 题 / 轮，翻开看答案，高准确率触发 confetti 撞火。
- 📊 **个人中心**：OLL/PLL 掌握度环、GitHub 风热力图、连续天数、成就徽章。
- 🔒 **VIP 锁**：预设 `isPremium` 公式 / 高级练习模式点击触发升级弹窗。
- 🏫 **B 端入口**：定价页预留机构版联系入口（邮件 + 微信二维码占位）。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14 (App Router) + TypeScript |
| 样式 | TailwindCSS + shadcn/ui 风格自制组件 |
| 魔方可视化 | `cubing@^0.55.x` 的 `<twisty-player>` Web Component |
| 状态 | Zustand（预留）+ React state |
| 存储 | localStorage，统一走 `lib/storage.ts` 抽象层 |
| 动画 | canvas-confetti |
| 部署 | Vercel |
| 包管理 | pnpm |

## 本地运行

```bash
pnpm install
pnpm dev
# 访问 http://localhost:3000
```

> 首次打开公式详情页需下载 cubing.js 资源，请保持网络畅通。

## 部署到 Vercel

1. 将分支推到 GitHub。
2. 访问 [vercel.com/new](https://vercel.com/new) → Import 项目。
3. Framework 选 **Next.js**，Build Command 默认 `next build`，Output 默认。
4. 包管理选 **pnpm**（Vercel 会自动识别 `pnpm-lock.yaml`）。
5. 点 Deploy 即可，无需环境变量。

## 项目结构

```
app/
  page.tsx                    首页 (Hero + 卖点 + Pro 入口)
  learn/
    page.tsx                  OLL/PLL Tab + 子分类过滤 + 搜索 + 2D 顶面预览
    [category]/[id]/page.tsx  详情页 (3D 动画、复制、状态、上下一个)
  practice/
    page.tsx                  三种模式选择
    Flashcard.tsx             闪卡实现（+ confetti）
  dashboard/
    page.tsx                  身份、进度环、热力图、最近、成就徽章
  pricing/
    page.tsx                  双栏对比 + B 端入口 + FAQ
  layout.tsx, globals.css
components/
  cube/
    TwistyPlayer.tsx          cubing.js 的 React 包装（纯客户端）
    CubeView.tsx              ssr:false 的 dynamic 入口
  ui/
    Header.tsx                顶部导航
    PremiumModal.tsx          VIP 升级弹窗
    StatusBadge.tsx           new/learning/mastered 状态胶囊
    ProgressRing.tsx          SVG 进度环
    Heatmap.tsx               30 天热力图
    AvatarPicker.tsx          emoji 头像 + 昵称编辑
lib/
  storage.ts                  存储抽象层（唯一读写入口）
  analytics.ts                track(event, props)，可代入 Mixpanel/PostHog
  achievements.ts             成就定义 + 触发检测
  utils.ts                    cn / invertAlgorithm / 复制剪贴板 / 相对时间
  formulas/
    oll.ts                    57 个 OLL (含 setupMoves)
    pll.ts                    21 个 PLL (含 setupMoves)
    index.ts                  查询帮手函数
types/
  index.ts                    Formula / UserProgress / User / Session / Achievement
  twisty.d.ts                 <twisty-player> JSX 类型声明
```

## 数据与存储设计

所有业务代码 **只能通过 `lib/storage.ts` 读写数据**，不允许直接访问 `localStorage`。

迁移到后端时只需替换 `storage.ts` 内部实现（fetch 调用云端 API），**业务页面零修改**。

localStorage key 命名空间统一 `mc_` 前缀：

| Key | 含义 |
|---|---|
| `mc_anon_uid` | 匿名用户 uuid，按需生成 |
| `mc_user` | User（昵称/头像/isPremium） |
| `mc_progress` | 所有公式的学习进度 |
| `mc_sessions` | 练习会话记录（最近 200 场） |
| `mc_achievements` | 成就状态 |

## 未来扩展点

- **后端 API 接入**：重写 `lib/storage.ts` 内部为 fetch，可保留 localStorage 为本地缓存。
- **账号体系**：接入后在首次登录时将 `mc_anon_uid` 上报以迁移进度。
- **支付**：`/pricing` 页的 CTA 接 Stripe Checkout / 支付宝；服务端 webhook 更新 `User.isPremium`。
- **B 端（重点）**：
  - `UserProgress.classroomId` 字段已预留。
  - 增加老师后台：班级、学生列表、进度表、练习热力。
  - 多租户 SaaS：`organizationId` 隔离 + 品牌化主题 token。
- **学习路径优化**：现在是随机抽题，可接入 SRS（间隔重复，类似 Anki）。
- **埋点**：`lib/analytics.ts` 的 `track()` 接 Mixpanel / PostHog / GA4。
- **准确率识别**：计时挑战可增加 WCA notation parser，判断公式是否等价（可用 cubing.js 的 `KPuzzle`）。
- **PWA**：加 manifest + service worker 可装到桌面/iPad。

## SSR 注意事项

`<twisty-player>` 是浏览器 Custom Element，**不能进入 SSR**。本项目的解决方案：

1. `next.config.js` 加 `transpilePackages: ['cubing']`。
2. `components/cube/CubeView.tsx` 是 `dynamic(() => import('./TwistyPlayer'), { ssr: false })`。
3. 所有页面从 `CubeView` 入口导入，不要直接使用 `TwistyPlayer`。

## 品牌 & 主题

- 魔方黄 `#FFD500` · 魔方蓝 `#0046AD` · 背景浅灰 `#F7F8FA`
- emoji 头像池：🦊 🐼 🐯 🐰 🐸 🐵 🐨 🦁
- 全中文界面，但 WCA notation (R U R') 保留英文 + 等宽字体。

## License

MIT
