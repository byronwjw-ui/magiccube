/* =============================================================================
 * 公式库视图
 *   - Tab：OLL / PLL
 *   - 子分类 chips（按图形/类型筛选）
 *   - 搜索框（编号或名称）
 *   - 卡片列表：编号 + 名称 + 算法（脱敏给 Pro 用🔒）+ 难度 + 状态 badge
 * ============================================================================= */
(function(){
  var STATE = {
    cat: 'OLL',
    sub: 'ALL',
    keyword: ''
  };

  function statusBadge(status) {
    if (status === 'mastered') return '<span class="badge badge-mastered">✓ 已掌握</span>';
    if (status === 'learning') return '<span class="badge badge-learning">学习中</span>';
    return '<span class="badge badge-new">未练习</span>';
  }

  function diffStars(d) {
    var full = '★'.repeat(d);
    var empty = '☆'.repeat(3 - d);
    return '<span class="t-muted text-xs" title="难度">' + full + empty + '</span>';
  }

  function maskAlg(alg, isPremium, isPremiumUser) {
    if (!isPremium || isPremiumUser) return escapeHtml(alg);
    // 给免费用户屏蔽细节但展示长度
    return '<span class="t-muted">🔒 解锁后查看公式</span>';
  }

  function cardHtml(f) {
    var user = Storage.getUser();
    var prog = Storage.getProgress(f.id);
    var status = (prog && prog.status) || 'new';
    var locked = f.isPremium && !user.isPremium;
    var href = locked ? 'javascript:void(0)' : '#/learn/' + f.category + '/' + f.id;

    return '' +
      '<a class="card hover formula-card" href="' + href + '" data-fid="' + escapeHtml(f.id) + '" data-locked="' + (locked ? '1':'0') + '">' +
        '<div class="corner">' + (f.isPremium ? '<span class="pill pill-gray">🔒 Pro</span>' : '<span class="pill pill-green">免费</span>') + '</div>' +
        '<div class="flex items-center gap-3">' +
          '<div class="text-2xl font-bold t-blue">#' + f.number + '</div>' +
          '<div class="flex-1">' +
            '<div class="font-semibold">' + escapeHtml(f.name) + '</div>' +
            '<div class="text-xs t-muted">' + escapeHtml(f.subCategory) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="mt-3 alg-text break-words" style="font-size:0.95rem">' + maskAlg(f.algorithm, f.isPremium, user.isPremium) + '</div>' +
        '<div class="mt-3 flex items-center justify-between">' +
          statusBadge(status) +
          diffStars(f.difficulty) +
        '</div>' +
      '</a>';
  }

  function applyFilter() {
    var list = getFormulasByCategory(STATE.cat).slice().sort(function(a,b){ return a.number - b.number; });
    var kw = STATE.keyword.trim().toLowerCase();
    if (STATE.sub !== 'ALL') list = list.filter(function(f){ return f.subCategory === STATE.sub; });
    if (kw) list = list.filter(function(f){
      return String(f.number).indexOf(kw) >= 0
        || f.name.toLowerCase().indexOf(kw) >= 0
        || f.subCategory.toLowerCase().indexOf(kw) >= 0;
    });
    return list;
  }

  function renderSubs() {
    var box = document.getElementById('learn-subs');
    if (!box) return;
    var subs = getSubCategories(STATE.cat);
    var html = '<button class="chip ' + (STATE.sub==='ALL'?'active':'') + '" data-sub="ALL">全部</button>';
    for (var i = 0; i < subs.length; i++) {
      html += '<button class="chip ' + (STATE.sub===subs[i]?'active':'') + '" data-sub="' + escapeHtml(subs[i]) + '">' + escapeHtml(subs[i]) + '</button>';
    }
    box.innerHTML = html;
    var btns = box.querySelectorAll('button');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function(){
        STATE.sub = this.getAttribute('data-sub');
        renderSubs();
        renderList();
      });
    }
  }

  function renderList() {
    var list = document.getElementById('learn-list');
    if (!list) return;
    var rows = applyFilter();
    if (rows.length === 0) {
      list.innerHTML = '<div class="col-span-full center t-muted py-10">没有匹配的公式</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < rows.length; i++) html += cardHtml(rows[i]);
    list.innerHTML = html;

    // 锁号点击触发 Pro 弹窗
    var cards = list.querySelectorAll('.formula-card[data-locked="1"]');
    for (var k = 0; k < cards.length; k++) {
      cards[k].addEventListener('click', function(e){
        e.preventDefault();
        showPremiumModal({ formulaId: this.getAttribute('data-fid'), feature: 'view_formula' });
      });
    }
    // 浏览埋点
    track('formula_view', { category: STATE.cat, sub: STATE.sub, count: rows.length });
  }

  function bindTabs() {
    var tabs = document.getElementById('learn-tabs');
    if (!tabs || tabs.__bound) return;
    tabs.__bound = true;
    var btns = tabs.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function(){
        STATE.cat = this.getAttribute('data-cat');
        STATE.sub = 'ALL';
        var bs = tabs.querySelectorAll('button');
        for (var k = 0; k < bs.length; k++) bs[k].classList.toggle('active', bs[k] === this);
        renderSubs();
        renderList();
      });
    }
  }
  function bindSearch() {
    var inp = document.getElementById('learn-search');
    if (!inp || inp.__bound) return;
    inp.__bound = true;
    inp.addEventListener('input', function(){
      STATE.keyword = this.value;
      renderList();
    });
  }

  // 覆盖骨架占位
  window.renderLearn = function() {
    bindTabs();
    bindSearch();
    renderSubs();
    renderList();
  };

  if (typeof router === 'function' && parseHash() === '/learn') window.renderLearn();
})();
