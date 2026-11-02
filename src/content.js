export const CONTENT_KEY = 'skilloop.content.v1';

export function transitionContent(records, action) {
  const rows = structuredClone(records), at = new Date().toISOString();
  if (action.type === 'save') {
    const index = rows.findIndex(p => p.id === action.post.id);
    const old = rows[index];
    const next = { ...action.post, publishedSnapshot: old?.publishedSnapshot || null, history: old?.history || [], updatedAt: at };
    if (index < 0) rows.unshift(next); else rows[index] = next;
    return rows;
  }
  const post = rows.find(p => p.id === action.id);
  if (!post) throw new Error('稿件不存在。');
  post.history ||= [];
  if (action.type === 'publish') {
    if (!post.title?.trim() || !post.body?.trim()) throw new Error('请补齐中文标题与正文。');
    if (!post.enTitle?.trim() || !post.enBody?.replace(/<[^>]*>/g, '').trim()) throw new Error('请补齐英文标题与正文。');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) throw new Error('请填写有效发布路径。');
    if (rows.some(p => p.id !== post.id && p.publishedSnapshot?.slug === post.slug)) throw new Error('发布路径已被其他文章使用。');
    post.state = 'published'; post.publishedAt = at;
    const { publishedSnapshot, history, ...snapshot } = post;
    post.publishedSnapshot = structuredClone(snapshot);
    post.history.push({ action: 'publish', at });
  } else if (action.type === 'withdraw') {
    post.state = 'draft'; post.draftState = '被撤回'; post.enteredAt = at;
    post.publishedSnapshot = null; post.history.push({ action: 'withdraw', reason: action.reason || '', at });
  } else if (action.type === 'delete') {
    if (post.publishedSnapshot) throw new Error('请先下架文章。');
    return rows.filter(p => p.id !== action.id);
  } else throw new Error('不支持的内容操作。');
  return rows;
}
