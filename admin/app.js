'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories = ['AI 与编程','视觉与影像','音乐与声音','语言与表达','生活与手作'];
const guideCategories = [...categories];
const categoriesFor = channel => channel==='前沿资讯'?categories:channel==='灵感摘录'?guideCategories:[];
const pages = {operations:'运营管理', agent:'内容创作', materials:'素材库', seo:'SEO', cookie:'Cookie', privacy:'隐私与安全', config:'规则管理'};
const zone = 'Asia/Shanghai';
const today = () => new Date().toLocaleDateString('sv-SE', {timeZone:zone});
const dayBefore = n => {const d = new Date(today()+'T12:00:00+08:00'); d.setUTCDate(d.getUTCDate()-n); return d.toLocaleDateString('sv-SE',{timeZone:zone});};
const at = (n,h='10:30:00') => dayBefore(n)+'T'+h+'+08:00';
const fmt = date => date ? new Date(date).toLocaleString('sv-SE',{timeZone:zone}).slice(0,16) : '—';
const now = () => new Date().toISOString();
let opMode = 'published';
let opFiltersCollapsed = window.matchMedia?.('(max-height: 640px) and (min-width: 700px)')?.matches || false;
let currentPage = 'operations';
let openPages = ['operations'];
let toastTimer;
const selected = {published:new Set(), draft:new Set()};
const filters = {published:{},draft:{},materials:{}};
const queryState = {published:{},draft:{},materials:{}};
const pageNumbers = {published:1,draft:1,materials:1};
let agentQuery = {keyword:'',category:'',range:''};
let selectedAgent = null;
let creationMode = '前沿资讯';
let selectedGuide = null;
let guideQuery = {};
const creationViews = {'前沿资讯':{inputs:{},left:0,right:0},灵感摘录:{inputs:{},left:0,right:0}};
let editor = null;
let overlayId = 0;
let renderCount = 0;
const sourceGroups = SOURCE_CATALOG.groups;
const sourceCatalog = sourceGroups.flatMap(group => group.sources.map(source => ({...source,groupId:group.id,groupName:group.name})));
const materialTypes = {article:'文章',video:'视频',other:'其他'};

