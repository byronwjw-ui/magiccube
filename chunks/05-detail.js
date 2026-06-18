(function(){
  function statusBadge(s){
    if (s === 'mastered') return '<span class="badge badge-mastered">✓ 已掌握</span>';
    if (s === 'learning') return '<span class="badge badge-learning">学习中</span>';
    return '<span class="badge badge-new">未练习</span>';
  }
  function diffStars(d){ return '★'.repeat(d) + '☆'.repeat(3-d); }

  window.renderDetail = function(id){
    var root = document.getElementById('detail-root'); if (!root) return;
    var f = getFormulaById(id);
    if (!f) {
      root.innerHTML = '<div class="center py-10"><div class="text-5xl">🧊</div><h2 class="mt-4">没找到这个公式</h2>' +
        '<a href="#/learn" class="btn btn-primary mt-6">返回公式库</a></div>'; return;
    }
    var user = Storage.getUser();
    if (f.isPremium && !user.isPremium) {
      root.innerHTML = '<div class="center py-10"><div class="text-5xl">🔒</div><h2 class="mt-4">这个公式是 Pro 内容</h2>' +
        '<p class="t-muted mt-2">解锁后即可查看动画、算法和练习。</p>' +
        '<div class="mt-6 flex gap-3 justify-center" style="flex-wrap:wrap">' +
        '<a href="#/pricing" class="btn btn-primary">查看 Pro</a>' +
        '<a href="#/learn" class="btn btn-ghost">返回公式库</a></div></div>';
      showPremiumModal({ formulaId:id, feature:'detail' }); return;
    }
    var prog = Storage.getProgress(id);
    var status = (prog && prog.status) || 'new';
    var adj = getAdjacentFormulas(id);
    var altsHtml = '';
    if (f.alternativeAlgorithms && f.alternativeAlgorithms.length) {
      altsHtml = '<div class="mt-4"><div class="text-sm t-muted mb-2">备选算法</div><div class="grid">' +
        f.alternativeAlgorithms.map(function(a){
          return '<button class="card alg-text break-words copy-btn" data-alg="' + escapeHtml(a) + '" style="text-align:left;font-size:1rem">' + escapeHtml(a) + '</button>';
        }).join('') + '</div></div>';
    }
    var tipHtml = f.tip ? '<p class="t-muted mt-2 text-sm">💡 ' + escapeHtml(f.tip) + '</p>' : '';

    root.innerHTML =
      '<a href="#/learn" class="t-muted text-sm">← 返回公式库</a>' +
      '<div class="mt-3 flex items-center justify-between gap-3" style="flex-wrap:wrap">' +
      '<div><div class="flex items-center gap-3"><div class="text-3xl font-bold t-blue">#' + f.number + '</div>' +
      '<h1 style="font-size:1.75rem">' + escapeHtml(f.name) + '</h1></div>' +
      '<div class="mt-2 flex items-center gap-3 text-sm t-muted">' +
      '<span>' + escapeHtml(f.category) + ' · ' + escapeHtml(f.subCategory) + '</span>' +
      '<span title="难度">' + diffStars(f.difficulty) + '</span>' + statusBadge(status) + '</div></div></div>' +
      '<div class="mt-4 card"><div class="cube-host lg" id="detail-cube"></div>' +
      '<div class="mt-3 center text-xs t-muted">点击 ▶ 播放，或拖动魔方查看。</div></div>' +
      '<div class="mt-4 card"><div class="text-sm t-muted">主算法</div>' +
      '<button class="alg-text mt-2 break-words copy-btn" data-alg="' + escapeHtml(f.algorithm) + '" ' +
      'style="text-align:left;width:100%;display:block;cursor:pointer">' + escapeHtml(f.algorithm) + '</button>' +
      '<div class="mt-2 text-xs t-muted">点击算法即可复制到剪贴板</div>' + tipHtml + altsHtml + '</div>' +
      '<div class="mt-4 grid grid-2">' +
      (status === 'mastered'
        ? '<button class="btn btn-ghost" id="btn-relearn">重新学习</button>'
        : '<button class="btn btn-primary" id="btn-mastered">✓ 标记已掌握</button>') +
      '<a href="#/practice" class="btn btn-secondary">🎯 去练习</a></div>' +
      '<div class="mt-6 flex items-center justify-between">' +
      (adj.prev ? '<a href="#/learn/' + adj.prev.category + '/' + adj.prev.id + '" class="t-blue">← #' + adj.prev.number + ' ' + escapeHtml(adj.prev.name) + '</a>' : '<span></span>') +
      (adj.next ? '<a href="#/learn/' + adj.next.category + '/' + adj.next.id + '" class="t-blue">#' + adj.next.number + ' ' + escapeHtml(adj.next.name) + ' →</a>' : '<span></span>') +
      '</div>';

    mountCube(document.getElementById('detail-cube'), { alg: f.algorithm, setupAlg: f.setupMoves, size: 280, tempoScale: 1 });

    var copyBtns = root.querySelectorAll('.copy-btn');
    for (var i = 0; i < copyBtns.length; i++) copyBtns[i].addEventListener('click', function(){
      var a = this.getAttribute('data-alg');
      copyToClipboard(a).then(function(ok){
        toast(ok ? '已复制：' + a : '复制失败');
        track('formula_copy', { formulaId: id, alg: a });
      });
    });
    var bM = document.getElementById('btn-mastered');
    if (bM) bM.addEventListener('click', function(){
      Storage.markMastered(id); checkAndUnlock();
      track('formula_mastered', { formulaId: id });
      toast('🎉 已标记为已掌握'); renderDetail(id);
    });
    var bR = document.getElementById('btn-relearn');
    if (bR) bR.addEventListener('click', function(){ Storage.markLearning(id); toast('已切回「学习中」'); renderDetail(id); });
    track('formula_open', { formulaId: id });
  };
})();
