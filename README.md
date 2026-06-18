# 小魔方大师 (MagicCube) 🧊

> 3x3 / 2x2 魔方 CFOP 公式学习站点。

## 本地预览

这是一个 **零依赖、纯静态** 的单页站点，直接打开即可：

- macOS / Windows：双击 `index.html`，或拖到浏览器窗口里。
- 推荐：用一个本地静态服务器打开（剪贴板 API 在 `file://` 下会自动降级到 fallback，但 `http://` 下体验更好）。

```bash
# 任选其一
python3 -m http.server 8000
npx serve .
```

然后访问 http://localhost:8000

## 部署

### GitHub Pages

仓库根目录已自带 `index.html` 和 `.nojekyll`，在 Settings → Pages 里选择 `main` 分支根目录即可。

### 任意静态托管

上传 `index.html` 一个文件就够了。

## 品牌 & 主题

- 魔方黄 `#FFD500` · 魔方蓝 `#0046AD` · 背景浅灰 `#F7F8FA`
- 全中文界面，WCA notation (R U R') 保留英文 + 等宽字体。

## License

MIT
