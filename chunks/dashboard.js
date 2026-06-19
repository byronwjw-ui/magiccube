/* Dashboard view */
try{
(function(){
function progressRingSvg(percent,size,label,val){
  size=size||96;var stroke=10,r=(size-stroke)/2,c=2*Math.PI*r;var off=c*(1-Math.max(0,Math.min(1,percent)));
  return '<div class="ring-wrap" style="width:'+size+'px;height:'+size+'px">'+
    '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'">'+
    '<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+r+'" fill="none" stroke="#E5E7EB" stroke-width="'+stroke+'" />'+
    '<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+r+'" fill="none" stroke="#FFD500" stroke-width="'+stroke+'" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'" transform="rotate(-90 '+(size/2)+' '+(size/2)+')" style="transition:stroke-dashoffset .5s ease" />'+
    '</svg><div class="ring-text"><div class="val">'+val+'</div><div class="lbl">'+escapeHtml(label)+'</div></div></div>';
}
function heatmapHtml(days){
  days=days||90;var data=Storage.getDailyCounts(days);
  function level(c){if(c===0)return 0;if(c<5)return 1;if(c<15)return 2;if(c<30)return 3;return 4}
  var cells=data.map(function(d){return '<div class="cell l'+level(d.count)+'" title="'+d.date+'：'+d.count+' 次"></div>'}).join('');
  return '<div class="overflow-x-auto"><div class="heatmap">'+cells+'</div></div>'+
    '<div class="heatmap-legend">少 <span class="swatch" style="background:#f3f4f6"></span><span class="swatch" style="background:rgba(255,213,0,.4)"></span><span class="swatch" style="background:rgba(255,213,0,.7)"></span><span class="swatch" style="background:#FFD500"></span><span class="swatch" style="background:#0046AD"></span> 多</div>';
}
function calcMastery(cat){
  var pool=getFormulasByCategory(cat);if(pool.length===0)return{mastered:0,total:0,percent:0};
  var n=0;for(var i=0;i<pool.length;i++){var p=Storage.getProgress(pool[i].id);if(p&&p.status==='mastered')n++}
  return{mastered:n,total:pool.length,percent:n/pool.length};
}
function renderUserHeader(){
  var u=Storage.getUser();
  return '<div class="card flex items-center gap-4" style="flex-wrap:wrap">'+
    '<button id="btn-avatar" style="font-size:3rem;background:#f3f4f6;width:72px;height:72px;border-radius:16px;cursor:pointer">'+u.avatar+'</button>'+
    '<div class="flex-1" style="min-width:200px">'+
    '<div class="flex items-center gap-3" style="flex-wrap:wrap">'+
    '<input class="input" id="nick-input" value="'+escapeHtml(u.nickname)+'" style="max-width:240px;padding:8px 12px" />'+
    '<button class="btn btn-ghost" id="btn-save-nick" style="padding:8px 16px">保存</button></div>'+
    '<div class="mt-2 text-sm t-muted">'+(u.isPremium?'👑 Pro 会员':'🆓 免费用户')+' · 连续 <b class="t-blue">'+Storage.getStreak()+'</b> 天 · 累计 <b class="t-blue">'+Storage.getSessions().reduce(function(s,x){return s+x.total},0)+'</b> 题</div></div></div>';
}
function avatarPickerHtml(){
  var u=Storage.getUser();var pool=Storage.getAvatarPool();
  var html='<div class="center"><h3>选个头像</h3><div class="avatar-grid">';
  for(var i=0;i<pool.length;i++)html+='<button data-avt="'+pool[i]+'" class="'+(pool[i]===u.avatar?'active':'')+'">'+pool[i]+'</button>';
  html+='</div><button class="btn btn-ghost mt-4" id="__avtClose">关闭</button></div>';
  return html;
}
function renderAchievements(){
  var list=Storage.getAchievements();var html='<div class="grid grid-4">';
  for(var i=0;i<list.length;i++){var a=list[i];html+='<div class="ach-card '+(a.unlocked?'unlocked':'')+'" title="'+escapeHtml(a.description)+'"><div class="emoji">'+a.emoji+'</div><div class="text-sm font-semibold mt-1">'+escapeHtml(a.name)+'</div><div class="text-xs t-muted mt-1">'+escapeHtml(a.description)+'</div></div>'}
  html+='</div>';return html;
}
window.renderDashboard=function(){
  try{
    var root=document.getElementById('dashboard-root');if(!root)return;
    ensureAchievementsInit();checkAndUnlock();
    var oll=calcMastery('OLL'),pll=calcMastery('PLL');
    root.innerHTML='<h1>我的</h1>'+
      '<div class="mt-4">'+renderUserHeader()+'</div>'+
      '<div class="mt-6 grid grid-2">'+
      '<div class="card center"><h3>OLL 掌握度</h3><div class="mt-3 flex justify-center">'+progressRingSvg(oll.percent,120,'OLL',oll.mastered+'/'+oll.total)+'</div></div>'+
      '<div class="card center"><h3>PLL 掌握度</h3><div class="mt-3 flex justify-center">'+progressRingSvg(pll.percent,120,'PLL',pll.mastered+'/'+pll.total)+'</div></div></div>'+
      '<div class="mt-6 card"><div class="flex items-center justify-between" style="flex-wrap:wrap;gap:8px"><h3>近 90 天练习热力</h3><span class="text-sm t-muted">每格 = 1 天</span></div><div class="mt-3">'+heatmapHtml(90)+'</div></div>'+
      '<div class="mt-6"><h2>成就墙</h2><div class="mt-3">'+renderAchievements()+'</div></div>'+
      '<div class="mt-10 card" style="border:1px dashed #fca5a5;background:#fef2f2"><h3 style="color:#b91c1c">⚠️ 危险区</h3><p class="t-muted mt-1 text-sm">清空所有本地数据（昵称、进度、成就、练习历史）。不可撤销。</p><button class="btn mt-3" id="btn-wipe" style="background:#b91c1c;color:#fff">清空所有数据</button></div>';
    document.getElementById('btn-avatar').addEventListener('click',function(){
      var close=showModal(avatarPickerHtml());
      var btns=document.querySelectorAll('#modal-root [data-avt]');
      for(var i=0;i<btns.length;i++)btns[i].addEventListener('click',function(){
        var avt=this.getAttribute('data-avt');
        Storage.updateUser({avatar:avt});track('avatar_changed',{avatar:avt});
        close();renderDashboard();
      });
      var c=document.getElementById('__avtClose');if(c)c.addEventListener('click',close);
    });
    document.getElementById('btn-save-nick').addEventListener('click',function(){
      var v=document.getElementById('nick-input').value.trim();
      if(!v){toast('昵称不能为空');return}
      if(v.length>20){toast('昵称最多 20 个字符');return}
      Storage.updateUser({nickname:v});toast('已保存');track('nickname_changed',{nickname:v});
    });
    document.getElementById('btn-wipe').addEventListener('click',function(){
      if(!confirm('确定要清空所有数据吗？此操作不可撤销。'))return;
      if(!confirm('再确认一次：清空后无法恢复。'))return;
      Storage.resetAll();track('data_wiped',{});toast('已清空');
      setTimeout(function(){navigate('/');try{location.reload()}catch(e){}},500);
    });
  }catch(e){console.error('[renderDashboard]',e);document.getElementById('dashboard-root').innerHTML='<div class="center py-10 t-muted">加载失败：'+escapeHtml(e.message)+'</div>'}
};
})();
}catch(e){console.error('[dashboard view]',e)}
