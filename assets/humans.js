/* 虚拟数字人场景详情页：纯能力与场景介绍，不接入试用系统。 */
(function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const params = new URLSearchParams(location.search);
  const item = DIGITAL_HUMANS.find(h => h.id === params.get('id'));
  const host = document.querySelector('#human-main');
  if (!item) {
    document.title = '未找到虚拟数字人场景 · 龙江智域';
    host.innerHTML = '<section class="detail-heading"><div class="detail-heading-copy"><h1>没有找到这个虚拟数字人场景</h1><p class="detail-description">链接可能不完整，请返回首页重新选择场景。</p><a class="btn btn-red" href="index.html#humans">查看全部虚拟数字人</a></div></section>';
    return;
  }
  document.title = item.name + ' · 虚拟数字人场景 · 龙江智域';
  const others = DIGITAL_HUMANS.filter(h => h.id !== item.id);
  host.innerHTML = `
    <nav class="breadcrumbs" aria-label="当前位置"><a href="index.html">产品首页</a><span>/</span><a href="index.html#humans">虚拟数字人</a><span>/</span><span>${esc(item.name)}</span></nav>
    <section class="detail-heading">
      <div class="detail-heading-copy">
        <span class="domain">${esc(item.industry)}</span>
        <h1>${esc(item.name)}</h1>
        <p class="detail-tagline">${esc(item.tagline)}</p>
        <p class="detail-description">${esc(item.desc)}</p>
      </div>
      <aside class="detail-summary human-summary">
        <span>所属行业</span>
        <strong>${esc(item.industry)}</strong>
        <a class="btn btn-red" href="index.html#humans">查看其他场景</a>
      </aside>
    </section>
    <section class="detail-section" id="usage">
      <div class="detail-section-title"><h2>能帮你做什么</h2></div>
      <p class="detail-audience"><b>适合谁用</b>${esc(item.audience)}</p>
      <div class="capability-strip">${item.caps.slice(0,3).map((c,i)=>`<div><span>0${i+1}</span><h3>${esc(c)}</h3></div>`).join('')}</div>
      <div class="usage-layout">
        <div class="usage-steps">
          <div><span>你提供</span><p>${esc(item.inputs)}</p></div>
          <div><span>你得到</span><p>${esc(item.outputs)}</p></div>
        </div>
        <div class="detail-example"><b>一个使用场景</b><p>${esc(item.example)}</p></div>
      </div>
      <p class="detail-boundary">${esc(item.boundary)}</p>
    </section>
    <section class="detail-section" id="capabilities">
      <div class="detail-section-title"><h2>完整能力清单</h2><span>${item.caps.length} 项能力</span></div>
      <div class="cap-list">${item.caps.map(c=>`<span class="cap">${esc(c)}</span>`).join('')}</div>
    </section>
    <p class="related-footer">其他虚拟数字人场景：${others.map(h=>`<a href="humans.html?id=${h.id}">${esc(h.name)} →</a>`).join('')}</p>`;
})();