const {materials=[],agents=[],posts=[]}=AdminRuntime.initialData||{};
const guideCandidates=materials.filter(m=>['article','video'].includes(m.type));
selectedAgent=agents[0]?.id||null;selectedGuide=guideCandidates[0]?.id||null;
const arrivalStateKey='skilloop-admin-arrivals-v1';
const visitedCreationModes=new Set();
let pendingArrivalCard=null;
function leaveArrivalCard(){
 if(pendingArrivalCard){markArrivalsSeen('agent',[pendingArrivalCard]);pendingArrivalCard=null;}
}
function trackDisplayedArrival(){
 if(currentPage!=='agent')return;
 const id=creationMode==='灵感摘录'?selectedGuide:selectedAgent;
 pendingArrivalCard=arrivals.agent.has(id)?id:null;
}
let seenArrivals={agent:[],materials:[]};
try{const saved=JSON.parse(localStorage.getItem(arrivalStateKey)||'{}');for(const page of ['agent','materials'])if(Array.isArray(saved[page]))seenArrivals[page]=saved[page];}catch(_){}
const arrivals={agent:new Set([...agents,...guideCandidates].filter(a=>a.isNew).map(a=>a.id)),materials:new Set(materials.filter(m=>m.isNew).map(m=>m.id))};
for(const page of ['agent','materials'])seenArrivals[page].forEach(id=>arrivals[page].delete(id));
function arrivalDot(page,id){return arrivals[page].has(id)?'<span class="new-dot" data-new-dot="'+page+'" data-arrival-id="'+escapeHTML(id)+'" role="img" aria-label="新增内容" title="新增内容"></span>':'';}
function updateArrivalBadges(){
 for(const page of ['agent','materials']){const badge=$('[data-new-count="'+page+'"]');badge.hidden=!arrivals[page].size;badge.textContent=arrivals[page].size;badge.setAttribute('aria-label',pages[page]+'新增 '+arrivals[page].size+' 条');}
 for(const mode of ['前沿资讯','灵感摘录']){
  const count=(mode==='前沿资讯'?agents:guideCandidates).filter(item=>arrivals.agent.has(item.id)).length;
  const badge=$('[data-creation-new="'+mode+'"]');badge.hidden=!count;badge.textContent=count;badge.setAttribute('aria-label',mode+'新增 '+count+' 条');
 }
}
function markArrivalsSeen(page,ids){
 const acknowledged=ids.filter(id=>arrivals[page].has(id));
 if(!acknowledged.length)return;
 seenArrivals[page]=Array.from(new Set([...seenArrivals[page],...acknowledged]));
 acknowledged.forEach(id=>arrivals[page].delete(id));
 try{localStorage.setItem(arrivalStateKey,JSON.stringify(seenArrivals));}catch(_){}
 $$('[data-new-dot="'+page+'"]').forEach(dot=>{if(!arrivals[page].has(dot.dataset.arrivalId))dot.remove();});updateArrivalBadges();
}
function acknowledgeArrivals(page){
 if(!arrivals[page])return;
 if(page==='agent'){
  leaveArrivalCard();
  const ids=[...(visitedCreationModes.has('前沿资讯')?agents:[]),...(visitedCreationModes.has('灵感摘录')?guideCandidates:[])].map(item=>item.id);
  markArrivalsSeen(page,ids);visitedCreationModes.clear();
 }else markArrivalsSeen(page,[...arrivals[page]]);
}
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
function renderTabs(){
 $('#page-tabs').innerHTML=openPages.map(p=>`<div class="page-tab ${p===currentPage?'current':''}" role="tab" aria-selected="${p===currentPage}" tabindex="0" data-act="navigate" data-id="${p}">${p===currentPage?'<span class="tab-dot"></span>':''}${pages[p]}<button aria-label="关闭${pages[p]}页签" data-act="close-tab" data-id="${p}"><span data-icon="close"></span></button></div>`).join('');
}
function navigate(page){
 if(!pages[page])return;
 if(page==='operations')setOpMode('published');
 if(!openPages.includes(page))openPages.push(page);
 if(currentPage!==page){
  acknowledgeArrivals(currentPage);
  if(page==='agent'){visitedCreationModes.clear();visitedCreationModes.add(creationMode);}
 }
 currentPage=page;
 trackDisplayedArrival();
 $$('.page').forEach(v=>v.hidden=true);
 const view=$('#view-'+page);
 if(view)view.hidden=false;
 else{
   $('#view-placeholder').hidden=false;
  $('#view-placeholder').innerHTML=`<div class="page-heading"><div><h1>${pages[page]}</h1></div></div><div class="placeholder-box"><div class="placeholder-icon"><span data-icon="settings"></span></div><h2>${pages[page]}</h2><p>暂未开放</p></div>`;
 }
 $$('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 $('#header-current').textContent=pages[page];
 if(page==='config')renderRules();
 renderTabs();
}
function closeTab(page){
 if(openPages.length===1){notify('至少保留一个工作页签');return;}
 const i=openPages.indexOf(page);openPages=openPages.filter(p=>p!==page);
 if(currentPage===page)navigate(openPages[Math.max(0,i-1)]);else renderTabs();
}
function setOpMode(mode){
 opMode=mode;
 for(const m of ['draft','published']){
  $('#panel-'+m).hidden=m!==mode;
  $('#tab-'+m).setAttribute('aria-selected',String(m===mode));
  selected[m].clear();
  $$('input[type=checkbox][data-select]', $('#panel-'+m)).forEach(c=>c.checked=false);
  const all=$('[data-act=select-all]',$('#panel-'+m));if(all)all.checked=false;
  updateSelection(m);
 }
}
function updateCounts(){
 $('#draft-count').textContent=posts.filter(p=>p.state==='draft').length;
 $('#published-count').textContent=posts.filter(p=>p.state==='published').length;
}
function categoryOptions(channel, selectedCategories=[]){
 const list=categoriesFor(channel);
 return `<label><input type="checkbox" value="" name="category" ${selectedCategories.length?'':'checked'}>全部</label>`+list.map(c=>`<label><input type="checkbox" name="category" value="${escapeHTML(c)}" ${selectedCategories.includes(c)?'checked':''}>${escapeHTML(c)}</label>`).join('');
}
function filterForm(mode){
 const dateName=mode==='published'?'发布时间':'进入待发布时间';
 return `<form class="filter-box operations-filters" id="filter-${mode}" data-filter="${mode}">
 <div class="field filter-taxonomy" data-slot="taxonomy" role="group" aria-label="栏目/分类"><span>栏目/分类</span><select name="channel" data-channel="${mode}" aria-label="栏目"><option value="">全部栏目</option><option>前沿资讯</option><option>灵感摘录</option></select><i class="taxonomy-slash" aria-hidden="true">/</i><details class="category-picker"><summary aria-label="分类">全部</summary><div class="category-options">${categoryOptions('')}</div></details></div>
 ${mode==='draft'?'<label class="field filter-modifier" data-slot="modifier"><span>状态</span><select name="status"><option value="">全部状态</option><option>未发布</option><option>被撤回</option></select></label>':'<div class="field filter-modifier" data-slot="modifier"><span>精选</span><label class="featured-control"><input type="checkbox" name="featuredOnly" value="yes"><span>仅看精选</span></label></div>'}
 <label class="field filter-sort" data-slot="sort"><span>排序</span><select name="sort"><option value="desc">${dateName}：从新到旧</option><option value="asc">${dateName}：从旧到新</option></select></label>
 <div class="field date-field filter-date" data-slot="date"><span>${dateName}</span><input type="date" name="start" aria-label="${dateName}开始日期"><span class="date-separator">至</span><input type="date" name="end" aria-label="${dateName}结束日期"><select class="quick-date" name="quick" data-quick="${mode}" aria-label="快捷选择${dateName}"><option value="">快捷日期</option><option value="today">今天</option><option value="yesterday">昨天</option><option value="3">近三天</option><option value="7">近七天</option><option value="30">近30天</option></select></div>
 <label class="field filter-keyword" data-slot="keyword"><span>标题</span><input name="keyword" placeholder="输入标题关键词"></label><div class="filter-actions" data-slot="actions"><button class="button primary" type="submit">查询</button><button class="button" type="button" data-act="reset-filter" data-id="${mode}">重置</button></div></form>`;
}
function renderOperationalPanels(){
 for(const mode of ['draft','published']){
  const isDraft=mode==='draft';
  $('#panel-'+mode).innerHTML=`${filterForm(mode)}<div class="table-card"><div class="table-caption"><div><strong>${isDraft?'待发布稿件':'已发布文章'}</strong><small id="result-${mode}"></small></div><span class="muted" id="selection-${mode}"></span></div><div class="table-scroll" id="scroll-${mode}"></div><div class="table-footer" id="footer-${mode}"></div></div>`;
  renderPostTable(mode);
 }
 updateCounts();setOpMode(opMode);
}
function postMatches(p,q,mode){
 const d=fmt(mode==='published'?p.publishedAt:p.enteredAt).slice(0,10);
 return p.state===mode && (!q.channel||p.channel===q.channel) && (!q.categories?.length||q.categories.includes(p.category)) && (!q.keyword||p.title.toLowerCase().includes(q.keyword.toLowerCase())) && (!q.status||p.draftState===q.status) && (!q.featuredOnly||p.featured) && (!q.start||d>=q.start) && (!q.end||d<=q.end);
}
function fallbackCover(p){
 if(p.cover){const path=/^\/api\/public\/articles\/[a-z0-9-]+\/image\/[a-f0-9]{64}\.png$/.test(p.cover)?new URL(p.cover,location.origin).href:p.cover;return ContentSafety.url(path,{image:true});}
 if(p.type!=='video'&&p.bodyFormat!=='plain'){
  const doc=new DOMParser().parseFromString(p.body||'','text/html');
  const img=doc.querySelector('img');if(img)return ContentSafety.url(img.getAttribute('src'),{image:true});
 }
 return '';
}
function thumb(p){const src=fallbackCover(p);return src?`<img class="article-thumb" src="${escapeHTML(src)}" alt="文章封面">`:`<div class="article-thumb" style="display:grid;place-items:center;color:#a5b1c3;font-size:11px">${p.type==='video'?'<span data-icon="play"></span> 视频 · 无封面':'暂无封面'}</div>`;}
function renderPostTable(mode){
 const scroller=$('#scroll-'+mode),scrollTop=scroller.scrollTop,scrollLeft=scroller.scrollLeft,q=queryState[mode];
 const list=posts.filter(p=>postMatches(p,q,mode)).sort((a,b)=>{
  const ta=mode==='published'?a.publishedAt:a.enteredAt,tb=mode==='published'?b.publishedAt:b.enteredAt;
  const d=new Date(tb)-new Date(ta)||b.id.localeCompare(a.id);return q.sort==='asc'?-d:d;
 });
 const size=8,total=list.length,totalPages=Math.max(1,Math.ceil(total/size));
 pageNumbers[mode]=Math.min(pageNumbers[mode],totalPages);
 const page=list.slice((pageNumbers[mode]-1)*size,pageNumbers[mode]*size);
 $('#result-'+mode).textContent=`共 ${total} 篇`;
 const draft=mode==='draft';
 scroller.innerHTML=`<table class="content-table operations-table"><colgroup>${(draft?[3,6,29,7,9,12,7,9,9,13]:[3,6,31,7,9,8,7,9,9,10]).map(width=>`<col style="width:${width}%">`).join('')}</colgroup><thead><tr><th><input type="checkbox" aria-label="全选当前页" data-act="select-all" data-id="${mode}"></th><th class="id-col">稿件编号</th><th class="title-col">标题与封面</th><th class="channel-col">栏目</th><th class="category-col">分类</th>${draft?'<th class="source-col">稿件来源</th><th>状态</th>':'<th class="publisher-col">发布者</th><th class="feature-col">是否精选</th>'}<th class="time-col">创建时间</th><th class="time-col" title="${draft?'最近一次进入待发布的时间':'最近一次发布时间'}">${draft?'进入待发布时间':'发布时间'}</th><th class="sticky-action">操作</th></tr></thead><tbody>${page.map(p=>`<tr><td><input type="checkbox" data-select="${mode}" data-id="${escapeHTML(p.id)}" aria-label="选择 ${escapeHTML(p.title)}" ${selected[mode].has(p.id)?'checked':''}></td><td class="id-col mono" title="稿件 ID：${escapeHTML(p.id)}">${escapeHTML(p.postNumber??p.id)}</td><td class="title-col"><div class="table-title" title="${escapeHTML(p.title)}">${escapeHTML(p.title)}</div>${p.publicationState==='needs-attention'?'<span class="tag amber">发布状态待核对</span>':''}${thumb(p)}${draft?'':`<div class="engagement"><span title="点赞"><span data-icon="heart"></span> ${escapeHTML(p.likes??'—')}</span><span title="收藏"><span data-icon="bookmark"></span> ${escapeHTML(p.saves??'—')}</span><span title="转发"><span data-icon="share"></span> ${escapeHTML(p.shares??'—')}</span><span title="评论"><span data-icon="comment"></span> ${escapeHTML(p.comments??'—')}</span></div>`}</td><td class="channel-col">${escapeHTML(p.channel)}</td><td class="category-col"><span class="tag ${p.channel==='前沿资讯'?'blue':''}">${escapeHTML(p.category||'未分类')}</span></td>${draft?`<td class="source-col">${postOrigin(p,true)}</td><td><span class="tag ${p.draftState==='被撤回'?'red':'amber'}" title="${p.withdrawnAt?'上次发布：'+fmt(p.publishedAt)+'；撤回：'+fmt(p.withdrawnAt):'尚未发布'}">${p.draftState}</span></td>`:`<td class="publisher-col">${escapeHTML(p.publisher)}</td><td class="feature-col">${p.featured?'<span class="feature-yes"><span data-icon="star"></span> 精选</span>':'<span class="muted">否</span>'}</td>`}<td class="time-col mono">${fmt(p.firstCreatedAt)}</td><td class="time-col mono">${fmt(draft?p.enteredAt:p.publishedAt)}</td><td class="sticky-action"><button class="action-link" data-act="preview-post" data-id="${escapeHTML(p.id)}">预览</button>${draft?`<button class="action-link" data-act="edit-post" data-id="${escapeHTML(p.id)}">编辑发布</button><button class="action-link warn" data-act="delete-draft" data-id="${escapeHTML(p.id)}" ${AdminRuntime.canDelete?'':'disabled title="删除服务暂不可用"'}>删除</button>`:`<button class="action-link warn" data-act="withdraw" data-id="${escapeHTML(p.id)}">撤回</button>`}</td></tr>`).join('')||`<tr><td colspan="10"><div class="empty"><b>没有找到匹配的${draft?'待发布稿件':'已发布文章'}</b>调整筛选条件，或点击重置查看全部内容。</div></td></tr>`}</tbody></table>`;
 scroller.scrollTop=scrollTop;scroller.scrollLeft=scrollLeft;
 $('#footer-'+mode).innerHTML=footer(mode,total,totalPages,pageNumbers[mode]);updateSelection(mode);
}
function footer(mode,total,totalPages,page){return `<span>共 ${total} 条 · 每页 8 条</span><div class="pagination"><button aria-label="上一页" data-act="paginate" data-id="${mode}" data-page="${page-1}" ${page<=1?'disabled':''}><span data-icon="left"></span></button>${Array.from({length:totalPages},(_,i)=>`<button class="${page===i+1?'active':''}" data-act="paginate" data-id="${mode}" data-page="${i+1}">${i+1}</button>`).join('')}<button aria-label="下一页" data-act="paginate" data-id="${mode}" data-page="${page+1}" ${page>=totalPages?'disabled':''}><span data-icon="right"></span></button></div>`;}
function updateSelection(mode){
 const el=$('#selection-'+mode);if(el)el.textContent=selected[mode].size?`已选择 ${selected[mode].size} 篇`:'';
 const form=$('#panel-'+mode),checks=$$('input[data-select]',form),all=$('[data-act=select-all]',form);
 if(all){all.checked=checks.length>0&&checks.every(c=>c.checked);all.indeterminate=checks.some(c=>c.checked)&&!all.checked;}
}
function queryForm(mode){
 const form=$('#filter-'+mode),data=new FormData(form);
 const q=Object.fromEntries(data.entries());q.categories=data.getAll('category').filter(Boolean);q.sourceIds=data.getAll('sourceIds');
 if(q.start&&q.end&&q.start>q.end){notify('开始日期不能晚于结束日期');return;}
 queryState[mode]=q;pageNumbers[mode]=1;
 if(selected[mode])selected[mode].clear();
 if(mode==='materials')renderMaterialTable();else renderPostTable(mode);
 $('#scroll-'+mode).scrollTop=0;
}
function resetFilter(mode){
 const form=$('#filter-'+mode);form.reset();
 if(mode!=='materials'){
  $('.category-options',form).innerHTML=categoryOptions('');
  $('.category-picker summary',form).textContent='全部';
  $('.category-picker',form).open=false;
 }else{updateSourcePicker();$('#source-picker').open=false;}
 queryState[mode]={};pageNumbers[mode]=1;
 if(selected[mode])selected[mode].clear();
 mode==='materials'?renderMaterialTable():renderPostTable(mode);
 $('#scroll-'+mode).scrollTop=0;
}
function quickDate(form,value){
 if(!value)return;
 const start=value==='yesterday'?dayBefore(1):value==='today'?today():dayBefore(Number(value)-1);
 form.elements.start.value=start;form.elements.end.value=value==='yesterday'?dayBefore(1):today();
}
function refreshBusiness(){
 updateCounts();renderPostTable('draft');renderPostTable('published');
}

function renderCreationFilter(){
 const guide=creationMode==='灵感摘录',timeLabel=guide?'采集时间':'生成时间';
 $('#agent-filter').innerHTML=`<div class="section-label">${guide?'候选转载内容':'待审文稿'} <span id="agent-count"></span></div><input name="keyword" aria-label="搜索标题或 ID" placeholder="搜索标题或 ID…"><div class="filter-pair">${guide?'<select name="type" aria-label="媒体类型"><option value="">全部类型</option><option value="article">文章</option><option value="video">视频</option></select>':'<select name="category" aria-label="稿件分类"><option value="">全部分类</option>'+categories.map(c=>`<option>${c}</option>`).join('')+'</select>'}<select name="range" aria-label="${timeLabel}"><option value="">全部${timeLabel}</option><option value="1">今天</option><option value="3">近三天</option><option value="7">近七天</option><option value="30">近30天</option></select></div>${guide?sourcePickerMarkup('guide'):''}<div class="agent-filter-actions"><button class="button primary small" type="submit">查询</button><button class="text-button" type="button" data-act="agent-reset">重置</button></div>`;
 Object.entries(creationViews[creationMode].inputs).forEach(([name,value])=>{if(name!=='sourceIds'&&$('#agent-filter').elements[name])$('#agent-filter').elements[name].value=value;});
 if(guide){$$('input[name=sourceIds]',$('#agent-filter')).forEach(c=>c.checked=(creationViews.灵感摘录.inputs.sourceIds||[]).includes(c.value));updateSourcePicker($('#agent-filter'));}
}
function creationFilterValues(){const data=new FormData($('#agent-filter'));return {...Object.fromEntries(data),sourceIds:data.getAll('sourceIds')};}
function setCreationMode(mode){
 if(!creationViews[mode]||mode===creationMode)return;
 leaveArrivalCard();
 Object.assign(creationViews[creationMode],{inputs:creationFilterValues(),left:$('#agent-cards').scrollTop,right:$('#agent-article-scroll').scrollTop});
 creationMode=mode;
 if(currentPage==='agent')visitedCreationModes.add(mode);
 $$('.creation-tabs [role=tab]').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.id===mode)));
 renderCreationFilter();renderAgentCards();renderAgentArticle(false);
 $('#agent-cards').scrollTop=creationViews[mode].left;$('#agent-article-scroll').scrollTop=creationViews[mode].right;
}
function renderAgentCards(){
 const guide=creationMode==='灵感摘录',q=guide?guideQuery:agentQuery;
 const list=(guide?guideCandidates:agents).filter(a=>(!q.keyword||(a.title+' '+a.id).toLowerCase().includes(q.keyword.toLowerCase()))&&(!q.category||a.category===q.category)&&(!q.type||a.type===q.type)&&(!q.sourceIds?.length||q.sourceIds.includes(a.sourceId))&&(!q.range||fmt(guide?a.collectedAt:a.generatedAt).slice(0,10)>=dayBefore(Number(q.range)-1)));
 $('#agent-count').textContent=list.length;
 const previousTop=$('#agent-cards').scrollTop,previous=guide?selectedGuide:selectedAgent;
 const active=list.some(a=>a.id===previous)?previous:list[0]?.id||null;
 if(guide)selectedGuide=active;else selectedAgent=active;
 $('#agent-cards').innerHTML=list.map(a=>`<button class="agent-card ${a.id===active?'selected':''}" data-act="select-agent" data-id="${escapeHTML(a.id)}" aria-pressed="${a.id===active}"><span class="article-id">#${escapeHTML(a.id)}${arrivalDot('agent',a.id)}</span><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.summary)}</p><span class="tag ${a.id===active?'blue':''}">${escapeHTML(guide?materialTypes[a.type]:a.category)}</span></button>`).join('')||'<div class="empty"><b>创作内容暂不可用</b></div>';
 $('#agent-cards').scrollTop=previousTop;
 if(active!==previous){leaveArrivalCard();renderAgentArticle(true);}
}
function renderAgentArticle(reset=true){
 const guide=creationMode==='灵感摘录',a=guide?guideCandidates.find(a=>a.id===selectedGuide):agents.find(a=>a.id===selectedAgent);
 if(!a){$('#agent-article-top').innerHTML='';$('#agent-article-scroll').innerHTML='<div class="empty"><b>选择一篇内容开始阅读</b></div>';return;}
 const sources=guide?`<span>${escapeHTML(a.source)}</span><a class="source-chip" href="#material-${escapeHTML(a.id)}" data-material="${escapeHTML(a.id)}" title="查看原始素材">素材 #${escapeHTML(a.id)}</a><button class="text-button" data-act="original" data-id="${escapeHTML(a.id)}">原文链接 <span data-icon="external"></span></button>`:`参考素材 ${a.materialIds.map(id=>`<a class="source-chip" href="#material-${id}" data-material="${id}" title="素材 ${escapeHTML(id)}：${escapeHTML(materials.find(m=>m.id===id)?.title)}" aria-label="查看参考素材 ${escapeHTML(id)}：${escapeHTML(materials.find(m=>m.id===id)?.title)}">#${escapeHTML(id)}</a>`).join('')}`;
 $('#agent-article-top').innerHTML=`<div class="article-top-row"><div><div class="eyebrow mono">${guide?'素材 ID':'稿件 ID'}：${escapeHTML(a.id)}</div><h2>${escapeHTML(a.title)}</h2></div><button class="button primary" data-act="${guide?'guide-edit':'agent-edit'}" data-id="${escapeHTML(a.id)}">编辑发布 <span data-icon="external"></span></button></div><div class="article-meta"><span>${creationMode}</span><span class="tag blue">${escapeHTML(guide?materialTypes[a.type]:a.category)}</span><time>${guide?'采集于 ':''}${fmt(guide?a.collectedAt:a.generatedAt)}</time></div><div class="source-links">${sources}</div>`;
 $('#agent-article-scroll').innerHTML=`<article class="article-body">${guide&&a.type==='video'?`<div class="video-placeholder">视频暂不可播放</div><p>${escapeHTML(a.summary)}</p><p class="source-url">${escapeHTML(a.videoUrl)}</p>`:renderBody(a)}</article>`;
 trackDisplayedArrival();
 if(reset)$('#agent-article-scroll').scrollTop=0;
}
function selectAgent(id,markSeen=true){
 if(pendingArrivalCard!==id)leaveArrivalCard();
 if(markSeen&&arrivals.agent.has(id))pendingArrivalCard=id;
 if(creationMode==='灵感摘录')selectedGuide=id;else selectedAgent=id;
 $$('.agent-card').forEach(c=>{c.classList.toggle('selected',c.dataset.id===id);c.setAttribute('aria-pressed',String(c.dataset.id===id));});
 renderAgentArticle(true);
}
function returnToCreation(p){
 setCreationMode(p.sourceMaterial?'灵感摘录':'前沿资讯');navigate('agent');
 const id=p.sourceMaterial||p.sourceAgentId,current=creationMode==='灵感摘录'?selectedGuide:selectedAgent;
 if(id&&current!==id){
  $('#agent-filter').reset();if(creationMode==='灵感摘录'){guideQuery={};updateSourcePicker($('#agent-filter'));}else agentQuery={};
  renderAgentCards();selectAgent(id,false);
  $(`[data-act="select-agent"][data-id="${id}"]`)?.scrollIntoView?.({block:'nearest'});
 }
}
function postOrigin(p,links=false){
 if(p.sourceMaterial)return links?`<button class="action-link mono" data-act="source-guide" data-id="${escapeHTML(p.sourceMaterial)}">素材 ${escapeHTML(p.sourceMaterial)}</button>`:'素材 '+escapeHTML(p.sourceMaterial);
 if(p.sourceAgentId)return links?`<button class="action-link mono" data-act="source-agent" data-id="${escapeHTML(p.sourceAgentId)}">Agent 原稿 ${escapeHTML(p.sourceAgentId)}</button>`:'Agent 原稿 '+escapeHTML(p.sourceAgentId);
 return '人工新建';
}
function sourcePickerMarkup(scope='materials'){
 const pickerId=scope==='guide'?'guide-source-picker':'source-picker',prefix=scope==='guide'?'guide-':'';
 return `<div class="field source-field"><span>采集来源</span><details id="${pickerId}" class="source-picker"><summary title="全部来源">全部来源</summary><div class="source-popover"><div class="source-picker-head"><label><input type="checkbox" data-source-all checked>全部来源</label><span>可跨组多选</span></div><div class="source-tree">${sourceGroups.map((group,index)=>`<div class="source-group" data-group="${group.id}"><div class="source-group-heading"><label><input type="checkbox" data-source-group="${group.id}"><strong>${group.name}</strong><span class="source-group-count">${group.sources.length}</span></label><button type="button" data-act="source-expand" data-id="${group.id}" aria-controls="${prefix}source-group-${group.id}" aria-label="展开或收起${group.name}" aria-expanded="${index===0}"><span data-icon="chevron"></span></button></div><div class="source-children" id="${prefix}source-group-${group.id}" ${index===0?'':'hidden'}>${group.sources.map(source=>`<label title="${escapeHTML(source.name)}"><input type="checkbox" name="sourceIds" value="${source.id}" data-source-leaf="${group.id}"><span>${escapeHTML(source.name)}</span></label>`).join('')}</div></div>`).join('')}</div><div class="source-picker-foot"><span id="${prefix}source-selection-count" class="source-selection-count">全部来源</span><button class="text-button" type="button" data-act="source-done">完成选择</button></div></div></details></div>`;
}
function updateSourcePicker(form=$('#filter-materials')){
 if(!form||!$('.source-picker',form))return;
 const leaves=$$('input[name=sourceIds]',form),chosen=leaves.filter(c=>c.checked);
 $('[data-source-all]',form).checked=chosen.length===0;
 sourceGroups.forEach(group=>{const items=leaves.filter(c=>c.dataset.sourceLeaf===group.id),checked=items.filter(c=>c.checked).length,control=$(`[data-source-group="${group.id}"]`,form);control.checked=checked===items.length;control.indeterminate=checked>0&&checked<items.length;});
 const summary=$('.source-picker>summary',form);
 summary.textContent=chosen.length===0?'全部来源':chosen.length===1?sourceCatalog.find(s=>s.id===chosen[0].value).name:`已选 ${chosen.length} 个来源`;
 summary.title=chosen.length?chosen.map(c=>sourceCatalog.find(s=>s.id===c.value).name).join('、'):'全部来源';
 $('.source-selection-count',form).textContent=chosen.length?`已选 ${chosen.length} / ${leaves.length} 个来源`:`全部 ${leaves.length} 个来源`;
}
function renderMaterials(){
 $('#material-content').innerHTML=`<form class="filter-box material-filters" id="filter-materials" data-filter="materials"><div class="filter-row"><label class="field"><span>类型</span><select name="type" aria-label="素材类型"><option value="">全部类型</option><option value="article">文章</option><option value="video">视频</option><option value="other">其他</option></select></label>${sourcePickerMarkup()}<label class="field"><span>排序</span><select name="sort" aria-label="素材排序"><option value="time-desc">采集时间：从新到旧</option><option value="time-asc">采集时间：从旧到新</option><option value="refs-desc">被引次数：从多到少</option><option value="refs-asc">被引次数：从少到多</option></select></label><label class="field"><span>关键词</span><input name="keyword" placeholder="搜索素材标题或 ID"></label><div class="field date-field"><span>采集时间</span><input type="date" name="start" aria-label="采集开始日期"><span>至</span><input type="date" name="end" aria-label="采集结束日期"><select class="quick-date" name="quick" data-quick="materials" aria-label="采集时间快捷日期"><option value="">快捷日期</option><option value="today">今天</option><option value="yesterday">昨天</option><option value="3">近三天</option><option value="7">近七天</option><option value="30">近30天</option></select></div><div class="filter-actions"><button class="button primary" type="submit">查询</button><button type="button" class="button" data-act="reset-filter" data-id="materials">重置</button></div></div></form><div class="table-card"><div class="table-caption"><div><strong>原始素材</strong><small id="result-materials"></small></div><span class="muted">评分1 / 评分2 · 满分100</span></div><div class="table-scroll" id="scroll-materials"></div><div class="table-footer" id="footer-materials"></div></div>`;
 $('#material-content').style.cssText='display:flex;flex-direction:column;flex:1;min-height:0';
 updateSourcePicker();renderMaterialTable();
}
function materialReferenceCount(id){return new Set(agents.filter(a=>a.materialIds.includes(id)).map(a=>a.id)).size;}
function renderMaterialTable(){
 const q=queryState.materials;
 const list=materials.filter(m=>{const d=fmt(m.collectedAt).slice(0,10);return(!q.keyword||(m.title+' '+m.id).toLowerCase().includes(q.keyword.toLowerCase()))&&(!q.type||m.type===q.type)&&(!q.sourceIds?.length||q.sourceIds.includes(m.sourceId))&&(!q.start||d>=q.start)&&(!q.end||d<=q.end);}).sort((a,b)=>{const time=new Date(b.collectedAt)-new Date(a.collectedAt),refs=materialReferenceCount(b.id)-materialReferenceCount(a.id);return(q.sort==='refs-desc'?refs||time:q.sort==='refs-asc'?-refs||time:q.sort==='time-asc'?-time:time)||b.id.localeCompare(a.id);});
 const totalPages=Math.max(1,Math.ceil(list.length/8));pageNumbers.materials=Math.min(pageNumbers.materials,totalPages);
 const slice=list.slice((pageNumbers.materials-1)*8,pageNumbers.materials*8),scroller=$('#scroll-materials'),top=scroller.scrollTop;
 $('#result-materials').textContent=`共 ${list.length} 条`;
 scroller.innerHTML=`<table class="content-table material-table"><thead><tr><th class="id-col">素材 ID</th><th>标题</th><th class="material-type-col">类型</th><th class="material-source-col">采集来源</th><th>评分1</th><th>评分2</th><th class="reference-count-col" title="引用该素材的不同 Agent 稿件数量；同稿重复引用计一次">被索引次数 <span data-icon="info"></span></th><th class="time-col">原文发布时间</th><th class="time-col">采集时间</th><th class="sticky-action">操作</th></tr></thead><tbody>${slice.map(m=>`<tr><td class="id-col mono">${escapeHTML(m.id)}</td><td class="material-title"><strong title="${escapeHTML(m.title)}">${escapeHTML(m.title)}</strong>${arrivalDot('materials',m.id)}</td><td class="material-type-col"><span class="tag ${m.type==='video'?'blue':''}">${materialTypes[m.type]}</span></td><td class="material-source-col"><strong title="${escapeHTML(m.source)}">${escapeHTML(m.source)}</strong><small>${escapeHTML(m.sourceGroup)}</small></td><td class="score">${m.score1??'—'} ${m.score1!==null?'<small>/ 100</small>':''}</td><td class="score">${m.score2??'—'} ${m.score2!==null?'<small>/ 100</small>':''}</td><td class="reference-count-col mono" data-reference-count="${escapeHTML(m.id)}" title="被 ${materialReferenceCount(m.id)} 篇 Agent 稿件引用">${materialReferenceCount(m.id)}</td><td class="time-col mono">${fmt(m.originalAt)}</td><td class="time-col mono">${fmt(m.collectedAt)}</td><td class="sticky-action"><button class="action-link" data-act="material-detail" data-id="${escapeHTML(m.id)}">查看详情</button><button class="action-link" data-act="original" data-id="${escapeHTML(m.id)}">打开原文 <span data-icon="external"></span></button></td></tr>`).join('')||'<tr><td colspan="10"><div class="empty"><b>素材列表暂不可用</b></div></td></tr>'}</tbody></table>`;
 scroller.scrollTop=top;
 $('#footer-materials').innerHTML=footer('materials',list.length,totalPages,pageNumbers.materials);
}

