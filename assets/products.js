(function () {
  'use strict';
  const product = MEETING_PRODUCTS.find(p=>p.id===new URLSearchParams(location.search).get('product'));
  const host = document.querySelector('#detail-main');
  if (!product) {
    host.innerHTML='<section class="detail-heading"><div><h1>没有找到这个产品</h1><p>请返回展示中心重新选择。</p><a class="btn btn-red" href="index.html#meeting-products">查看会议与记录产品</a></div></section>';
    return;
  }
  const p=product;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.title=p.name+' · 用途与价格 · 智域';
  host.innerHTML=`<nav class="breadcrumbs" aria-label="当前位置"><a href="index.html">产品首页</a><span>/</span><a href="index.html#meeting-products">会议与记录</a><span>/</span><span>${esc(p.name)}</span></nav>
    <section class="detail-heading"><div><span class="plan-label">${esc(p.type)}</span><h1>${esc(p.name)}</h1><p class="detail-tagline">${esc(p.tagline)}</p><p class="detail-description">${esc(p.desc)}</p></div><aside class="detail-summary"><span>${esc(p.priceCaption)}</span><strong>¥${p.price}<small>${esc(p.unit)}</small></strong><a class="btn btn-red" href="#deployment">查看价格与包含范围</a></aside></section>
    <section class="detail-section" id="usage"><div class="detail-section-title"><h2>怎么帮你把工作做好</h2></div><p class="detail-audience"><b>适合谁用</b>${esc(p.audience)}</p><div class="capability-strip">${p.steps.map((s,i)=>`<div><span>0${i+1}</span><h3>${esc(s[0])}</h3><p class="detail-muted">${esc(s[1])}</p></div>`).join('')}</div><div class="detail-example"><b>一个工作场景</b><p>${esc(p.example)}</p></div></section>
    <section class="detail-section" id="deployment"><div class="detail-section-title"><h2>怎么使用，多少钱</h2><span>${esc(p.priceCaption)}</span></div><div class="planned-note"><h3>${esc(p.deployment)}</h3><p class="detail-price">¥${p.price}<small>${esc(p.unit)}</small></p><p>${esc(p.scope)}</p></div><p class="detail-boundary">${esc(p.boundary)}</p>
    ${p.id==='jihuitong'?`<details class="detail-disclosure"><summary>定价参考：为什么建议从 ¥19 起？</summary><p>调研日期：2026-09-06。腾讯发布的中国区 App Store 页面列出：腾讯会议会员 1 个月 ¥30，专业版连续包月 ¥88。不同购买渠道与套餐权益可能不同。</p><p>极会通建议从基础会议协作切入，拟定 ¥19 / 主持人 / 月起，降低小团队的起步成本。这是产品定价建议，需结合带宽、音视频服务成本与会议额度核算，不代表与腾讯会议套餐同等权益。</p><p><a href="https://apps.apple.com/cn/app/id1484048379" target="_blank" rel="noopener noreferrer">查看腾讯会议官方 App Store 定价 ↗</a></p></details>`:''}</section>
    <section class="detail-section"><h2>按场景搭配使用</h2><p class="detail-muted">以下为工作方式建议，各产品独立选购，自动同步与系统集成需另行确认。</p><div class="related-grid" style="margin-top:18px">${MEETING_PRODUCTS.filter(other=>other.id!==p.id).map(other=>`<a href="products.html?product=${other.id}"><h3>${esc(other.name)}</h3><p>${esc(other.tagline)}</p><span>${esc(other.priceLabel)} · 查看详情 →</span></a>`).join('')}<a href="detail.html?agent=zhiban"><h3>智办 AI 助理</h3><p>把已经整理好的会议文字，进一步拆解成待办事项。</p><span>查看能力、部署与价格 →</span></a></div></section>`;
})();
