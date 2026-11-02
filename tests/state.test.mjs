import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoState, reduce } from '../src/state.js';

const act = (state, type, payload = {}) => reduce(state, { type, ...payload });
function verified() {
  const logged = act(createDemoState(), 'LOGIN', { nickname: '小屿' });
  const state = act(logged, 'VERIFY');
  assert.equal(state.users.you.balance, 2, '实名体验赠予两积分');
  return state;
}
function proposed(state, mode = 'credits', direction = 'learn') {
  const result = act(state, 'CREATE_ORDER', { memberId: 'axia', mode, direction, topic: '给自己的照片换背景', cost: 1, slot: '周六 15:00', offer: 'Python 条件判断' });
  assert.equal(result.orders.length, state.orders.length + 1, '应创建互助约定');
  return result;
}

test('verification grants the initial allowance once across logouts', () => {
  let state = verified();
  state = act(state, 'LOGOUT');
  state = act(state, 'LOGIN', { nickname: '再次体验' });
  state = act(state, 'VERIFY');
  assert.equal(state.users.you.balance, 2);
  assert.equal(state.ledger.filter(item => item.kind === 'welcome').length, 1);
});

test('visitors and unverified accounts can read but cannot create orders', () => {
  assert.throws(() => proposed(createDemoState()), /登录/);
  const state = act(createDemoState(), 'LOGIN', { nickname: '小屿' });
  assert.throws(() => proposed(state), /实名/);
});

test('acceptance reserves points and cancellation returns the reservation', () => {
  let state = proposed(verified());
  const id = state.orders[0].id;
  state = act(state, 'ACCEPT_ORDER', { id });
  assert.equal(state.users.you.reserved, 1);
  assert.equal(state.users.you.balance, 2);
  state = act(state, 'CANCEL_ORDER', { id });
  assert.equal(state.users.you.reserved, 0);
  assert.equal(state.orders[0].status, 'cancelled');
});

test('completion requires both confirmations and transfers rather than mints points', () => {
  let state = proposed(verified());
  const id = state.orders[0].id;
  const total = Object.values(state.users).reduce((sum, u) => sum + u.balance, 0);
  state = act(state, 'ACCEPT_ORDER', { id });
  assert.throws(() => act(state, 'CONFIRM_ORDER', { id, actor: 'you' }), /作品|成果/);
  state = act(state, 'SUBMIT_WORK', { id, actor: 'you', work: '旅行照片.png：保留原图并使用蒙版' });
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'you' });
  assert.notEqual(state.orders[0].status, 'completed');
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'partner' });
  assert.equal(state.orders[0].status, 'completed');
  assert.equal(state.users.you.balance, 1);
  assert.equal(state.users.you.reserved, 0);
  assert.equal(Object.values(state.users).reduce((sum, u) => sum + u.balance, 0), total);
  const again = act(state, 'CONFIRM_ORDER', { id, actor: 'partner' });
  assert.deepEqual(again, state, '重复确认不重复结算');
});

test('multiple outstanding orders cannot overbook a points balance', () => {
  let state = verified();
  for (let i = 0; i < 3; i++) state = proposed(state);
  for (const o of state.orders.slice(0, 2)) state = act(state, 'ACCEPT_ORDER', { id: o.id });
  assert.throws(() => act(state, 'ACCEPT_ORDER', { id: state.orders[2].id }), /积分不足/);
});

test('direct exchanges work without points and count one contribution per person', () => {
  let state = verified();
  state.users.you.balance = 0;
  state = proposed(state, 'direct');
  const id = state.orders[0].id;
  state = act(state, 'ACCEPT_ORDER', { id });
  state = act(state, 'SUBMIT_WORK', { id, actor: 'you', work: '自己的修图作业' });
  state = act(state, 'SUBMIT_WORK', { id, actor: 'partner', work: '伙伴的 Python 作业' });
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'you' });
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'partner' });
  assert.equal(state.users.you.balance, 0);
  assert.equal(state.users.you.completed, 1);
  assert.equal(state.orders[0].status, 'completed');
});

test('a partially delivered exchange enters review when cancelled', () => {
  let state = proposed(verified(), 'direct');
  const id = state.orders[0].id;
  state = act(state, 'ACCEPT_ORDER', { id });
  state = act(state, 'SUBMIT_WORK', { id, actor: 'you', work: '已经完成的照片' });
  state = act(state, 'CANCEL_ORDER', { id });
  assert.equal(state.orders[0].status, 'review');
  assert.equal(state.orders[0].work.you, '已经完成的照片');
});

test('helping a member earns their points and adds only one contribution', () => {
  let state = proposed(verified(), 'credits', 'help');
  const id = state.orders[0].id;
  state = act(state, 'ACCEPT_ORDER', { id });
  state = act(state, 'SUBMIT_WORK', { id, actor: 'partner', work: '伙伴完成了条件判断脚本' });
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'you' });
  state = act(state, 'CONFIRM_ORDER', { id, actor: 'partner' });
  assert.equal(state.users.you.balance, 3);
  assert.equal(state.users.you.completed, 1);
});

test('bookmarks and activity attendance do not create points', () => {
  let state = verified();
  state = act(state, 'BOOKMARK', { id: 'seedance' });
  state = act(state, 'JOIN_ACTIVITY', { id: 'photo-walk' });
  state = act(state, 'JOIN_ACTIVITY', { id: 'photo-walk' });
  assert.equal(state.users.you.balance, 2);
  assert.equal(state.activities['photo-walk'].participants.filter(id => id === 'you').length, 1);
});