function modal({title,body,actions='',large=false,editorClass=false,onClose}){
 const overlay=document.createElement('div');overlay.className='overlay';overlay.dataset.modalId=String(++overlayId);
 overlay.innerHTML=`<section class="modal ${large?'large':''} ${editorClass?'editor':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title-${overlayId}" tabindex="-1"><header class="modal-head"><h2 id="modal-title-${overlayId}">${title}</h2><button class="close-button" aria-label="关闭窗口"><span data-icon="close"></span></button></header>${editorClass?body:`<div class="modal-body">${body}</div>`}${actions?`<footer class="modal-actions">${actions}</footer>`:''}</section>`;
 const previousFocus=document.activeElement;
 const close=()=>{overlay.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
 overlay._close=()=>onClose?onClose(close):close();
 $('.close-button',overlay).onclick=overlay._close;
 $('#modal-root').append(overlay);
 requestAnimationFrame(()=>$('.modal',overlay).focus({preventScroll:true}));
 return {el:overlay,close};
}
function confirmation({title,copy,ok='确认',danger=false,onConfirm}){
 const m=modal({title,body:`<div class="confirm-mark"><span data-icon="alert"></span></div><div class="confirm-copy">${copy}</div>`,actions:`<button class="button" data-local="cancel">取消</button><button class="button ${danger?'danger':'primary'}" data-local="ok">${ok}</button>`});
 $('[data-local=cancel]',m.el).onclick=m.close;
 $('[data-local=ok]',m.el).onclick=()=>{m.close();onConfirm();};return m;
}
function viewMaterial(id,fromAgent=false){
 const m=materials.find(m=>m.id===id);if(!m){notify('素材详情暂不可用');return;}
 if(fromAgent)navigate('materials');
 const view=modal({title:`素材详情 <small class="mono">#${escapeHTML(m.id)}</small>`,large:true,body:`<h2 class="confirm-title">${escapeHTML(m.title)}</h2><div class="detail-meta"><span class="tag blue">${materialTypes[m.type]}</span><span>${escapeHTML(m.sourceGroup)} / ${escapeHTML(m.source)}</span><span>原文发布：<time>${fmt(m.originalAt)}</time></span><span>采集：<time>${fmt(m.collectedAt)}</time></span></div><div class="detail-score"><div class="detail-reference-count" title="不同 Agent 原稿的引用数量；发布副本、撤回及重发不重复计数">被索引次数<strong data-reference-count="${escapeHTML(m.id)}">${materialReferenceCount(m.id)}<small> 次</small></strong></div><div>评分1<strong>${m.score1??'—'}<small>${m.score1===null?'':' / 100'}</small></strong></div><div>评分2<strong>${m.score2??'—'}<small>${m.score2===null?'':' / 100'}</small></strong></div></div><article class="article-body">${renderBody(m)}</article><div class="source-url">原文链接：${escapeHTML(m.url)}</div>`,actions:`<button class="button" data-local="original">打开原文 <span data-icon="external"></span></button><button class="button primary" data-local="return">${fromAgent?'返回内容创作':'关闭详情'}</button>`,onClose:close=>{close();if(fromAgent)navigate('agent');}});
 $('[data-local=original]',view.el).onclick=()=>showOriginal(m);
 $('[data-local=return]',view.el).onclick=()=>{view.close();if(fromAgent)navigate('agent');};
}
function showOriginal(m){const url=ContentSafety.url(m?.url);if(url)window.open(url,'_blank','noopener,noreferrer');else notify('暂无可用的原文链接');}
function renderBody(p){return p.bodyFormat==='plain'?'<pre class="plain-body">'+escapeHTML(p.body)+'</pre>':ContentSafety.html(p.body);}
function preview(p){
 const body=p.type==='video'?`<div class="video-placeholder"><span data-icon="play"></span> 视频内容预览</div><p class="muted" style="font-size:12px;margin-top:15px">${escapeHTML(p.summary||'暂无摘要')}</p><p class="source-url">视频地址：${escapeHTML(p.videoUrl||'尚未填写')}</p>`:renderBody(p);
 const m=modal({title:`文章预览 <small>稿件 #${escapeHTML(p.postNumber??p.id)} · ${p.state==='published'?'已发布':'待发布'}</small>`,large:true,body:`<div class="detail-meta"><span>${escapeHTML(p.channel)}</span><span class="tag blue">${escapeHTML(p.category||'未分类')}</span>${p.featured?'<span class="feature-yes"><span data-icon="star"></span> 精选</span>':''}</div><article class="article-body"><h2 style="margin-top:0;font-size:25px">${escapeHTML(p.title)}</h2>${body}</article>`,actions:'<button class="button primary" data-local="close-preview">关闭预览</button>'});
 $('[data-local=close-preview]',m.el).onclick=m.close;
}
function createDraft(a,channel='前沿资讯'){const p=AdminRuntime.createDraft(a,channel);posts.unshift(p);refreshBusiness();return p;}
function agentEdit(id,button){
 if(button.disabled)return;button.disabled=true;
 const a=agents.find(a=>a.id===id);if(!a)return;
 const p=createDraft(a);navigate('operations');setOpMode('draft');
 resetFilter('draft');
 openEditor(p,'agent');
 notify(`已创建待发布副本 #${escapeHTML(p.postNumber??p.id)}`);
 setTimeout(()=>{if(button.isConnected)button.disabled=false;},500);
}
function guideEdit(id,button){
 const m=guideCandidates.find(m=>m.id===id);if(!m||button.disabled)return;
 button.disabled=true;
 const p=createDraft({title:m.title,summary:m.summary,body:m.body,cover:'',channel:'灵感摘录',category:'',type:m.type,videoUrl:m.videoUrl,sourceMaterial:m.id,materialIds:[m.id],sourceUrl:m.url},'灵感摘录');
 navigate('operations');setOpMode('draft');resetFilter('draft');openEditor(p,'guide');
 notify(`已创建待发布副本 #${escapeHTML(p.postNumber??p.id)}`);
 setTimeout(()=>{if(button.isConnected)button.disabled=false;},500);
}
function newContent(){
 if(!AdminRuntime.canCreate){notify('新建服务暂不可用');return;}
 const m=modal({title:'新建内容',body:'<p class="confirm-copy">选择发布栏目，创建后进入待发布编辑。</p><div class="new-options"><button class="new-option" data-channel-new="前沿资讯"><strong>前沿资讯</strong><span>资讯文章<br>分类、标签及正文编辑</span></button><button class="new-option" data-channel-new="灵感摘录"><strong>灵感摘录</strong><span>转载指南<br>支持图文或视频</span></button></div>'});
 $$('[data-channel-new]',m.el).forEach(b=>b.onclick=()=>{m.close();const p=createDraft(null,b.dataset.channelNew);navigate('operations');setOpMode('draft');resetFilter('draft');openEditor(p,'operations');});
}
function editorCategoryOptions(channel,current){return '<option value="">请选择分类</option>'+categoriesFor(channel).map(c=>`<option value="${escapeHTML(c)}" ${c===current?'selected':''}>${escapeHTML(c)}</option>`).join('');}
function openEditor(p,origin){
 if(editor)return;
 const working=structuredClone(p);
 const plain=p.bodyFormat==='plain';
 let dirty=false,coverValue=p.cover||'',loading=false,checkedRelease=null,editEpoch=0,closePrompt=false;
 const m=modal({title:`编辑发布 <small>运营管理 / 待发布 / #${escapeHTML(p.postNumber??p.id)}</small>`,editorClass:true,body:`<div class="editor-grid">
 <div class="editor-main"><input id="edit-title" class="editor-title" aria-label="文章标题" placeholder="请输入文章标题" value="${escapeHTML(p.title)}"><div class="rich-box" id="rich-box" ${p.type==='video'?'hidden':''}>${RichEditor.toolbar()}<div id="edit-body" class="rich-content" contenteditable="true" role="textbox" aria-label="文章正文" aria-multiline="true">${ContentSafety.html(plain?'':p.body)}</div><textarea id="edit-plain-body" class="rich-content plain-editor" aria-label="文章正文" ${plain?'':'hidden'}>${escapeHTML(plain?p.body:'')}</textarea></div><div class="video-editor" id="video-editor" ${p.type==='video'?'':'hidden'}><label>视频地址</label><input id="edit-video" placeholder="https://…" value="${escapeHTML(p.videoUrl||'')}"><div class="video-placeholder"><span data-icon="play"></span> 视频内容</div></div></div>
 <aside class="editor-settings"><div class="editor-field"><span class="field-label">封面</span><div class="cover-display" id="edit-cover-display">${coverValue?`<img src="${escapeHTML(fallbackCover(p))}" alt="当前封面">`:'未设置封面'}</div><input type="file" accept="image/*" id="edit-cover-file" class="file-control" aria-label="选择封面图片"><button class="text-button" data-local="clear-cover">清除封面</button></div><div class="editor-field"><label for="edit-summary">摘要</label><textarea id="edit-summary">${escapeHTML(p.summary)}</textarea></div><div class="editor-field"><span class="field-label required" id="edit-taxonomy-label">栏目/分类</span><div class="editor-taxonomy" role="group" aria-labelledby="edit-taxonomy-label"><select id="edit-channel" aria-label="栏目" disabled><option ${p.channel==='前沿资讯'?'selected':''}>前沿资讯</option><option ${p.channel==='灵感摘录'?'selected':''}>灵感摘录</option></select><i class="taxonomy-slash" aria-hidden="true">/</i><select id="edit-category" aria-label="分类">${editorCategoryOptions(p.channel,p.category)}</select></div></div><div class="editor-field"><span class="field-label">创作方式</span><span id="edit-origin">${p.origin==='reprint'?'转载':'二创'}</span></div><div class="editor-field" id="type-field" ${p.channel==='灵感摘录'?'':'hidden'}><label for="edit-type">媒体类型</label><select id="edit-type"><option value="article" ${p.type==='article'?'selected':''}>图文</option><option value="video" ${p.type==='video'?'selected':''}>视频</option></select></div><div class="editor-field"><label for="edit-tags">标签</label><input id="edit-tags" placeholder="多个标签以逗号分隔" value="${escapeHTML(p.tags||'')}"></div><div class="editor-field"><label for="edit-url">原文链接</label><input id="edit-url" type="url" placeholder="https://…" value="${escapeHTML(p.sourceUrl||'')}"></div><details class="editor-record"><summary>稿件信息</summary><div class="editor-field"><span class="field-label">稿件来源</span><span class="editor-origin">${postOrigin(p)}</span></div><div class="editor-field"><span class="field-label">创建时间</span><time class="editor-origin mono" data-created-at>${fmt(p.firstCreatedAt)}</time></div><div class="editor-field"><span class="field-label">进入待发布时间</span><time class="editor-origin mono" data-entered-at>${fmt(p.enteredAt)}</time></div></details></aside>
 <aside class="editor-publish"><div class="editor-field"><span class="field-label">当前状态</span><span class="tag ${p.draftState==='被撤回'?'red':'amber'}">${p.draftState}</span></div><div class="editor-field"><span class="field-label">是否精选</span><div class="radio-row"><label><input type="radio" name="edit-featured" value="yes" ${p.featured?'checked':''}>是</label><label><input type="radio" name="edit-featured" value="no" ${p.featured?'':'checked'}>否</label></div></div><div class="editor-field"><span class="field-label">发布方式</span><span class="tag blue">立即发布</span></div><div class="editor-field"><label for="edit-byline">署名</label><input id="edit-byline" value="${escapeHTML(p.byline||'')}"></div><div class="editor-field"><label for="edit-slug">发布路径</label><input id="edit-slug" placeholder="article-title" value="${escapeHTML(p.slug||'')}" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></div><div class="editor-field"><span class="field-label">修订依据</span><span id="edit-basis-state">${basisLabel(p)}</span><button class="action-link" data-local="view-basis">查看依据</button></div><div id="editor-error" class="editor-field validation" role="alert" hidden></div></aside></div>`,actions:`<div class="editor-footer-left"><span class="editor-status" id="edit-save-state" data-state="dirty" role="status" aria-live="polite">未保存</span><span id="editor-save-error" role="alert" hidden></span></div><button class="button" data-local="preview">预览</button><button class="button" data-local="save">保存草稿</button><button class="button" data-local="check-release">发布前检查</button><button class="button primary" data-local="publish" disabled>发布</button>`,onClose:close=>askClose(close)});
 m.el.dataset.draftId=p.id;
 editor={p,origin,el:m.el};
 const get=s=>$(s,m.el);
 const languageBar=document.createElement('div');languageBar.className='edit-language-bar';languageBar.innerHTML='<button type="button" data-lang="zh" class="is-active">中文</button><button type="button" data-lang="en">English</button>';
 const main=get('.editor-main');main.prepend(languageBar);
 const en=document.createElement('div');en.id='english-editor';en.hidden=true;en.innerHTML='<input id="edit-en-title" class="editor-title" aria-label="English title" placeholder="English title"><div class="rich-box">'+RichEditor.toolbar()+'<div id="edit-en-body" class="rich-content" contenteditable="true" role="textbox" aria-label="English body"></div></div>';main.append(en);
 get('#edit-en-title').value=p.enTitle||'';get('#edit-en-body').innerHTML=ContentSafety.html(p.enBody||'');
 languageBar.onclick=event=>{const button=event.target.closest('[data-lang]');if(!button)return;const english=button.dataset.lang==='en';get('#english-editor').hidden=!english;get('#edit-title').hidden=english;get('#rich-box').hidden=english||p.type==='video';get('#video-editor').hidden=english||p.type!=='video';languageBar.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b===button));};
 const markDirty=event=>{
  checkedRelease=null;editEpoch++;get('[data-local=publish]').disabled=true;
  dirty=true;autosave.schedule();working.reviewStatus='draft';
  if(!event||['edit-body','edit-en-body','edit-plain-body'].includes(event.target?.id)){
   working.basisState='stale';get('#edit-basis-state').textContent='待重新生成';
  }
 };
 const collect=()=>({...working,enTitle:get('#edit-en-title').value,enBody:ContentSafety.html(get('#edit-en-body').innerHTML),title:get('#edit-title').value.trim(),body:plain?get('#edit-plain-body').value:ContentSafety.html(get('#edit-body').innerHTML),byline:get('#edit-byline').value,slug:get('#edit-slug').value.trim(),summary:get('#edit-summary').value,cover:coverValue,channel:working.channel,category:get('#edit-category').value,tags:get('#edit-tags').value,sourceUrl:get('#edit-url').value,type:working.channel==='灵感摘录'?get('#edit-type').value:'article',videoUrl:get('#edit-video').value.trim(),featured:get('input[name=edit-featured]:checked').value==='yes'});
 function setSaveState(state){
  const el=get('#edit-save-state');el.dataset.state=state;el.textContent={dirty:'未保存',saving:'保存中…',saved:'已保存',error:'未保存'}[state];el.title=state==='saved'?'已保存到当前浏览器':'修改尚未保存';
  if(state!=='error'){get('#editor-save-error').hidden=true;get('#editor-save-error').textContent='';}
 }
 const autosave=createDraftAutosave({save:async()=>{
   const data=collect(),epoch=editEpoch;
  const saved=await AdminRuntime.save(data);
  Object.assign(p,saved);working.backendVersion=saved.backendVersion;working.backendFingerprint=saved.backendFingerprint;
  if(epoch===editEpoch){Object.assign(working,saved);dirty=false;get('#edit-basis-state').textContent=basisLabel(saved);}
  refreshBusiness();
 },onState:setSaveState,onError:error=>{dirty=true;const label=get('#editor-save-error');label.textContent='保存失败：'+error.message;label.hidden=false;}});
 function save(){return autosave.flush();}
 function cleanup(){autosave.destroy();richEditor.destroy();englishRichEditor.destroy();window.removeEventListener('pagehide',flushOnLeave);document.removeEventListener('visibilitychange',flushWhenHidden);}
 function finish(){cleanup();editor=null;m.close();}
 function flushOnLeave(){if(!closePrompt)autosave.flush();}
 function flushWhenHidden(){if(document.hidden&&!closePrompt)autosave.flush();}
 function askClose(close){
  if(loading||autosave.saving){notify('正在提交，请稍候');return;}
  if(!dirty){cleanup();editor=null;close();return;}
  closePrompt=true;autosave.pause();
  const resume=()=>{closePrompt=false;if(dirty)autosave.schedule();};
  let savingClose=false;
  const c=modal({title:'保存这次修改？',body:'<p class="confirm-copy">还有未保存的修改。</p>',actions:'<button class="button" data-local="discard">放弃修改</button><button class="button" data-local="continue">继续编辑</button><button class="button primary" data-local="save-close">保存并关闭</button>',onClose:done=>{if(savingClose)return;done();resume();}});
  $('[data-local=continue]',c.el).onclick=()=>{c.close();resume();};
  $('[data-local=discard]',c.el).onclick=()=>{c.close();cleanup();editor=null;close();};
  $('[data-local=save-close]',c.el).onclick=async()=>{if(savingClose)return;savingClose=true;$$('button',c.el).forEach(b=>b.disabled=true);if(!await save()){savingClose=false;$$('button',c.el).forEach(b=>b.disabled=false);return;}c.close();cleanup();editor=null;close();};
 }
 const richEditor=plain?{destroy(){}}:RichEditor.mount({root:m.el,body:get('#edit-body'),dialog:modal,notify,onChange:()=>markDirty()});
 const englishRichEditor=RichEditor.mount({root:en,body:get('#edit-en-body'),dialog:modal,notify,onChange:()=>markDirty()});
 const fieldChanged=event=>{if(!event.target.closest('.rich-toolbar'))markDirty(event);};
 m.el.addEventListener('input',fieldChanged);
 m.el.addEventListener('change',fieldChanged);
 get('[data-local=save]').onclick=save;
 window.addEventListener('pagehide',flushOnLeave);document.addEventListener('visibilitychange',flushWhenHidden);
 m.el.addEventListener('compositionstart',()=>autosave.composition(true));m.el.addEventListener('compositionend',()=>autosave.composition(false));
 if(AdminRuntime.has(p))setSaveState('saved');else setSaveState('dirty');
 if(plain){get('#edit-body').hidden=true;get('#edit-body').contentEditable='false';$$('.rich-toolbar button,.rich-toolbar select,.rich-toolbar input',m.el).forEach(el=>{el.disabled=true;el.title='当前服务仅支持纯文本';});}
 for(const selector of ['#edit-cover-file','[data-local=clear-cover]','#edit-tags','#edit-url','#edit-type','#edit-video','input[name=edit-featured]']){
  if(p.backendId)$$ (selector,m.el).forEach(el=>{el.disabled=true;el.title='此字段暂不支持保存';});
 }
 get('[data-local=preview]').onclick=()=>{const data=collect();preview(get('#english-editor').hidden?data:{...data,title:data.enTitle,body:data.enBody});};
 get('[data-local=view-basis]').onclick=()=>viewBasis(collect());
 get('[data-local=check-release]').onclick=async event=>{
  const button=event.currentTarget,epoch=editEpoch;button.disabled=true;
  if(dirty||autosave.saving){if(!await save()){button.disabled=false;return;}}
  if(!m.el.isConnected)return;
  const result=await checkRelease(collect());
  button.disabled=false;
  if(epoch!==editEpoch||!m.el.isConnected)return;
  checkedRelease=result;get('[data-local=publish]').disabled=!result.eligible;
 };
 get('[data-local=clear-cover]').onclick=()=>{coverValue='';get('#edit-cover-display').textContent='未设置封面';get('#edit-cover-file').value='';markDirty();};
 get('#edit-cover-file').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/')){notify('请选择图片文件');return;}const reader=new FileReader();reader.onload=()=>{coverValue=reader.result;get('#edit-cover-display').innerHTML=`<img src="${escapeHTML(coverValue)}" alt="已选封面">`;markDirty();};reader.readAsDataURL(f);};
 get('#edit-type').onchange=()=>{get('#rich-box').hidden=get('#edit-type').value==='video';get('#video-editor').hidden=get('#edit-type').value!=='video';markDirty();};

 get('[data-local=publish]').onclick=()=>{
  if(loading)return;
  const data=collect(),error=publicationValidation(data);
  if(error||!checkedRelease?.eligible||checkedRelease.fingerprint!==publicationFingerprint(data)){
   get('#editor-error').hidden=false;get('#editor-error').textContent=error||'请完成当前稿件的发布前检查。';return;
  }
  confirmation({title:'确认发布',copy:`<div class="confirm-title">${escapeHTML(data.title)}</div>`,ok:'确认发布',onConfirm:async()=>{
   if(loading)return;
   if(publicationFingerprint(collect())!==checkedRelease?.fingerprint){get('#editor-error').hidden=false;get('#editor-error').textContent='内容已修改，请重新检查。';return;}
   loading=true;autosave.pause();
   const controls=$$('button,input,select,textarea,[contenteditable]',m.el).map(el=>[el,el.disabled,el.getAttribute('contenteditable')]);
   for(const [el] of controls){el.disabled=true;if(el.hasAttribute('contenteditable'))el.contentEditable='false';}
   m.el.setAttribute('aria-busy','true');
   try{
    const release=await RoutingBriefAPI.publish(data);
    Object.assign(p,data,{state:'published',publishedAt:release.createdAt,releaseId:release.id,releaseVersion:release.version});
    p.history.push({action:'publish',at:p.publishedAt});selected.draft.delete(p.id);refreshBusiness();finish();publishSuccess(p,origin);
   }catch(error){get('#editor-error').hidden=false;get('#editor-error').textContent=error.message;checkedRelease=null;}
   finally{loading=false;m.el.removeAttribute('aria-busy');if(m.el.isConnected){for(const [el,disabled,editable] of controls){el.disabled=disabled;if(editable!==null)el.setAttribute('contenteditable',editable);}get('[data-local=publish]').disabled=true;}}
  }});
 };
}

