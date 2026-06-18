# 小魔方大师 (MagicCube) 🧊

> 3x3 魔方 CFOP 公式学习站 · 57 OLL + 21 PLL · 全部内联在**一个 `index.html`** 文件里。

## ⚡ 使用方法

### 方式 1：双击打开（推荐）

下载 ZIP 解压后，**直接双击 `index.html`** 即可在浏览器中使用。
零依赖、零构建、零本地服务器要求。

### 方式 2：本地静态服务器

```bash
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

### 方式 3：部署到 GitHub Pages / Vercel / Netlify

仓库根目录已自带 `index.html` + `.nojekyll`，连上即可发布。

## 📦 文件结构

```
index.html   ← 唯一入口，所有 HTML / CSS / JS / 公式数据全部内联
.nojekyll    ← 让 GitHub Pages 跳过 Jekyll 处理
README.md
```

## ✨ 功能（5 页 SPA, hash 路由）

| 路由 | 功能 |
|------|------|
| `#/` 首页 | Hero、卖点、Pro 入口 |
| `#/learn` 学习 | 78 公式库，OLL/PLL 切换、按图形子分类筛选、关键词搜索 |
| `#/learn/:cat/:id` 详情 | cubing.js 3D 动画播放、复制算法、备选算法、标记掌握、上一个/下一个 |
| `#/practice` 练习 | 4 模式闪卡：随机 / 仅 OLL / 仅 PLL / 弱项强化（Pro） |
| `#/dashboard` 我的 | 头像选择、昵称、OLL/PLL 掌握环、90 天热力图、8 枚成就、危险区清空 |
| `#/pricing` Pro | 功能对比、FAQ、"本地试用 Pro"一键解锁全部 78 公式 |

### 数据范围

- **免费 15**：10 OLL（27/26/21/22/23/24/25/44/45/33） + 5 PLL（Ua/Ub/H/Z/Aa）
- **Pro 63**：剩余 47 OLL + 16 PLL，可通过定价页「本地试用 Pro」按钮一键解锁

## 🎨 品牌色

- 魔方黄 `#FFD500` · 魔方蓝 `#0046AD` · 背景 `#F7F8FA`

## 🛡 离线行为

- **界面 / 数据 / 闪卡 / 进度 / 成就**：100% 本地运行，断网照常使用。
- **3D 魔方动画**：通过 CDN 加载 [cubing.js](https://js.cubing.net)（~600KB，首次加载）。
  - 断网或 CDN 不可达 → 自动降级为算法文字展示，**绝不白屏**。
- **数据持久化**：localStorage，键前缀 `mc_*`。
- **危险区**：「我的」页底部一键清空所有本地数据。

## License

MIT
