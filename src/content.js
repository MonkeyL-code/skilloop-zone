export const CONTENT_KEY = 'skilloop.content.v1';

export function refreshEditorialSeeds(records, articles) {
  const legacy = new Set(['当想象，开始有了镜头语言','旅行结束后，留住自己的光','六根弦，也能撑起一个世界','换一种语言，讲自己的故事','让双手，做一点慢下来的事','Seedance 影像展示：镜头运动与画面连贯性','摄影作品观察：曝光、色彩与后期处理','吉他指弹：旋律、低音与节奏的配合','表达观察：如何组织一次简短的自我介绍','手作记录：从材料到成品的制作过程']);
  return records.map(record => {
    const current=articles.find(a=>record.id==='article-'+a.id&&record.slug===a.slug);
    if (!current||record.updatedAt||record.history?.length||record.body!==record.publishedSnapshot?.body||!legacy.has(record.title)||!legacy.has(record.publishedSnapshot?.title)) return record;
    const copy=structuredClone(record);
    const fields={title:current.title,summary:current.subtitle,body:current.body,enTitle:current.enTitle,enBody:current.enBody,enSummary:current.enSummary};
    if (current.cover) fields.cover=current.cover;
    if (current.author) fields.byline=current.author;
    if (current.type) { fields.type='article'; fields.mediaKind=current.type; }
    if (current.sourceUrl) fields.sourceUrl=current.sourceUrl;
    if (current.date) fields.publishedAt=current.date+'T00:00:00+08:00';
    Object.assign(copy,fields);Object.assign(copy.publishedSnapshot,fields);
    return copy;
  });
}

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
