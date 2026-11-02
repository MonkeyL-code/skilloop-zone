'use strict';
document.querySelector('#current-user').textContent='社区编辑';
document.querySelector('#current-avatar').textContent='S';
document.querySelector('#view-config').innerHTML='';
window.renderRules=function(){document.querySelector('#view-config').innerHTML='<div class="page-heading"><h1>内容规则</h1></div><div class="placeholder-box"><h2>五领域 · 免费互助</h2><p>保持来源署名，不发布培训招生、积分买卖或诱导站外付费内容。</p></div>';};
document.querySelector('[data-act=reload-posts]').onclick=async()=>{try{AdminUI.replacePosts(await AdminRuntime.loadPosts());notify('内容已刷新');}catch(error){notify(error.message);}};
document.addEventListener('click',event=>{
  const b=event.target.closest('[data-act=logout]');if(!b)return;event.stopImmediatePropagation();location.href='../#welcome';
},true);
