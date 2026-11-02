'use strict';
function publicationFingerprint(p) { return JSON.stringify([p.title,p.body,p.enTitle,p.enBody,p.summary,p.cover,p.channel,p.category,p.type,p.videoUrl,p.featured,p.slug]); }
function publicationValidation(p) {
  if (!p.title.trim() || !new DOMParser().parseFromString(p.body,'text/html').body.textContent.trim()) return '请补齐中文标题与正文。';
  if (!p.enTitle?.trim() || !new DOMParser().parseFromString(p.enBody || '', 'text/html').body.textContent.trim()) return '请补齐英文标题与正文。';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug || '')) return '请填写有效的发布路径。';
  if (!categoriesFor(p.channel).includes(p.category)) return '请选择五个领域之一。';
  return '';
}
function basisLabel() { return '用户素材／编辑整理'; }
function viewBasis(p) {
  const m=modal({title:'素材来源',body:`<p class="confirm-copy">${p.sourceAgentId?'来自原稿 '+escapeHTML(p.sourceAgentId):p.sourceMaterial?'来自素材 '+escapeHTML(p.sourceMaterial):'人工创建'}。当前使用示例内容，媒体由用户提供。</p>`,actions:'<button class="button primary" data-close-basis>关闭</button>'});
  m.el.querySelector('[data-close-basis]').onclick=m.close;
}
async function checkRelease(p) {
  const error=publicationValidation(p),saved=AdminRuntime.has(p);
  const m=modal({title:'发布前检查',body:`<div class="check-row"><span>中英文内容与分类</span><span class="tag ${error?'red':'green'}">${error?'需补充':'完整'}</span></div>${error?`<p class="validation">${escapeHTML(error)}</p>`:''}<div class="check-row"><span>当前修改</span><span class="tag ${saved?'green':'amber'}">${saved?'已保存':'请先保存'}</span></div><p class="confirm-copy" style="margin-top:18px">发布后更新当前浏览器的前沿列表；其他访客看到的是网站部署时的内容。</p>`,actions:'<button class="button primary" data-close-check>关闭</button>'});
  m.el.querySelector('[data-close-check]').onclick=m.close;
  return {eligible:!error&&saved,fingerprint:publicationFingerprint(p)};
}