function publishSuccess(p,origin){
 const m=modal({title:'发布成功',body:`<div class="confirm-mark success-mark"><span data-icon="check"></span></div><h2 class="success-title">${escapeHTML(p.title)}</h2>`,actions:'<button class="button" data-local="back">返回内容创作</button><button class="button primary" data-local="published">查看已发布</button>'});
 $('[data-local=published]',m.el).onclick=()=>{m.close();navigate('operations');setOpMode('published');resetFilter('published');};
 $('[data-local=back]',m.el).onclick=()=>{m.close();if(p.sourceAgentId||p.sourceMaterial)returnToCreation(p);else navigate('agent');};
}
function withdraw(id){
 const p=posts.find(p=>p.id===id);if(!p||p.state!=='published')return;
 let pending=false;
 const m=modal({title:'撤回文章',body:`<h2 class="confirm-title">${escapeHTML(p.title)}</h2><label for="withdraw-reason">撤回原因</label><textarea id="withdraw-reason" maxlength="4000" required></textarea><p id="withdraw-error" class="validation" role="alert" hidden></p>`,actions:'<button class="button" data-local="cancel">取消</button><button class="button danger" data-local="withdraw-confirm">确认撤回</button>',onClose:close=>{if(!pending)close();}});
 $('[data-local=cancel]',m.el).onclick=()=>{if(!pending)m.close();};
 $('[data-local=withdraw-confirm]',m.el).onclick=async()=>{
  if(pending)return;
  const reason=$('#withdraw-reason',m.el).value.trim(),error=$('#withdraw-error',m.el);
  if(!reason){error.textContent='请填写撤回原因';error.hidden=false;return;}
  pending=true;$$('button,textarea',m.el).forEach(el=>el.disabled=true);
  try{
   await RoutingBriefAPI.withdraw(p,reason);
   try{AdminUI.replacePosts(await AdminRuntime.loadPosts());}
   catch(error){AdminRuntime.clear();AdminUI.clear();const state=$('#connection-state');state.textContent='撤回已完成，列表读取失败，请重新加载：'+error.message;state.hidden=false;}
   m.close();notify('文章已撤回');
  }
  catch(e){error.textContent=e.message;error.hidden=false;}
  finally{pending=false;$$('button,textarea',m.el).forEach(el=>el.disabled=false);}
 };
}

