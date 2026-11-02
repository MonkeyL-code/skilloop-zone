import test from 'node:test';
import assert from 'node:assert/strict';
import { transitionContent } from '../src/content.js';

const draft = { id: 'a', slug: 'own-light', channel: '前沿资讯', category: '视觉与影像', title: '旅行的光', body: '<p>中文正文</p>', enTitle: 'Your light', enBody: '<p>English body</p>', state: 'draft', publishedSnapshot: null };

test('draft changes stay separate from the published snapshot until explicit publication', () => {
  let rows = transitionContent([draft], { type: 'publish', id: 'a' });
  assert.equal(rows[0].publishedSnapshot.title, '旅行的光');
  rows = transitionContent(rows, { type: 'save', post: { ...rows[0], title: '未发布的新标题' } });
  assert.equal(rows[0].title, '未发布的新标题');
  assert.equal(rows[0].publishedSnapshot.title, '旅行的光');
  rows = transitionContent(rows, { type: 'publish', id: 'a' });
  assert.equal(rows[0].publishedSnapshot.title, '未发布的新标题');
});

test('withdrawing hides the publication without deleting its history', () => {
  let rows = transitionContent([draft], { type: 'publish', id: 'a' });
  rows = transitionContent(rows, { type: 'withdraw', id: 'a', reason: '需要更新' });
  assert.equal(rows[0].state, 'draft');
  assert.equal(rows[0].publishedSnapshot, null);
  assert.equal(rows[0].history.length, 2);
});

test('duplicate slugs and incomplete bilingual drafts cannot publish', () => {
  assert.throws(() => transitionContent([{ ...draft, enBody: '' }], { type: 'publish', id: 'a' }), /英文/);
  assert.throws(() => transitionContent([draft, { ...draft, id: 'b', state: 'published', publishedSnapshot: draft }], { type: 'publish', id: 'a' }), /路径/);
});
