/* 独立产品页：原生页面导航，无弹层，价格与当前产品关联。 */
(function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const params = new URLSearchParams(location.search);
  const isSet = params.has('set');
  const item = isSet ? findSet(params.get('set')) : findAgent(params.get('agent'));
  const host = document.querySelector('#detail-main');
  if (!item) {
    document.title = '未找到智能体 · 智域';
    host.innerHTML = '<section class="detail-heading"><h1>没有找到这个智能体</h1><p>链接可能不完整，请返回产品列表重新选择。</p><a class="btn btn-red" href="index.html#general">查看全部智能体</a></section>';
    return;
  }
  const planned = item.status === 'plan';
  const name = item.setName || item.name;
  const price = pricingFor(item);
  const members = isSet ? [] : membershipsOf(item.id).filter(m=>m.id!=='general');
  const children = isSet ? [...(item.agentRefs || []).map(findAgent).filter(Boolean), ...(item.agents || [])] : [];
  const money = n => '¥' + n.toLocaleString('zh-CN');
  const list = values => `<ul class="detail-list">${values.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`;
  const trial = trialUrlOf(item);
  const trialReady = !planned && /^https?:\/\//.test(trial) && !new URL(trial).hostname.endsWith('example.com');
  document.title = name + (SITE.showPricing ? ' · 用途、部署与价格 · 智域' : ' · 用途与部署 · 智域');
  function deployment() {
    if (planned) return `<section id="deployment" class="detail-section"><div class="detail-section-title"><h2>部署与价格</h2><span>尚未开放订购</span></div><div class="planned-note"><h3>方案规划中，暂不报价</h3><p>拟支持云端、私有化和智立方一体机。具体能力、适配范围与交付费用将在方案确认后公布。</p><a href="index.html#industry">先查看已上线的行业方案 →</a></div></section>`;
    if (!SITE.showPricing) return `<section id="deployment" class="detail-section"><div class="detail-section-title"><h2>部署方式</h2><span>产品展示阶段</span></div><p class="detail-muted">支持云端订阅、私有化部署与智立方一体机三种方式，当前页面为产品功能展示，具体价格与套餐范围暂未公开。</p></section>`;
    return `<section id="deployment" class="detail-section"><div class="detail-section-title"><h2>怎么部署，多少钱</h2><span>当前产品 · 建议方案价</span></div>
      <p class="detail-muted">以下三种方式任选一种。云端费用按订阅收取，私有化与一体机按交付项目计价。</p>
      <div class="detail-plans">
        <article class="detail-plan recommended"><p class="plan-label">先用起来</p><h3>云端订阅</h3><p class="detail-price">${money(price.monthly)}<small>${isSet ? '/ 5 人团队 / 月' : '/ 人 / 月'}</small></p><p>免购硬件，适合${isSet ? '部门协作' : '个人或小团队'}。</p>
          ${list([isSet ? '包含本页列出的 '+children.length+' 个助手' : '包含 '+name+' 标准能力', '每月 '+price.quota+' 次标准任务额度'+(isSet?'，团队共享':''), '知识库空间 '+(isSet?'5GB':'1GB')+'，按权限访问', '基础使用支持与标准版本更新'])}
          <p class="plan-bottom">云端处理资料，敏感数据请先按单位要求评估。</p></article>
        <article class="detail-plan"><p class="plan-label">已有服务器</p><h3>私有化部署</h3><p class="detail-price">${money(price.privatePrice)}<small>/ 套起</small></p><p>在自有服务器或专属环境中运行。</p>
          ${list([isSet?'标准平台 + 本产品集的助手':'标准平台 + 当前智能体', '基础部署、使用培训', '首年基础维护', '不含服务器、复杂系统对接与数据整理'])}
          <p class="plan-bottom">已有智域平台可复用底座，新增助手按适配范围报价。</p></article>
        <article class="detail-plan"><p class="plan-label">需要本地算力</p><h3>智立方一体机</h3><p class="detail-price">¥39,800<small>/ 台起</small></p><p>硬件、软件与基础部署一起交付。</p>
          ${list(['Lite ¥39,800；Pro ¥59,800',isSet?'包含标准平台与本产品集助手':'包含标准平台与当前智能体','本地模型与知识库','云端检索、语音、文件导出等按适配范围配置'])}
          <a class="plan-bottom" href="#hardware">查看两款配置与使用人数 ↓</a></article>
      </div>
      <details class="detail-disclosure"><summary>任务额度、额外费用与交付范围</summary><p>建议任务口径：一次提交、一次文本结果，单次输入不超过 8K tokens、总生成不超过 2K tokens（含思考）。多步工作流按实际模型调用计次；录音转写、图片、长文批处理、实时检索和第三方接口另行约定，不算无限量服务。</p><p>用完额度后暂停或另购用量包，需确认价格后再使用，不自动产生超额费用。以上额度、存储与服务是拟定套餐，尚非已开通服务或正式销售承诺。标准版不含定制开发，次年维护、税费、保修与软件授权范围以正式报价单为准。</p><p>私有化和一体机是两种可选交付方式，不应把两项价格相加。同一套平台/一台设备可承载多个已授权助手，硬件只购一次；新增助手的软件授权与集成按实际范围报价，算力由所有助手共同使用。</p></details>
      <details id="hardware" class="detail-disclosure"><summary>智立方 Lite / Pro：选哪一款？</summary><div class="hardware-grid">${BOX_MODELS.map(m=>`<article><h3>${esc(m.version)} · ¥${esc(m.price)}</h3><p><b>${esc(m.users)}</b><br>${esc(m.concurrent)}</p><p>${esc(m.specs.slice(0,2).join(' · '))}</p></article>`).join('')}</div><p>成员可以轮流使用，同时需要回答的人更多时需等待。单机 Qwen3.6-35B-A3B Q4，短文本输入约 2K tokens、上下文 ≤8K、总生成 ≤512 tokens（含思考）。以上人数是估算，不是硬件实测承诺，复杂任务需降低同时使用人数。</p><p>按峰值约 10% 成员同时提问，待测试探索上限为 Lite 40 人 / 同时 4 人、Pro 60 人 / 同时 6 人。实际最大容量需测试确认；内存能容纳模型不代表能流畅同时处理多人请求。各助手共享算力，这些人数不能按助手个数累加。</p></details>
      <details class="detail-disclosure"><summary>同类产品怎么收费？查看参考依据</summary><p>调研日期：2026-09-05。以下为官网公开信息；我们的建议价按当前助手的标准任务范围拟定，不是竞品报价或完全同等的服务。</p><div class="source-list">${price.sources.map(id=>{const s=PRICE_SOURCES[id];return `<article><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a><b>${esc(s.price)}</b><p>${esc(s.note)}</p></article>`;}).join('')}</div><p>${isSet?'行业组合 ¥199/5人/月为整组标准助手的拟定优惠方案。':'办公类 ¥19、研究分析类 ¥29、专业任务类 ¥39 / 人 / 月，按任务消耗与标准服务范围分档。'}同类产品中未找到与本产品完全相同的私有化或一体机公开报价；这两项沿用目标方案价，须核对硬件采购和实施成本后出具正式报价。</p></details>
    </section>`;
  }
  host.innerHTML = `
    <nav class="breadcrumbs" aria-label="当前位置"><a href="index.html">产品首页</a><span>/</span><a href="index.html#${isSet || members.length && !GENERAL_AGENTS.some(a=>a.id===item.id) ? 'industry' : 'general'}">${isSet?'行业方案':'智能体'}</a><span>/</span><span>${esc(item.name)}</span></nav>
    <section class="detail-heading"><div class="detail-heading-copy"><span class="badge ${item.status}">${esc(STATUS[item.status].label)}</span><h1>${esc(name)}</h1><p class="detail-tagline">${esc(item.tagline || (planned?'面向行业工作的智能助手方案（规划）':'按岗位组合助手，解决日常业务问题'))}</p><p class="detail-description">${esc(item.desc)}</p></div>
      <aside class="detail-summary"><span>${planned?'方案状态':SITE.showPricing?'云端订阅 · 建议价':'产品状态'}</span><strong>${planned?'规划中':SITE.showPricing?money(price.monthly):esc(STATUS[item.status].label)}${planned||!SITE.showPricing?'':`<small>${isSet?'/ 5人团队 / 月':'/ 人 / 月'}</small>`}</strong>${trialReady?`<a class="btn btn-red" href="${esc(trial)}" target="_blank" rel="noopener noreferrer">进入试用系统 ↗</a>`:planned?'':'<span class="trial-pending">线上试用入口待开放</span>'}<a class="btn btn-red" href="#deployment">${planned?'查看规划范围':SITE.showPricing?'查看部署与价格':'查看部署方式'}</a></aside>
    </section>
    <section class="detail-section" id="usage"><div class="detail-section-title"><h2>${planned?'计划如何帮助你':'能帮你做什么'}</h2></div><p class="detail-audience"><b>适合谁用</b>${esc(item.audience)}</p>
      ${!isSet?`<div class="capability-strip">${item.caps.map((c,i)=>`<div><span>0${i+1}</span><h3>${esc(c)}</h3></div>`).join('')}</div>`:''}
      <div class="usage-layout"><div class="usage-steps"><div><span>你提供</span><p>${esc(item.inputs)}</p></div><div><span>${planned?'预期结果':'你得到'}</span><p>${esc(item.outputs)}</p></div></div><div class="detail-example"><b>${isSet?'一个使用场景':'试着这样提问'}</b><p>${esc(item.example || item.scenario)}</p></div></div>
      ${item.boundary?`<p class="detail-boundary">${esc(item.boundary)}</p>`:''}
    </section>
    ${children.length?`<section class="detail-section"><div class="detail-section-title"><h2>选一个助手，开始具体工作</h2><span>${children.length} 个助手</span></div><div class="related-grid">${children.map(a=>`<a href="detail.html?agent=${a.id}"><h3>${esc(a.name)}</h3><p>${esc(a.tagline)}</p><span>${SITE.showPricing?`单独订阅 ¥${pricingFor(a).monthly}/人/月 · `:''}查看详情 →</span></a>`).join('')}</div></section>`:''}
    ${item.forms && item.forms.length?`<section class="detail-section" id="forms"><div class="detail-section-title"><h2>两种使用形态，按场景选择</h2><span>${item.forms.length} 种形态</span></div><p class="detail-muted">线下沟通用录音记录，远程协作用音视频会议，两种形态可单独选购。</p>
      <div class="detail-forms">${item.forms.map(f=>`<article class="detail-form"><div class="detail-form-top"><svg viewBox="0 0 24 24" aria-hidden="true">${f.icon}</svg><div><h3>${esc(f.name)}</h3><p class="tagline">${esc(f.tagline)}</p></div></div>
        <p class="desc">${esc(f.desc)}</p>
        <ol class="detail-list">${f.steps.map(s=>`<li><b>${esc(s[0])}</b>：${esc(s[1])}</li>`).join('')}</ol>
        <p class="detail-example"><b>一个使用场景</b>${esc(f.example)}</p>
        ${SITE.showPricing?`<p class="plan-label">${esc(f.priceCaption)}</p><p class="detail-price">¥${f.price}<small>${esc(f.unit)}</small></p><p class="detail-muted">${esc(f.scope)}</p>`:''}
        <p class="detail-boundary">${esc(f.boundary)}</p>
        ${SITE.showPricing&&f.priceNote?`<details class="detail-disclosure"><summary>定价参考</summary><p>${esc(f.priceNote)}</p>${f.priceNoteUrl?`<p><a href="${esc(f.priceNoteUrl)}" target="_blank" rel="noopener noreferrer">查看官方定价参考 ↗</a></p>`:''}</details>`:''}
      </article>`).join('')}</div>
    </section>`:''}
    ${planned?`<section class="detail-section"><h2>拟建设的能力</h2>${list(item.roadmap || [])}<p class="detail-muted">能力与部署适配尚待确认，规划方向不代表现成在售功能。</p></section>`:''}
    ${deployment()}
    ${members.length?`<p class="related-footer">也在这些行业方案中：${members.map(m=>`<a href="detail.html?set=${m.id}">${esc(m.name)} →</a>`).join('')}</p>`:''}`;
  // 原生锚点默认保持收起状态，点击硬件链接时先展开，保证落点可读。
  host.addEventListener('click', e => {
    if (e.target.closest('a[href="#hardware"]')) document.getElementById('hardware').open = true;
  });
  if (location.hash === '#hardware') document.getElementById('hardware')?.setAttribute('open','');
})();