function deleteDraft(id){try{AdminRuntime.removeDraft(id);const at=posts.findIndex(p=>p.id===id);if(at>=0)posts.splice(at,1);refreshBusiness();notify('草稿已删除');}catch(error){notify(error.message);}}

document.addEventListener('click',event=>{
 $$('.source-picker[open]').forEach(p=>{if(!p.contains(event.target))p.open=false;});
 const source=event.target.closest('[data-material]');if(source){event.preventDefault();viewMaterial(source.dataset.material,true);return;}
 const button=event.target.closest('[data-act],[data-page]');if(!button||button.disabled)return;
 if(button.dataset.page&&!button.dataset.act){navigate(button.dataset.page);return;}
 const id=button.dataset.id;
 switch(button.dataset.act){
  case 'navigate':navigate(id);break;
  case 'close-tab':event.stopPropagation();closeTab(id);break;
  case 'op-tab':setOpMode(id);break;
  case 'toggle-op-filters':opFiltersCollapsed=!opFiltersCollapsed;applyOpFilterVisibility();break;
  case 'source-expand':{const children=document.getElementById(button.getAttribute('aria-controls'));children.hidden=!children.hidden;button.setAttribute('aria-expanded',String(!children.hidden));break;}
  case 'source-done':button.closest('.source-picker').open=false;break;
  case 'new-content':newContent();break;
  case 'reload-posts':window.AdminSession?.reload();break;
  case 'reset-filter':resetFilter(id);break;
  case 'paginate':pageNumbers[id]=Number(button.dataset.page);id==='materials'?renderMaterialTable():renderPostTable(id);$('#scroll-'+id).scrollTop=0;break;
  case 'creation-mode':setCreationMode(id);break;
  case 'select-agent':selectAgent(id);break;
  case 'agent-reset':$('#agent-filter').reset();if(creationMode==='灵感摘录'){guideQuery={};updateSourcePicker($('#agent-filter'));}else agentQuery={};renderAgentCards();break;
  case 'agent-edit':agentEdit(id,button);break;
  case 'guide-edit':guideEdit(id,button);break;
  case 'preview-post':preview(posts.find(p=>p.id===id));break;
  case 'edit-post':openEditor(posts.find(p=>p.id===id),'operations');break;
  case 'withdraw':withdraw(id);break;
  case 'delete-draft':deleteDraft(id);break;
  case 'material-detail':viewMaterial(id);break;
  case 'original':showOriginal(materials.find(m=>m.id===id));break;
  case 'source-agent':returnToCreation({sourceAgentId:id});break;
  case 'source-guide':returnToCreation({sourceMaterial:id});break;
  case 'select-all':$$('input[data-select]',$('#panel-'+id)).forEach(c=>{c.checked=button.checked;if(c.checked)selected[id].add(c.dataset.id);else selected[id].delete(c.dataset.id);});updateSelection(id);break;
  case 'account':notify('账号设置暂未开放');break;
  case 'logout':window.AdminSession?.logout();break;
 }
});
document.addEventListener('submit',event=>{
 const form=event.target;if(form.dataset.filter){event.preventDefault();queryForm(form.dataset.filter);$$('.category-picker').forEach(d=>d.open=false);if($('#source-picker'))$('#source-picker').open=false;}
 else if(form.id==='agent-filter'){event.preventDefault();const q=creationFilterValues();if(creationMode==='灵感摘录')guideQuery=q;else agentQuery=q;renderAgentCards();$$('.source-picker',form).forEach(p=>p.open=false);}
});
document.addEventListener('change',event=>{
 const input=event.target;
 if(input.hasAttribute('data-source-all')){$$('input[name=sourceIds]',input.form).forEach(c=>c.checked=false);updateSourcePicker(input.form);}
 if(input.hasAttribute('data-source-group')){$$('input[name=sourceIds]',input.form).filter(c=>c.dataset.sourceLeaf===input.dataset.sourceGroup).forEach(c=>c.checked=input.checked);updateSourcePicker(input.form);}
 if(input.hasAttribute('data-source-leaf'))updateSourcePicker(input.form);
 if(input.dataset.channel){const form=input.form;$('.category-options',form).innerHTML=categoryOptions(input.value);$('.category-picker summary',form).textContent='全部';}
 if(input.name==='category'&&input.closest('.category-picker')){
  const form=input.form,all=$('input[name=category][value=""]',form),others=$$('input[name=category]',form).filter(c=>c.value);
  if(input.value===''){all.checked=true;others.forEach(c=>c.checked=false);}else{all.checked=!others.some(c=>c.checked);}
  const chosen=others.filter(c=>c.checked).map(c=>c.value);$('.category-picker summary',form).textContent=chosen.length===1?chosen[0]:chosen.length?'已选 '+chosen.length+' 类':'全部';
 }
 if(input.dataset.quick)quickDate(input.form,input.value);
 if(input.dataset.select){const mode=input.dataset.select;if(input.checked)selected[mode].add(input.dataset.id);else selected[mode].delete(input.dataset.id);updateSelection(mode);}
});
document.addEventListener('keydown',event=>{
 if(event.key==='Enter'&&event.target.matches('.page-tab')){event.preventDefault();navigate(event.target.dataset.id);}
 const top=$$('.overlay').at(-1);if(!top)return;
 if(event.key==='Escape'){event.preventDefault();top._close();return;}
 if(event.key==='Tab'){
  const scope=$('.rich-box.is-fullscreen',top)||top;
  const focusable=$$('button,input,select,textarea,a[href],[contenteditable=true],[tabindex="0"]',scope).filter(e=>!e.disabled&&e.getClientRects().length);
  const first=focusable[0],last=focusable.at(-1);if(!first)return;
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('.modal',top))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!top.contains(document.activeElement))){event.preventDefault();first.focus();}
 }
});
$('#settings-toggle').onclick=()=>{const el=$('#settings-children');el.hidden=!el.hidden;$('#settings-toggle').setAttribute('aria-expanded',String(!el.hidden));};
window.addEventListener('beforeunload',event=>{if(editor&&(editor.el.hasAttribute('aria-busy')||editor.el.querySelector('#edit-save-state')?.dataset.state!=='saved')){event.preventDefault();event.returnValue='';}});
document.addEventListener('paste',event=>{if(event.target.closest('[contenteditable=true]')){event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'));}});

updateArrivalBadges();renderCreationFilter();
renderOperationalPanels();renderMaterials();renderAgentCards();renderAgentArticle();navigate('operations');
function applyOpFilterVisibility(){
 $('.operations-frame').classList.toggle('filters-collapsed',opFiltersCollapsed);
 const button=$('[data-act=toggle-op-filters]');button.textContent=opFiltersCollapsed?'展开筛选':'收起筛选';button.setAttribute('aria-expanded',String(!opFiltersCollapsed));
 if(opFiltersCollapsed)$$('.operations-frame details').forEach(d=>d.open=false);
}
applyOpFilterVisibility();
window.AdminUI={
 replacePosts(items){posts.splice(0,posts.length,...items);selected.draft.clear();selected.published.clear();refreshBusiness();},
 clear(){posts.splice(0);materials.splice(0);agents.splice(0);guideCandidates.splice(0);arrivals.agent.clear();arrivals.materials.clear();refreshBusiness();renderAgentCards();renderAgentArticle();renderMaterials();updateArrivalBadges();},
 hasEditor(){return !!editor;}
};
const createButton=$('[data-act=new-content]');createButton.disabled=!AdminRuntime.canCreate;createButton.title=AdminRuntime.canCreate?'':'新建服务暂不可用';
function positionGuideSources(){
 const picker=$('#guide-source-picker');if(!picker?.open)return;
 const rect=picker.querySelector('summary').getBoundingClientRect(),popup=$('.source-popover',picker),width=Math.min(350,window.innerWidth-24);
 popup.style.width=width+'px';popup.style.left=Math.max(12,Math.min(rect.left,window.innerWidth-width-12))+'px';
 const below=window.innerHeight-rect.bottom-16,above=rect.top-16;
 popup.style.maxHeight=Math.max(80,Math.min(370,Math.max(below,above)))+'px';
 popup.style.top=below>=Math.min(260,above)?(rect.bottom+6)+'px':'auto';
 popup.style.bottom=below>=Math.min(260,above)?'auto':(window.innerHeight-rect.top+6)+'px';
}
document.addEventListener('toggle',e=>{if(e.target.id==='guide-source-picker')positionGuideSources();},true);
window.addEventListener('resize',positionGuideSources);
document.addEventListener('scroll',e=>{if(!e.target.closest?.('.source-popover'))positionGuideSources();},true);
