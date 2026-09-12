/* 客户经理工具包：原生页面渲染，复用 detail.css 排版。内部使用，不作为对外报价。
 * 入口仅在智能体详情页顶部导航（带 ?agent= 参数直达），无聚合列表页。 */
(function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = values => `<ul class="detail-list">${values.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`;
  const params = new URLSearchParams(location.search);
  const agentId = params.get('agent');
  const host = document.querySelector('#sales-main');

  // 无参数访问时回到产品首页，不提供聚合菜单
  if (!agentId) { location.replace('index.html'); return; }

  function objectionList(items) {
    return items.map(o => `<details class="detail-disclosure"><summary>${esc(o.q)}</summary><p>${esc(o.a)}</p></details>`).join('');
  }

  function competitorTable(rows) {
    return `<div class="sales-table-wrap"><table class="sales-table"><thead><tr><th>类别</th><th>代表产品</th><th>对方优势</th><th>本产品差异</th><th>销售策略</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${esc(r.category)}</td><td>${esc(r.name)}</td><td>${esc(r.strength)}</td><td>${esc(r.diff)}</td><td>${esc(r.strategy)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function roleTable(rows) {
    return `<div class="sales-table-wrap"><table class="sales-table"><thead><tr><th>角色</th><th>关心什么</th><th>切入方式</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${esc(r.role)}</td><td>${esc(r.concern)}</td><td>${esc(r.approach)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function pricingTable(kit) {
    return `<div class="sales-table-wrap"><table class="sales-table"><thead><tr><th>方案</th><th>适用范围</th><th>核心内容</th><th>建议标价</th></tr></thead><tbody>
      ${kit.pricing.tiers.map(t => `<tr><td>${esc(t.name)}</td><td>${esc(t.scope)}</td><td>${esc(t.includes)}${t.deploy?'<br><span class="sales-muted">'+esc(t.deploy)+'</span>':''}</td><td>${esc(t.price)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function demoList(demos) {
    return demos.map((d,i) => `<article class="detail-form"><div class="detail-form-top"><div><h3>Demo ${i+1}：${esc(d.title)}</h3></div></div>
      <p class="desc"><b>客户问题：</b>${esc(d.problem)}</p>
      <ol class="detail-list"><li><b>操作</b>：${esc(d.steps)}</li><li><b>输出</b>：${esc(d.output)}</li><li><b>价值</b>：${esc(d.value)}</li></ol>
    </article>`).join('');
  }

  function kitPage(id) {
    const kit = SALES_KITS[id];
    const agent = findAgent(id);
    if (!kit || !agent) {
      document.title = '未找到工具包 · 龙江智域';
      host.innerHTML = '<section class="detail-heading"><h1>没有找到这个智能体的工具包</h1><p>当前仅智创、智法、智数、智研四个智能体配备了完整销售资料，请从对应智能体详情页顶部导航进入。</p><a class="btn btn-red" href="index.html#general">返回产品首页</a></section>';
      return;
    }
    document.title = agent.name + ' · 客户经理工具包 · 龙江智域';
    host.innerHTML = `
      <nav class="breadcrumbs" aria-label="当前位置"><a href="index.html">产品首页</a><span>/</span><a href="index.html#general">通用智能体</a><span>/</span><a href="detail.html?agent=${id}">${esc(agent.name)}</a><span>/</span><span>客户经理工具包</span></nav>
      <section class="detail-heading"><div class="detail-heading-copy"><h1>${esc(agent.name)} · 客户经理工具包</h1><p class="detail-tagline">一句话定位</p><p class="detail-description">${esc(kit.positioning)}</p></div>
        <aside class="detail-summary"><span>产品详情</span><a class="btn btn-red" href="detail.html?agent=${id}">查看客户版详情页 →</a></aside>
      </section>

      <section class="detail-section" id="pitch"><div class="detail-section-title"><h2>卖给谁 · 30 秒话术</h2></div>
        <p class="detail-audience"><b>目标客户</b></p>${list(kit.buyers)}
        <div class="detail-example"><b>30 秒话术</b><p>${esc(kit.pitch)}</p></div>
      </section>

      <section class="detail-section" id="painpoints"><div class="detail-section-title"><h2>最常见的痛点</h2></div>${list(kit.painPoints)}</section>

      <section class="detail-section" id="sellingpoints"><div class="detail-section-title"><h2>最值得卖的能力</h2></div>${list(kit.sellingPoints)}</section>

      <section class="detail-section" id="scenarios"><div class="detail-section-title"><h2>优先成交场景</h2></div>${list(kit.scenarios)}
        <p class="detail-audience" style="margin-top:16px"><b>最容易成交的条件</b></p>${list(kit.bestFit)}
        <p class="detail-boundary"><b>下一步：</b>${esc(kit.nextStep)}</p>
      </section>

      <section class="detail-section" id="profile"><div class="detail-section-title"><h2>客户画像与需求访谈</h2></div>
        <p class="detail-audience"><b>理想客户画像</b>${esc(kit.profile.idealCustomer)}</p>
        ${roleTable(kit.profile.roles)}
        <p class="detail-audience" style="margin-top:16px"><b>商机信号</b></p>${list(kit.profile.signals)}
        <p class="detail-audience" style="margin-top:16px"><b>暂不优先客户</b></p>${list(kit.profile.notPriority)}
        <details class="detail-disclosure"><summary>需求诊断问题（可直接照问）</summary>${list(kit.profile.questions)}</details>
      </section>

      <section class="detail-section" id="demo"><div class="detail-section-title"><h2>销售话术与 Demo 脚本</h2></div>
        <div class="detail-example"><b>电梯话术</b><p>${esc(kit.demo.elevator)}</p></div>
        <p class="detail-audience" style="margin-top:16px"><b>演示节奏</b></p>${list(kit.demo.cadence)}
        <div class="detail-forms">${demoList(kit.demo.demos)}</div>
        <p class="detail-boundary"><b>收口话术：</b>${esc(kit.demo.closing)}</p>
      </section>

      <section class="detail-section" id="objections"><div class="detail-section-title"><h2>常见异议应对</h2></div>${objectionList(kit.objections)}</section>

      <section class="detail-section" id="competitors"><div class="detail-section-title"><h2>竞品定位（不攻击对手）</h2></div>${competitorTable(kit.competitors)}
        <p class="detail-audience" style="margin-top:16px"><b>销售红线</b></p>${list(kit.redLines)}
      </section>

      <section class="detail-section" id="pricing"><div class="detail-section-title"><h2>私有化项目报价参考</h2><span>内部参考 · 非对外报价</span></div>
        <p class="detail-muted">${esc(kit.pricing.note)}</p>
        ${pricingTable(kit)}
        <p class="detail-audience" style="margin-top:16px"><b>单独计价</b></p>${list(kit.pricing.addons)}
      </section>
    `;
  }

  kitPage(agentId);
})();
