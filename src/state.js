import { members, activities, domains } from './data.js?v=20261109-loop-matches';
import { communityTopics } from './community-data.js?v=20261109-loop-matches';

export function createDemoState() {
  return {
    version: 1, session: false,
    users: {
      you: { id: 'you', name: '小屿', initial: '屿', balance: 0, reserved: 0, verified: false, welcomed: false, completed: 0, offer: 'Python', offerLevel: 'P2', want: 'Photoshop', wantLevel: 'S2', bio: '想把自己的旅行照片修得更好一点。', slot: '周六 15:00', evidence: '自述', acceptingHelp: true, works: [] },
      ...Object.fromEntries(members.map(m => [m.id, { ...m, reserved: 0, verified: true }]))
    },
    orders: [], ledger: [], bookmarks: [], follows: [], reports: [], topics: [], replies: {},
    activities: Object.fromEntries(activities.map(a => [a.id, { cap: a.cap, participants: [...a.participants] }]))
  };
}

const need = (condition, message) => { if (!condition) throw new Error(message); };
const requiredText = (value, label, max = 500) => {
  const text = String(value ?? '').trim();
  need(text.length > 0 && text.length <= max, `请填写${label}，最多 ${max} 字。`);
  return text;
};

export function reduce(previous, action) {
  const state = structuredClone(previous), you = state.users.you;
  const stamp = new Date().toISOString();
  const auth = () => need(state.session, '请先登录体验账号。');
  const verified = () => { auth(); need(you.verified, '请先完成实名状态体验。'); };
  const entry = (kind, amount, title, orderId = '') => state.ledger.unshift({ id: `${kind}-${orderId || state.ledger.length}`, kind, amount, title, orderId, at: stamp });
  const order = () => { const o = state.orders.find(o => o.id === action.id); need(o, '未找到这份互助约定。'); return o; };
  switch (action.type) {
    case 'LOGIN':
      you.name = requiredText(action.nickname || you.name, '昵称', 20); you.initial = [...you.name][0]; state.session = true; break;
    case 'LOGOUT': state.session = false; break;
    case 'VERIFY':
      auth(); you.verified = true;
      if (!you.welcomed) { you.balance += 2; you.welcomed = true; entry('welcome', 2, '首次实名体验'); }
      break;
    case 'PROFILE':
      auth();
      for (const key of ['name', 'offer', 'want', 'slot']) if (action[key] !== undefined) you[key] = requiredText(action[key], key === 'name' ? '昵称' : '技能与时间', key === 'name' ? 20 : 100);
      for (const key of ['offerLevel', 'wantLevel', 'offerTitle', 'bio', 'evidence']) if (action[key] !== undefined) you[key] = String(action[key]).trim().slice(0, 180);
      if (action.acceptingHelp !== undefined) { need(typeof action.acceptingHelp === 'boolean', '互助状态无效。'); you.acceptingHelp = action.acceptingHelp; }
      you.initial = [...you.name][0]; break;
    case 'BOOKMARK':
      state.bookmarks = state.bookmarks.includes(action.id) ? state.bookmarks.filter(id => id !== action.id) : [...state.bookmarks, action.id]; break;
    case 'FOLLOW':
      state.follows = state.follows.includes(action.id) ? state.follows.filter(id => id !== action.id) : [...state.follows, action.id]; break;
    case 'CREATE_ORDER': {
      verified();
      const peer = state.users[action.memberId]; need(peer && peer.id !== 'you', '请选择有效的互助伙伴。');
      need(['direct', 'credits'].includes(action.mode), '请选择互助方式。');
      const cost = action.mode === 'direct' ? 0 : Number(action.cost ?? 1);
      need(Number.isSafeInteger(cost) && cost >= (action.mode === 'direct' ? 0 : 1) && cost <= 100, '请填写 1—100 之间的整数积分。');
      const direction = action.direction === 'help' ? 'help' : 'learn';
      const topic = requiredText(action.topic, '互助内容', 180), slot = requiredText(action.slot, '预约时间', 100);
      const offer = action.mode === 'direct' ? requiredText(action.offer, '我能教的内容', 180) : '';
      const payerId = direction === 'learn' ? 'you' : peer.id, helperId = direction === 'learn' ? peer.id : 'you';
      if (cost) need(state.users[payerId].balance - state.users[payerId].reserved >= cost, '可用积分不足，可以选择直接互换或先帮助别人。');
      const requestTopic=String(action.requestTopic||'').slice(0,100);
      if(requestTopic) {
        const request=state.topics?.find(t=>t.id===requestTopic&&t.memberId==='you');
        need(request,'未找到你的这条 Loop。');
        need(!state.orders.some(o=>o.requestTopic===requestTopic&&['accepted','working','completed'].includes(o.status)),'这条 Loop 已有确认的伙伴。');
      }
      state.orders.unshift({ id: `swap-${Date.now().toString(36)}-${state.orders.length + 1}`, memberId: peer.id, mode: action.mode, direction, topic, offer, slot, cost, payerId, helperId, status: 'invited', work: { you: '', partner: '' }, confirmed: { you: false, partner: false }, createdAt: stamp, sourceArticle: action.sourceArticle || '', sourceTopic: String(action.sourceTopic || '').slice(0,100),requestTopic });
      break;
    }
    case 'ACCEPT_ORDER': {
      verified(); const o = order(); if (o.status === 'accepted') break;
      need(o.status === 'invited', '这份约定当前无法接受。');
      need(!o.requestTopic||!state.orders.some(other=>other.id!==o.id&&other.requestTopic===o.requestTopic&&['accepted','working','completed'].includes(other.status)),'这条 Loop 已有确认的伙伴。');
      const payer = state.users[o.payerId];
      need(payer.balance - payer.reserved >= o.cost, '可用积分不足，请先释放其他预约。');
      payer.reserved += o.cost; o.status = 'accepted'; break;
    }
    case 'SUBMIT_WORK': {
      verified(); const o = order(); need(['accepted', 'working'].includes(o.status), '请先等待伙伴接受约定。');
      need(['you', 'partner'].includes(action.actor), '无效的提交者。');
      o.work[action.actor] = requiredText(action.work, '作品或成果说明', 1000); o.status = 'working';
      o.confirmed.you = false; o.confirmed.partner = false; break;
    }
    case 'CONFIRM_ORDER': {
      verified(); const o = order(); if (o.status === 'completed') break;
      need(['accepted', 'working'].includes(o.status), '这份约定当前无法确认。');
      need(['you', 'partner'].includes(action.actor), '无效的确认者。');
      const receiver = o.direction === 'learn' ? 'you' : 'partner';
      need(o.mode === 'direct' ? o.work.you && o.work.partner : o.work[receiver], '请先补充约定的作品或成果。');
      o.confirmed[action.actor] = true;
      if (o.confirmed.you && o.confirmed.partner) {
        const payer = state.users[o.payerId], helper = state.users[o.helperId];
        need(payer.reserved >= o.cost && payer.balance >= o.cost, '预约积分状态异常，请保留约定并联系处理。');
        payer.reserved -= o.cost; payer.balance -= o.cost; helper.balance += o.cost;
        if (o.mode === 'direct') { you.completed++; state.users[o.memberId].completed++; }
        else helper.completed++;
        o.status = 'completed'; o.completedAt = stamp;
        entry('exchange', o.mode === 'direct' ? 0 : o.helperId === 'you' ? o.cost : -o.cost, o.mode === 'direct' ? '完成直接互换' : o.helperId === 'you' ? '提供互助' : '获得互助', o.id);
      }
      break;
    }
    case 'CANCEL_ORDER': {
      verified(); const o = order(); need(['invited', 'accepted', 'working'].includes(o.status), '这份约定当前无法取消。');
      if (o.work.you || o.work.partner) o.status = 'review';
      else { if (o.status !== 'invited') state.users[o.payerId].reserved -= o.cost; o.status = 'cancelled'; }
      break;
    }
    case 'JOIN_ACTIVITY': {
      verified(); const a = state.activities[action.id]; need(a, '活动不存在。');
      if (a.participants.includes('you')) break;
      need(a.participants.length < a.cap, '活动已满，可以看看其他同好活动。'); a.participants.push('you'); break;
    }
    case 'LEAVE_ACTIVITY':
      auth(); if (state.activities[action.id]) state.activities[action.id].participants = state.activities[action.id].participants.filter(id => id !== 'you'); break;
    case 'REPORT':
      auth(); state.reports.push({ target: requiredText(action.target, '对象'), reason: requiredText(action.reason, '举报原因'), at: stamp }); break;
    case 'REPLY_TOPIC': {
      auth();
      need([...communityTopics, ...(state.topics || [])].some(t => t.id === action.id), '主题不存在。');
      const body = requiredText(action.body, '回复', 2000);
      state.replies ||= {}; state.replies[action.id] ||= [];
      state.replies[action.id].push({ authorId:'you', body, at:stamp });
      break;
    }
    case 'POST_TOPIC': {
      verified(); need(domains.some(d => d.id === action.domain), '请选择领域。');
      const title = requiredText(action.title, '标题', 100), body = requiredText(action.body, '具体需求', 2000);
      const offer = requiredText(action.offer, '我能教的', 100), want = requiredText(action.want, '我想学的', 100);
      state.topics ||= [];
      state.topics.unshift({ id:`topic-${Date.now().toString(36)}-${state.topics.length}`, memberId:'you', domain:action.domain, title, body, offer, want, kind:'exchange', time:you.slot, label:'可互换', replies:[], at:stamp });
      break;
    }
    default: throw new Error('暂不支持这项操作。');
  }
  return state;
}
