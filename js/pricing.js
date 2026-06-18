/* =============================================================================
 * Pro 定价页
 *   - Hero：标题 + 卖点
 *   - 两栏对比：免费 vs Pro
 *   - 「试用 Pro（本地体验）」开关：把 isPremium 翻成 true，立即解锁全部公式
 *   - FAQ
 * ============================================================================= */
(function(){

  function featureRow(text, free, pro) {
    return '<tr>' +
      '<td style="padding:10px 0;border-bottom:1px solid var(--line)">' + escapeHtml(text) + '</td>' +
      '<td class="center" style="padding:10px 0;border-bottom:1px solid var(--line)">' + (free ? '✓' : '—') + '</td>' +
      '<td class="center" style="padding:10px 0;border-bottom:1px solid var(--line);color:var(--blue);font-weight:600">' + (pro ? '✓' : '—') + '</td>' +
    '</tr>';
  }

  window.renderPricing = function() {
    var root = document.getElementById('pricing-root');
    if (!root) return;
    var u = Storage.getUser();
    track('pricing_view', { isPremium: u.isPremium });

    root.innerHTML = '' +
      '<section class="center">' +
        '<div class="hero-badge">💎 Pro 即将上线</div>' +
        '<h1>解锁全部 78 个公式 + 智能练习</h1>' +
        '<p class="mt-4 t-muted text-lg">免费版包含 10 个 OLL + 5 个 PLL，覆盖最常用场景；Pro 解锁全部公式与训练工具。</p>' +
      '</section>' +

      '<section class="mt-10 grid grid-2">' +
        '<div class="card">' +
          '<div class="text-sm t-muted">免费</div>' +
          '<div class="mt-1" style="font-size:2rem;font-weight:700">¥0</div>' +
          '<ul class="mt-4" style="display:flex;flex-direction:column;gap:8px">' +
            '<li>✓ 10 个常用 OLL（含 Sune / Anti-Sune / H / Pi / T 等）</li>' +
            '<li>✓ 5 个常用 PLL（Ua / Ub / H / Z / Aa）</li>' +
            '<li>✓ 3D 动画 + 算法复制</li>' +
            '<li>✓ 随机闪卡（仅免费公式）</li>' +
            '<li>✓ 本地进度 + 成就</li>' +
          '</ul>' +
          '<button class="btn btn-ghost btn-block mt-6" disabled>当前方案</button>' +
        '</div>' +
        '<div class="card" style="border:2px solid var(--yellow)">' +
          '<div class="flex items-center justify-between">' +
            '<div class="text-sm t-blue font-semibold">Pro（推荐）</div>' +
            '<span class="pill pill-yellow">🔥 限时</span>' +
          '</div>' +
          '<div class="mt-1" style="font-size:2rem;font-weight:700">¥39 <span class="text-sm t-muted" style="font-weight:400">/ 年</span></div>' +
          '<ul class="mt-4" style="display:flex;flex-direction:column;gap:8px">' +
            '<li>✓ 全部 57 OLL + 21 PLL（共 78 个）</li>' +
            '<li>✓ 弱项 AI 推荐 · 自适应闪卡</li>' +
            '<li>✓ 计时挑战与个人最佳记录</li>' +
            '<li>✓ 详细数据报告 + 学习曲线</li>' +
            '<li>✓ 免广告、终身免费迭代</li>' +
          '</ul>' +
          (u.isPremium
            ? '<button class="btn btn-ghost btn-block mt-6" id="btn-try-off">已是 Pro · 关闭体验</button>'
            : '<button class="btn btn-primary btn-block mt-6" id="btn-try-on">🎁 本地试用 Pro</button>') +
          '<p class="text-xs t-muted mt-2 center">注：v1 MVP 阶段，「本地试用」直接在浏览器中开启 Pro 权限，方便你体验完整功能。</p>' +
        '</div>' +
      '</section>' +

      '<section class="mt-10 card">' +
        '<h3>功能对比</h3>' +
        '<table class="mt-3" style="width:100%;border-collapse:collapse">' +
          '<thead><tr style="text-align:left;color:var(--muted);font-size:0.85rem">' +
            '<th style="padding:8px 0">功能</th>' +
            '<th class="center" style="padding:8px 0;width:80px">免费</th>' +
            '<th class="center" style="padding:8px 0;width:80px">Pro</th>' +
          '</tr></thead><tbody>' +
            featureRow('常用公式（15 个）', true, true) +
            featureRow('全部 78 个 OLL + PLL', false, true) +
            featureRow('3D 动画 + 算法复制', true, true) +
            featureRow('随机闪卡', true, true) +
            featureRow('弱项强化（AI 推荐）', false, true) +
            featureRow('计时挑战 / 个人最佳', false, true) +
            featureRow('详细数据报告', false, true) +
            featureRow('本地进度 + 成就墙', true, true) +
          '</tbody>' +
        '</table>' +
      '</section>' +

      '<section class="mt-10">' +
        '<h2 class="center">常见问题</h2>' +
        '<div class="mt-4 grid">' +
          '<div class="card"><h3>📖 公式从哪来？</h3><p class="mt-2 t-muted">采用 CFOP 社区通用版本（Cubeskills / J Perm），保留备选算法，方便你挑顺手的。</p></div>' +
          '<div class="card"><h3>💸 真要收费吗？</h3><p class="mt-2 t-muted">v1 MVP 阶段「本地试用」按钮可直接解锁，纯粹是用来让你完整体验。正式订阅在后续版本上线。</p></div>' +
          '<div class="card"><h3>🧊 没网络能用吗？</h3><p class="mt-2 t-muted">界面、文本、进度、闪卡都本地运行，断网照样能学；只是 3D 动画依赖 CDN，断网时会自动降级为算法文字展示。</p></div>' +
          '<div class="card"><h3>👶 孩子能用吗？</h3><p class="mt-2 t-muted">全中文界面、卡片大字、3D 动画直观，建议家长陪同设置头像和昵称后让孩子自学。</p></div>' +
        '</div>' +
      '</section>';

    var on = document.getElementById('btn-try-on');
    if (on) on.addEventListener('click', function(){
      Storage.updateUser({ isPremium: true });
      track('pro_try_on', {});
      toast('🎉 Pro 已开启，全部公式已解锁');
      renderPricing();
    });
    var off = document.getElementById('btn-try-off');
    if (off) off.addEventListener('click', function(){
      Storage.updateUser({ isPremium: false });
      track('pro_try_off', {});
      toast('已关闭 Pro 体验');
      renderPricing();
    });
  };

  if (typeof router === 'function' && parseHash() === '/pricing') window.renderPricing();
})();
