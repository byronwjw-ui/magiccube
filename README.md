# 小魔方大师 (MagicCube) 🧊

> 面向 9-15 岁孩子的 3x3 魔方 CFOP 学习站点：57 OLL + 21 PLL 全收录，3D 动画 + 闪卡 + 进度追踪。

## 🚀 一分钟运行

> ⚠️ **必须用本地服务器打开，不能直接双击 `index.html`**。
> 因为 `index.html` 通过 `<script src="js/xxx.js">` 加载子模块，浏览器在 `file://` 协议下会拒绝跨文件请求。

任选其一：

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# 或 VS Code 的 "Live Server" 扩展
```

然后访问 <http://localhost:8000>

## 🌐 部署

仓库根目录已自带 `.nojekyll` + `index.html`，可直接托管：

- **GitHub Pages**：Settings → Pages → Source 选 `main` 分支根目录
- **Vercel / Netlify / Cloudflare Pages**：直接连 GitHub 仓库，零配置
- 任意静态 CDN：上传整个仓库（`index.html` + `js/` 目录）

## 📁 文件结构

```
index.html        ← 主入口：HTML + CSS + 核心 JS（storage / router / cube / OLL 数据）
js/pll.js         ← 21 个 PLL 公式
js/learn.js       ← 公式库列表（tab / 子分类 / 搜索）
js/detail.js      ← 公式详情（3D 动画 + 复制 + 掌握标记）
js/practice.js    ← 练习闪卡（4 种模式）
js/dashboard.js   ← 我的（进度环 + 热力图 + 成就 + 头像）
js/pricing.js     ← Pro 定价（含本地试用 Pro 开关）
.nojekyll         ← GitHub Pages 跳过 Jekyll 处理
```

## ✨ 功能

| 页面 | 功能 |
|------|------|
| **首页** `#/` | Hero、卖点、CTA |
| **学习** `#/learn` | 公式库 78 个，OLL/PLL 切换、按图形筛选、关键词搜索 |
| **详情** `#/learn/:cat/:id` | cubing.js 3D 动画播放、复制算法、备选算法、标记掌握 |
| **练习** `#/practice` | 随机闪卡 / 仅 OLL / 仅 PLL / 弱项强化（Pro），自评后自动记录 |
| **我的** `#/dashboard` | 头像 + 昵称、OLL/PLL 掌握环、90 天热力图、8 枚成就 |
| **Pro** `#/pricing` | 功能对比、FAQ，"本地试用 Pro" 按钮一键解锁全部 78 个公式 |

### 数据范围

- **免费**：10 个 OLL（27/26/21/22/23/24/25/44/45/33）+ 5 个 PLL（Ua/Ub/H/Z/Aa）
- **Pro**：全部 57 OLL + 21 PLL
- 公式来自 CFOP 社区通用版本（Cubeskills / J Perm 风格）

## 🎨 品牌色

- 魔方黄 `#FFD500`
- 魔方蓝 `#0046AD`
- 背景灰 `#F7F8FA`

## 🛡 离线行为

- **核心界面 / 数据 / 闪卡 / 进度**：完全本地运行，断网照常使用。
- **3D 魔方动画**：依赖 [cubing.js](https://js.cubing.net) CDN，首次加载 ~600KB；断网或 CDN 不可达时**自动降级**为算法文本展示，不会白屏。
- **数据持久化**：localStorage，键前缀 `mc_*`，可在「我的 → 危险区」一键清空。

## License

MIT
