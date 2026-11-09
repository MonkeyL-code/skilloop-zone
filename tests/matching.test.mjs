import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { createDemoState, reduce } from '../src/state.js';
import { loopStatus, recommendLoops } from '../src/matching.js';

test('recommendations prioritize mutual skills and exclude self, unavailable, paired and unrelated people',()=>{
  const request={id:'mine',memberId:'you',offer:'Python',want:'PS 蒙版',time:'周六 15:00'};
  const topics=[
    {id:'oneway',memberId:'a',offer:'Photoshop',want:'吉他'},
    {id:'mutual',memberId:'b',offer:'Photoshop 蒙版',want:'Python',time:'周六 15:00'},
    {id:'unrelated',memberId:'c',offer:'吉他',want:'Python'},
    {id:'paired',memberId:'d',partnerId:'c',offer:'Photoshop',want:'Python'},
    {id:'paused',memberId:'e',offer:'Photoshop',want:'Python'},
    {...request}
  ];
  const users={a:{},b:{},c:{},d:{},e:{acceptingHelp:false},you:{}};
  assert.deepEqual(recommendLoops(request,topics,users).items.map(r=>r.topic.id),['mutual','oneway']);
  assert.equal(recommendLoops(request,topics,users).items[0].mutual,true);
  assert.equal(recommendLoops(request,topics,users,[],1).total,2);
  assert.equal(recommendLoops(request,topics,users,[{requestTopic:'mine',status:'accepted'}]).total,0);
  assert.equal(loopStatus(request,[{requestTopic:'mine',status:'invited'}]).state,'pending');
  assert.equal(loopStatus(request,[{requestTopic:'mine',status:'cancelled'}]).state,'open');
});

test('one Loop cannot accept a second partner after another invitation has been accepted',()=>{
  let state=reduce(createDemoState(),{type:'LOGIN'});state=reduce(state,{type:'VERIFY'});
  state=reduce(state,{type:'POST_TOPIC',domain:'visual',title:'修照片',body:'保留原图',offer:'Python',want:'PS'});
  const requestTopic=state.topics[0].id;
  for(const memberId of ['ning','keke']) state=reduce(state,{type:'CREATE_ORDER',memberId,requestTopic,mode:'direct',topic:'修照片',offer:'Python',slot:'周六'});
  state=reduce(state,{type:'ACCEPT_ORDER',id:state.orders[0].id});
  assert.throws(()=>reduce(state,{type:'ACCEPT_ORDER',id:state.orders[1].id}),/已有确认/);
});

test('when a partner has several posts, show the one that fits this Loop best',()=>{
  const request={id:'mine',memberId:'you',offer:'Python',want:'Photoshop'};
  const result=recommendLoops(request,[
    {id:'less-fit',memberId:'a',offer:'PS',want:'吉他'},
    {id:'better-fit',memberId:'a',offer:'PS 蒙版',want:'Python'}
  ],{a:{}});
  assert.equal(result.total,1);
  assert.equal(result.items[0].topic.id,'better-fit');
});

test('each published Loop has its own recommendations, Roll batch and confirmed partner', async () => {
  let state=reduce(createDemoState(),{type:'LOGIN',nickname:'小屿'});
  state=reduce(state,{type:'VERIFY'});
  for(const [want,domain] of [['Photoshop 蒙版','visual'],['录音与降噪','music']])
    state=reduce(state,{type:'POST_TOPIC',title:'想学'+want,body:'带自己的作品一起看。',offer:'Python',want,domain});
  const [audio,photo]=state.topics;
  const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'http://localhost/#exchange',pretendToBeVisual:true});
  const w=dom.window;w.scrollTo=()=>{};
  w.localStorage.setItem('skilloop.demo.v1',JSON.stringify(state));
  for(const key of ['document','window','location','localStorage','DOMParser','FormData']) globalThis[key]=key==='window'?w:w[key];
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:w.navigator});
  const errors=[];w.addEventListener('error',e=>errors.push(e.error));
  await import('../app.js');
  const tick=()=>new Promise(r=>w.setTimeout(r,25));
  const click=s=>{const e=w.document.querySelector(s);assert.ok(e,s);e.click();};
  assert.ok(w.document.querySelector('.my-loops'),'默认先显示我的发布');
  assert.equal(w.document.querySelectorAll('[data-action=select-loop]').length,2);
  click(`[data-action=select-loop][data-id="${photo.id}"]`);await tick();
  const ids=()=>[...w.document.querySelectorAll('.match-recommendation')].map(e=>e.dataset.topic);
  assert.equal(w.document.querySelector('.match-recommendations').dataset.forLoop,photo.id);
  assert.equal(ids().length,2,'一次只显示少量相关推荐');
  assert.ok(!ids().includes('photo-mask'),'已结伴的帖子不继续推荐');
  assert.equal(w.document.querySelectorAll('.community-toolbar').length,0,'默认不显示按时间排列的全量帖子');
  const first=ids();click('[data-action=roll-matches]');
  const rolled=ids();assert.notDeepEqual(rolled,first,'Roll 确实换一批');
  click(`[data-action=select-loop][data-id="${audio.id}"]`);await tick();
  assert.match(w.document.querySelector('.match-recommendations').textContent,/录音/);
  click(`[data-action=select-loop][data-id="${photo.id}"]`);await tick();
  assert.deepEqual(ids(),rolled,'切回一条 Loop 保留它自己的批次');
  const peer=w.document.querySelector('.match-recommendation [data-action=chat]').dataset.id;
  click('.match-recommendation [data-action=chat]');
  w.document.querySelector('#chat-text').value='我想修好照片边缘，可以教你 Python。';
  w.document.querySelector('#chat-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  click('#chat-confirm');
  assert.equal(w.document.querySelector('#invite-offer').value,photo.offer,'沿用当前 Loop 的交换技能');
  click('#invite-submit');await tick();
  let stored=JSON.parse(w.localStorage.getItem('skilloop.demo.v1'));
  assert.equal(stored.orders[0].requestTopic,photo.id,'约定关联发起者当前选中的 Loop');
  assert.equal(stored.orders[0].memberId,peer);
  click('[data-action=peer-accept]');
  w.location.hash='exchange?loop='+photo.id;await tick();
  assert.ok(w.document.querySelector('.my-loop-progress.is-paired'),'已结伴展示大色块进度卡');
  assert.equal(w.document.querySelectorAll('.match-recommendation').length,0,'已结伴停止推荐');
  assert.match(w.document.querySelector('.my-loop-progress').textContent,/查看互助/);
  w.location.hash='exchange?view=all';await tick();
  assert.ok(w.document.querySelector('.loop-topic.is-paired'));
  assert.ok(w.document.querySelector('.loop-topic.is-open'));
  assert.deepEqual(errors,[]);
  dom.window.close();
});
