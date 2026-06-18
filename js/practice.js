/* =============================================================================
 * 练习视图
 *   - 模式选择：随机闪卡 / 仅 OLL / 仅 PLL / 弱项强化(Pro)
 *   - 闪卡：3D 动画 → 自评「会了 ✓」/ 「不会 ✗」→ 自动记录进度
 *   - 完成：写入 sessions, 触发成就检查
 * ============================================================================= */
(function(){
  var STATE = { mode: null, deck: [], idx: 0, success: 0, fail: 0, revealed: false, startTs: 0 };

  function buildDeck(mode) {
    var user = Storage.getUser();
    var pool = ALL_FORMULAS.filter(function(f){ return !f.isPremium || user.isPremium; });
    if (mode === 'oll') pool = pool.filter(function(f){ return f.category === 'OLL'; });
    if (mode === 'pll') pool = pool.filter(function(f){ return f.category === 'PLL'; });
    if (mode === 'weak') {
      // Pro: 错误率高 / 未掌握优先
      pool = pool.slice().sort(function(a,b){
        var pa = Storage.getProgress(a.id), pb = Storage.getProgress(b.id);
        var ra = pa ? pa.successRate : 0;
        var rb = pb ? pb.successRate : 0;
        return ra - rb;
      }).slice(0, 15);
    }
    // 随机打乱
    pool = pool.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return pool.slice(0, Math.min(pool.length, mode === 'weak' ? 15 : 10));
  }

  function renderPicker() {
    var root = document.getElementById('practice-root');
    var user = Storage.getUser();
    root.innerHTML = '' +
      '<h1>练习</h1>' +
      '<p class="t-muted mt-1">看公式 → 想一下 → 翻开看答案 → 自评。每组 10 题。</p>' +
      '<div class="mt-6 grid grid-2">' +
        '<button class="card hover" data-mode="random" style="text-align:left">' +
          '<div class="text-2xl">🎲</div>' +
          '<h3 class="mt-2">随机闪卡</h3>' +
          '<p class="t-muted mt-1">从已解锁的公式中随机抽 10 张。</p>' +
        '</button>' +
        '<button class="card hover" data-mode="oll" style="text-align:left">' +
          '<div class="text-2xl">🟡</div>' +
          '<h3 class="mt-2">只练 OLL</h3>' +
          '<p class="t-muted mt-1">专攻顶层翻面。</p>' +
        '</button>' +
        '<button class="card hover" data-mode="pll" style="text-align:left">' +
          '<div class="text-2xl">🔵</div>' +
          '<h3 class="mt-2">只练 PLL</h3>' +
          '<p class="t-muted mt-1">专攻顶层换位。</p>' +
        '</button>' +
        '<button class="card hover ' + (user.isPremium?'':'') + '" data-mode="weak" style="text-align:left;position:relative">' +
          (user.isPremium ? '' : '<div class="corner" style="position:absolute;top:8px;right:8px"><span class="pill pill-gray">🔒 Pro</span></div>') +
          '<div class="text-2xl">🎯</div>' +
          '<h3 class="mt-2">弱项强化</h3>' +
          '<p class="t-muted mt-1">根据成功率自动推荐你最不熟的 15 张。</p>' +
        '</button>' +
      '</div>';
    var btns = root.querySelectorAll('button[data-mode]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function(){
        var mode = this.getAttribute('data-mode');
        if (mode === 'weak' && !Storage.getUser().isPremium) {
          showPremiumModal({ feature: 'weak_practice' });
          return;
        }
        startSession(mode);
      });
    }
  }

  function startSession(mode) {
    STATE.mode = mode;
    STATE.deck = buildDeck(mode);
    STATE.idx = 0;
    STATE.success = 0;
    STATE.fail = 0;
    STATE.revealed = false;
    STATE.startTs = Date.now();
    if (STATE.deck.length === 0) {
      toast('当前没有可练习的公式');
      return;
    }
    track('practice_start', { mode: mode, total: STATE.deck.length });
    renderCard();
  }

  function renderCard() {
    var root = document.getElementById('practice-root');
    if (STATE.idx >= STATE.deck.length) { renderSummary(); return; }
    var f = STATE.deck[STATE.idx];
    var pct = Math.round(STATE.idx / STATE.deck.length * 100);
    root.innerHTML = '' +
      '<div class="flex items-center justify-between">' +
        '<button class="t-muted text-sm" id="btn-exit">← 退出</button>' +
        '<div class="text-sm t-muted">' + (STATE.idx + 1) + ' / ' + STATE.deck.length + '</div>' +
      '</div>' +
      '<div class="progress-bar mt-3"><div style="width:' + pct + '%"></div></div>' +
      '<div class="mt-6 card flip-in">' +
        '<div class="center text-sm t-muted">' + escapeHtml(f.category) + ' · ' + escapeHtml(f.subCategory) + '</div>' +
        '<h2 class="center mt-1">#' + f.number + ' ' + escapeHtml(f.name) + '</h2>' +
        '<div class="mt-4 cube-host lg" id="practice-cube"></div>' +
        '<div id="answer-box" class="mt-4 ' + (STATE.revealed?'':'hidden') + '">' +
          '<div class="text-sm t-muted">答案</div>' +
          '<div class="alg-text mt-1 break-words">' + escapeHtml(f.algorithm) + '</div>' +
        '</div>' +
        (STATE.revealed
          ? '<div class="mt-6 grid grid-2">' +
              '<button class="btn btn-ghost" id="btn-fail">✗ 还不熟</button>' +
              '<button class="btn btn-primary" id="btn-ok">✓ 会了</button>' +
            '</div>'
          : '<button class="btn btn-secondary btn-block mt-6" id="btn-reveal">看答案</button>') +
      '</div>' +
      '<div class="mt-4 text-sm center t-muted">本组成绩：✓ ' + STATE.success + ' · ✗ ' + STATE.fail + '</div>';
    mountCube(document.getElementById('practice-cube'), {
      alg: STATE.revealed ? f.algorithm : '',
      setupAlg: f.setupMoves,
      size: 240,
      tempoScale: 1
    });
    var bExit = document.getElementById('btn-exit');
    bExit && bExit.addEventListener('click', function(){
      if (confirm('要退出本组练习吗？已答题不会保存。')) {
        renderPicker();
      }
    });
    var bR = document.getElementById('btn-reveal');
    bR && bR.addEventListener('click', function(){ STATE.revealed = true; renderCard(); });
    var bOk = document.getElementById('btn-ok');
    bOk && bOk.addEventListener('click', function(){ rate(true); });
    var bN = document.getElementById('btn-fail');
    bN && bN.addEventListener('click', function(){ rate(false); });
  }

  function rate(success) {
    var f = STATE.deck[STATE.idx];
    Storage.recordPractice(f.id, success);
    if (success) STATE.success++; else STATE.fail++;
    STATE.idx++;
    STATE.revealed = false;
    renderCard();
  }

  function renderSummary() {
    var root = document.getElementById('practice-root');
    var total = STATE.deck.length;
    var rate = total > 0 ? Math.round(STATE.success / total * 100) : 0;
    var durSec = Math.round((Date.now() - STATE.startTs) / 1000);
    // 写入会话
    Storage.addSession({
      date: todayStr(),
      mode: STATE.mode,
      total: total,
      success: STATE.success,
      durationSec: durSec
    });
    var unlocked = checkAndUnlock();
    track('practice_finish', { mode: STATE.mode, total: total, success: STATE.success, durationSec: durSec });

    var unlockedHtml = '';
    if (unlocked.length) {
      var names = unlocked.map(function(id){
        var a = ACHIEVEMENT_DEFS.filter(function(x){ return x.id === id; })[0];
        return a ? (a.emoji + ' ' + a.name) : id;
      }).join('，');
      unlockedHtml = '<div class="mt-4 card center" style="background:rgba(255,213,0,0.2)">🎉 解锁成就：' + escapeHtml(names) + '</div>';
    }

    root.innerHTML = '' +
      '<div class="card center">' +
        '<div class="text-5xl">🏁</div>' +
        '<h2 class="mt-3">本组结束！</h2>' +
        '<div class="mt-4 grid grid-3">' +
          '<div><div class="text-2xl font-bold t-blue">' + total + '</div><div class="text-xs t-muted">总题数</div></div>' +
          '<div><div class="text-2xl font-bold t-green">' + STATE.success + '</div><div class="text-xs t-muted">会了</div></div>' +
          '<div><div class="text-2xl font-bold" style="color:var(--red)">' + STATE.fail + '</div><div class="text-xs t-muted">还不熟</div></div>' +
        '</div>' +
        '<div class="mt-4 text-sm t-muted">正确率 ' + rate + '% · 用时 ' + durSec + ' 秒</div>' +
      '</div>' +
      unlockedHtml +
      '<div class="mt-4 grid grid-2">' +
        '<button class="btn btn-primary" id="btn-again">再来一组</button>' +
        '<a href="#/dashboard" class="btn btn-ghost" data-nav>查看仪表盘</a>' +
      '</div>';
    document.getElementById('btn-again').addEventListener('click', function(){ startSession(STATE.mode); });
  }

  window.renderPractice = function() { renderPicker(); };

  if (typeof router === 'function' && parseHash() === '/practice') window.renderPractice();
})();
