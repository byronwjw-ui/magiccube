# 小魔方大师 (MagicCube)

> 3x3 魔方 CFOP 公式学习 MVP。面向 9-15 岁孩子及家长，后期会扩展为 C 端订阅 + B 端机构 SaaS。

## 技术栈

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** + shadcn/ui 风格组件
- **cubing.js** `^0.55.x` 魔方可视化（`<twisty-player>` Web Component）
- **Zustand** 轻量状态管理
- **canvas-confetti** 完成动画
- 部署：Vercel；包管理：pnpm

## 本地运行

```bash
pnpm install
pnpm dev
# 访问 http://localhost:3000
```

## 部署到 Vercel

1. 仓库推到 GitHub
2. Vercel Dashboard → New Project → 选择仓库
3. Framework Preset 默认 Next.js，点 Deploy
4. 无需额外环境变量（v1 纯前端）

## 项目结构

```
app/
  page.tsx              首页
  learn/                公式学习区
    page.tsx            OLL/PLL 总览
    [category]/[id]/    公式详情
  practice/             练习模式（闪卡/计时/弱项）
  dashboard/            个人中心
  pricing/              定价页
components/
  cube/                 魔方可视化组件
  ui/                   通用 UI 组件
lib/
  storage.ts            存储抽象层（未来可切后端 API）
  analytics.ts          埋点封装
  formulas/             57 OLL + 21 PLL 数据
types/                  TS 类型定义
```

## 未来扩展点

- **存储层**：`lib/storage.ts` 是唯一读写入口，切换后端只需替换实现，业务代码不动。
- **B 端预留**：`UserProgress.classroomId` 字段预留，未来老师可以看到班级进度。
- **商业化**：`isPremium` 标记 + VIP 锁弹窗已接入，接支付只需接 Stripe/支付宝。
- **埋点**：`lib/analytics.ts` 的 `track()` 函数已预留，可接 Mixpanel/PostHog。
- **匹配用户体系**：匹名用户使用 `mc_anon_uid` (uuid)，后续接登录后可迁移进度数据。

## 开发状态

见 PR `feat/mvp-v1`。计划分 6 个 commit 交付，当前进度：

- [x] #1 脚手架 + 主题 + 目录骨架
- [ ] #2 数据层 (types + storage + analytics + 78 个公式)
- [ ] #3 首页 + 学习列表 + 详情页
- [ ] #4 练习闪卡 + 撞火动画
- [ ] #5 个人中心 + 热力图 + 成就
- [ ] #6 定价页 + Premium gate + README 完善
