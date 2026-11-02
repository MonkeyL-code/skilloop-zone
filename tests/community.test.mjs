import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoState, reduce } from '../src/state.js';

test('signed in members can reply locally without changing points or contribution counts',()=>{
  let state=reduce(createDemoState(),{type:'LOGIN',nickname:'小屿'});
  assert.throws(()=>reduce(state,{type:'REPLY_TOPIC',id:'photo-mask',body:'   '}),/回复/);
  state=reduce(state,{type:'REPLY_TOPIC',id:'photo-mask',body:'可以试试先加蒙版，原图别删。'});
  assert.equal(state.replies['photo-mask'][0].body,'可以试试先加蒙版，原图别删。');
  assert.equal(state.users.you.balance,0);
  assert.equal(state.users.you.completed,0);
});

test('publishing an exchange topic needs verification and preserves both sides of the exchange',()=>{
  let state=reduce(createDemoState(),{type:'LOGIN',nickname:'小屿'});
  const post={type:'POST_TOPIC',domain:'visual',title:'想学修自己的旅行照片',body:'背景有些乱，想保留人物。',offer:'Python 条件判断',want:'Photoshop 蒙版'};
  assert.throws(()=>reduce(state,post),/实名/);
  state=reduce(state,{type:'VERIFY'});
  state=reduce(state,post);
  assert.equal(state.topics[0].offer,post.offer);
  assert.equal(state.topics[0].want,post.want);
  assert.equal(state.users.you.balance,2,'发帖不奖励积分');
});

test('a teaching availability setting is shared with the profile and cannot be set using text truthiness',()=>{
  let state=reduce(createDemoState(),{type:'LOGIN',nickname:'小屿'});
  state=reduce(state,{type:'PROFILE',offer:'Photoshop',acceptingHelp:false});
  assert.equal(state.users.you.acceptingHelp,false);
  assert.equal(state.users.you.offer,'Photoshop');
  assert.throws(()=>reduce(state,{type:'PROFILE',acceptingHelp:'false'}),/状态/);
});
