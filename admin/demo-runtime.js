import { articles, domains } from '../src/data.js';
import { CONTENT_KEY, transitionContent, refreshEditorialSeeds } from '../src/content.js';

const copy = value => structuredClone(value);
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const source = root => new URL('../' + root, location.href).href;
const initial = articles.map((a, index) => {
  const at = new Date(a.date + 'T08:00:00+08:00').toISOString();
  const post = { id: 'article-' + a.id, postNumber: index + 1, title: a.title, body: a.body, enTitle: a.enTitle, enBody: a.enBody, enSummary: a.enSummary, bodyFormat: 'html', summary: a.subtitle, channel: '前沿资讯', category: domains.find(d => d.id === a.domain).name, type: 'article', mediaKind: a.type, origin: 'derived', byline: a.author, publisher: a.author, slug: a.slug, cover: source(a.cover), videoUrl: '', sourceUrl: a.sourceUrl || '', tags: a.related.join(','), featured: index === 0, state: 'published', draftState: '未发布', createdAt: at, firstCreatedAt: at, enteredAt: at, publishedAt: at, materialIds: ['material-' + a.id], sourceAgentId: 'original-' + a.id, history: [], likes: null, shares: null, saves: null, comments: null, basisState: 'none', reviewStatus: 'draft' };
  post.publishedSnapshot = copy(post); return post;
});
let records;
try { const saved = JSON.parse(localStorage.getItem(CONTENT_KEY)); records = Array.isArray(saved) ? refreshEditorialSeeds(saved, articles.map(a=>({...a,cover:source(a.cover)}))) : initial; } catch { records = initial; }
function persist(next) { localStorage.setItem(CONTENT_KEY, JSON.stringify(next)); records = next; }
if (!localStorage.getItem(CONTENT_KEY)) persist(records);
const catalog = [{ id: 'owner', name: '提供的素材', sources: [{ id: 'supplied', name: '用户提供', url: '#', kind: 'local' }] }, { id: 'editorial', name: '编辑整理', sources: [{ id: 'editorial', name: '社区编辑部', url: '#', kind: 'local' }] }];
window.SOURCE_CATALOG = { groups: catalog };
const materials = articles.map((a, index) => ({ id: 'material-' + a.id, title: a.title, summary: a.subtitle, body: a.body, bodyFormat: 'html', sourceId: 'editorial', source: a.author, type: a.type === 'video' ? 'video' : 'article', collectedAt: a.date + 'T08:00:00+08:00', url: a.sourceUrl || '', videoUrl: '', score1: null, score2: null, isNew: false, category: domains.find(d => d.id === a.domain).name }));
const agents = articles.map(a => ({ id: 'original-' + a.id, title: a.title, summary: a.subtitle, body: a.body, enTitle: a.enTitle, enBody: a.enBody, bodyFormat: 'html', category: domains.find(d => d.id === a.domain).name, generatedAt: a.date + 'T08:00:00+08:00', materialIds: ['material-' + a.id], isNew: false }));
window.AdminRuntime = {
  initialData: { materials, agents, posts: copy(records) }, canCreate: true, canDelete: true,
  has(post) { return records.some(r => r.id === post.id && JSON.stringify(r.body) === JSON.stringify(post.body) && r.title === post.title && r.enTitle === post.enTitle && r.enBody === post.enBody); },
  async save(post) { persist(transitionContent(records, { type: 'save', post })); return copy(records.find(r => r.id === post.id)); },
  async loadPosts() { return copy(records); }, clear() {},
  removeDraft(id) { persist(transitionContent(records, { type: 'delete', id })); },
  createDraft(original, channel = '前沿资讯') {
    const at = now(), number = Number(localStorage.getItem('skilloop.content.number') || Math.max(5, ...records.map(r => r.postNumber || 0))) + 1;
    localStorage.setItem('skilloop.content.number', String(number));
    const p = { id: uuid(), postNumber: number, title: original?.title || '', enTitle: original?.enTitle || '', enBody: original?.enBody || '', body: original?.body || '', bodyFormat: 'html', summary: original?.summary || '', channel, category: original?.category || domains[0].name, type: 'article', origin: original ? 'derived' : 'original', byline: 'Skilloop 编辑部', publisher: '社区编辑', slug: 'story-' + number, cover: '', videoUrl: '', sourceUrl: '', tags: '', featured: false, state: 'draft', draftState: '未发布', createdAt: at, firstCreatedAt: at, enteredAt: at, materialIds: original?.materialIds || (original ? [original.id] : []), sourceAgentId: original?.materialIds ? original.id : null, sourceMaterial: original && !original.materialIds ? original.id : null, history: [], basisState: 'none', reviewStatus: 'draft', publishedSnapshot: null };
    persist(transitionContent(records, { type: 'save', post: p })); return copy(p);
  }
};
window.RoutingBriefAPI = {
  async publish(post) {
    const existing = records.find(r => r.id === post.id);
    if (!existing || existing.title !== post.title || existing.body !== post.body || existing.enTitle !== post.enTitle || existing.enBody !== post.enBody) throw new Error('请先保存当前稿件。');
    persist(transitionContent(records, { type: 'publish', id: post.id }));
    return { id: uuid(), createdAt: records.find(r => r.id === post.id).publishedAt, version: (post.history?.length || 0) + 1 };
  },
  async withdraw(post, reason) { persist(transitionContent(records, { type: 'withdraw', id: post.id, reason })); },
  async listRules() { return { items: [] }; }
};
for (const name of ['icons.js', 'rich-editor.js', 'autosave.js', 'content-safety.js', 'app.js', 'publication-checks.js', 'header-menu.js', 'demo-extras.js']) {
  await new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = name; s.onload = resolve; s.onerror = reject; document.body.append(s); });
}
