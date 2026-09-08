(function () {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const requested = new URLSearchParams(location.search).get('line') || 'enterprise';
  const line = EMPLOYEE_LINES.find(l=>l.id===requested);
  const host = document.querySelector('#employee-main');
  if (!line) { document.title='未找到产品线 · 龙江智域'; host.innerHTML='<section class="detail-heading"><div><h1>没有找到这条产品线</h1><a class="btn btn-red" href="index.html#employees">返回数字员工总览</a></div></section>'; return; }
  const money = n => '¥' + n.toLocaleString('zh-CN');
  const list = xs => `<ul class="detail-list">${xs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  const isEnterprise = line.id==='enterprise';
  const trial = trialUrlOf(line);
  const trialReady = /^https?:\/\//.test(trial) && !new URL(trial).hostname.endsWith('example.com');
  document.title='数字员工（'+line.name+'）· 岗位与部署 · 龙江智域';
  const roleCard = (r,i)=>`<details class="employee-role"><summary><span class="role-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p></div><span class="role-expand" aria-hidden="true">＋</span></summary><div class="employee-role-body">${r.tasks?list(r.tasks):''}${r.inputs?`<p><b>需要提供</b>${esc(r.inputs)}</p>`:''}<p><b>交付结果</b>${esc(r.outputs)}</p></div></details>`;
  // 部署与价格区块：项目当前为产品展示，SITE.showPricing=false 时用中性说明替代完整报价内容；改回 true 即可恢复。
  const deploymentSection = !SITE.showPricing
    ? `<section id="deployment" class="detail-section"><div class="detail-section-title"><h2>部署方式</h2><span>产品展示阶段</span></div><p class="detail-muted">支持企业云端入门、本地标准部署与已有平台复用三种起步方式，当前页面为产品功能展示，具体价格与套餐范围暂未公开。</p></section>`
    : `<section id="deployment" class="detail-section"><div class="detail-section-title"><h2>按需要起步，按岗位扩展</h2><span>建议价 · 非正式报价</span></div><p class="detail-muted">${isEnterprise?'先选 3 个岗位与一条标准流程试点，效果确认后再扩展。':'优先明确数据范围与流程边界，按小范围本地方案起步。'}下列方案任选，不重复叠加平台费用。</p>
    <div class="detail-plans">
      <article class="detail-plan ${isEnterprise?'recommended':''}"><span class="plan-label">${isEnterprise?'小团队起步':'轻量试点'}</span><h3>${isEnterprise?'企业云端入门':'专属云方案'}</h3><p class="detail-price">${line.cloud?money(line.cloud):'按场景评估'}<small>${line.cloud?'/ 月 · 年度预算 ¥5,988':'确认数据与接入要求后报价'}</small></p><p>${esc(line.cloudScope)}</p>${list(isEnterprise?['3 个岗位配置，从 16 个岗位中选择','10 名使用成员，非 10 个同时执行任务','1 条标准流程模板，自助配置','每月 1,000 次模型调用、5GB 知识空间','不含定制连接器与人工实施']:['按资料范围选择云端处理边界','确认角色、知识与流程后开展试点','系统接口、模型用量与运维单列','不预设全量数据可上传公有云'])}<p class="plan-bottom">${isEnterprise?'新增岗位建议 ¥99/个/月，增加岗位配置，不增加成员与用量配额。':'云端形态需按单位要求确定，不默认与企业云端入门同价。'}</p></article>
      <article class="detail-plan ${!isEnterprise?'recommended':''}"><span class="plan-label">${isEnterprise?'自有算力':'建议起步'}</span><h3>${line.id==='industry'?'行业场景交付':'本地标准部署'}</h3><p class="detail-price">${money(line.privatePrice)}<small>${line.id==='industry'?'/ 场景起':'/ 套起'}</small></p><p>${esc(line.privateScope)}</p>${list(['标准软件授权与基础部署','已有标准能力与模板的配置','首年基础维护与使用培训','1 个已有标准接口的配置调试','不含硬件、定制开发和历史数据治理'])}<p class="plan-bottom">${line.id==='industry'?'一个场景的范围需先明确；不包含全部 7 个行业或 21 个岗位。':'3 个岗位由你选择；新增岗位或流程按适配范围评估。'}</p></article>
      <article class="detail-plan"><span class="plan-label">逐步扩展</span><h3>已有平台 / 一体机</h3><p class="detail-price">按差异报价<small>复用已有软件与算力</small></p><p>已有龙江智域平台或智立方，可先评估现有资源。</p>${list(['复用模型、知识库与已授权能力','数字员工新增岗位与流程单独评估','本地模型与云端工具可按需组合','新购硬件与实施分别列项'])}<p class="plan-bottom">智立方硬件及原标准软件方案参考 Lite ¥39,800 / Pro ¥59,800；数字员工适配另评估，不默认包含在原一体机价格中。</p></article>
    </div>
    <details class="detail-disclosure"><summary>起步价格包含什么？哪些需要另算？</summary><p>所有价格均为产品方案建议，未取得供应商正式报价或交付成本单。岗位数指配置的数字角色数，成员数指使用账号数，都不代表并发执行能力；岗位模板本身不等于已接通业务系统。</p><p>企业云端 ¥499/月是小范围标准能力、自助配置套餐；¥99/新增岗位/月仅增角色配置，不含新的定制流程。1,000 次为模型调用次数，多步任务会消耗多次调用；单次输入≤8K tokens、总生成≤2K tokens（含思考）。额度不足暂停或另购，先确认价格，不自动超额扣费。</p><p>本地起步方案中的“标准接口”指现成连接器及可直接使用、已获授权的接口，限一个系统的基本配置；新增 RPA 运行器、桌面端适配、复杂权限、审批流、语音、数字人形象与视频交互、第三方软件、联网检索、硬件、现场实施与数据治理另行评估。虚拟政务人岗位不默认包含实时数字人音视频服务。</p><p>软件授权、模型许可、可配置成员数、税费、保修、次年维护及验收要求须在正式报价单明确。已有平台按新增范围核价，不将整套平台价格简单相加。</p></details>
    <details class="detail-disclosure"><summary>一体机能带多少数字员工同时工作？</summary><p>岗位角色数量与算力无直接对应关系。同一台设备上的数字员工和智能体共享模型、内存和任务队列，多步流程会占用更多资源。</p><p>沿用此前短文本估算：Lite 可同时为约 1–2 人回答，Pro 约 2–4 人；条件为单机 Qwen3.6-35B-A3B Q4、输入约 2K tokens、上下文≤8K、总生成≤512 tokens。这不是数字员工多步流程的并发承诺。真实工作流需连同工具、RPA、检索和人工确认环节一起测试，超出容量的任务排队。</p></details>
    <details class="detail-disclosure"><summary>同类产品价格参考与建议价依据</summary><p>调研日期：2026-09-06。参考同类企业智能体与自动化平台的收费方式；其价格不等于本数字员工产品的交付价格。</p><div class="source-list"><article><a href="https://docs.coze.cn/coze_pro_enterprise_plan" target="_blank" rel="noopener noreferrer">扣子企业版官方计费 ↗</a><b>企业标准版最低 ¥980/月</b><p>套餐 ¥490/月，加至少5席位，每席位 ¥29 + ¥69积分费用；2026-07-14 起的现行规则。平台席位与岗位交付口径不同。</p></article><article><a href="https://www.feishu.cn/service/ai" target="_blank" rel="noopener noreferrer">飞书 AI 官方方案 ↗</a><b>基础版 ¥9,900/年</b><p>公开方案含18万点AI额度，不限席位；企业版 ¥9.9万/年。属于飞书AI能力套餐，不是单个数字员工价格。</p></article><article><a href="https://www.yingdao.com/" target="_blank" rel="noopener noreferrer">影刀 RPA 官方网站 ↗</a><b>企业版按需求咨询报价</b><p>企业自动化方案需结合规模、流程与部署需求核价；未找到可直接用于本项目的固定公开售价。</p></article></div><p>¥499/月定位为范围更小的3岗位标准试点，不能宣称与上述企业平台同等功能。¥19,800 / ¥29,800 / ¥39,800 的本地起步价分别对应企业、政府和单行业场景，是实施范围驱动的商业建议，并非网络查得的成交价。上线销售前需核验模型成本、实施工作量与售后成本。</p></details>
    </section>`;
  host.innerHTML=`
    <nav class="breadcrumbs" aria-label="当前位置"><a href="index.html">产品首页</a><span>/</span><a href="index.html#employees">数字员工</a><span>/</span><span>${esc(line.name)}</span></nav>
    <nav class="employee-tabs" aria-label="选择产品线">${EMPLOYEE_LINES.map(l=>`<a href="employees.html?line=${l.id}" ${l.id===line.id?'aria-current="page"':''}>${esc(l.name)}</a>`).join('')}</nav>
    <section class="detail-heading employee-heading"><div><p class="section-kicker">DIGITAL WORKFORCE / ${line.id.toUpperCase()}</p><h1>数字员工 · ${esc(line.name)}</h1><p class="detail-tagline">${esc(line.tagline)}</p><p class="detail-description">${esc(line.desc)}</p><p class="employee-count">${esc(line.count)} <span>产品方案 · 按需交付</span></p></div><aside class="detail-summary"><span>${SITE.showPricing?'建议起步方案':'产品状态'}</span><strong>${SITE.showPricing?`${money(line.price)}<small>${esc(line.unit)}</small>`:'已上线'}</strong>${trialReady?`<a class="btn btn-red" href="${esc(trial)}" target="_blank" rel="noopener noreferrer">进入试用系统 ↗</a>`:'<span class="trial-pending">线上试用入口待开放</span>'}<a class="btn btn-red" href="#deployment">${SITE.showPricing?'查看费用与包含内容':'查看部署方式'}</a><span>先选岗位，再确定流程与对接范围</span></aside></section>
    <section class="detail-section"><div class="detail-section-title"><h2>先让一件工作跑起来</h2></div><p class="detail-audience"><b>适合谁用</b>${esc(line.audience)}</p><ol class="employee-flow">${line.scenario.map((step,i)=>`<li><span>0${i+1}</span><p>${esc(step)}</p></li>`).join('')}</ol><p class="detail-muted">${esc(line.result)}以上为典型配置示例，实际执行需完成系统授权、流程调试与业务验收。</p></section>
    <section id="roles" class="detail-section"><div class="detail-section-title"><h2>${line.industries?'选择行业，再看岗位':'哪些岗位可以先用起来'}</h2><span>${esc(line.count)}</span></div><p class="detail-muted">岗位名称依据产品方案整理。点击展开查看工作内容与结果；岗位目录不表示入门套餐全部包含。</p>
    ${line.industries?`<nav class="industry-jumps" aria-label="快速选择行业">${line.industries.map((g,i)=>`<a href="#domain-${i}">${esc(g.name)}</a>`).join('')}</nav>${line.industries.map((g,i)=>`<section class="employee-domain" id="domain-${i}"><div><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p></div><div class="employee-role-grid">${g.roles.map(roleCard).join('')}</div></section>`).join('')}`:`<div class="employee-role-grid">${line.roles.map(roleCard).join('')}</div>`}
    <p class="detail-boundary">数字员工提供辅助材料与流程协作。对外发送、写入系统和业务办理按配置的授权与人工确认执行；医疗诊疗、行政审批、法律意见和投资决策仍由具备职责或资质的人员完成。</p></section>
    <section id="platform" class="detail-section"><div class="detail-section-title"><h2>一个岗位背后，是一套可配置的工作方式</h2></div><div class="employee-platform-intro"><p><b>先选能力，再配置岗位</b>现有智办、智研、智创、智知、智数等智能体可作为岗位能力；数字员工进一步结合知识、工具和流程，衔接任务。</p><a href="index.html#general">查看通用智能体 →</a></div>
    <ol class="employee-build">${['建立岗位身份','定义角色与指令','选择模型与参数','配置知识与工具','编排工作流程','测试、发布与运营'].map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('')}</ol>
    <details class="detail-disclosure"><summary>查看平台的五层能力</summary><div class="employee-architecture">${[
      ['05','场景应用','企业、政府与行业岗位模板，按业务需要组合。'],
      ['04','开发工具','低代码、自动配置与可视化编排，支持岗位创建、调试与运营。'],
      ['03','服务网关','模型路由、身份认证、权限控制、安全防护、请求编排与监控审计。'],
      ['02','资源层','技能库、API / MCP 工具连接、知识数据、提示模板与 RPA 流程库。'],
      ['01','模型层','通用、行业和多模态模型，训练微调、推理、向量检索、评测与算力调度。']
    ].map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b><p>${r[2]}</p></div>`).join('')}</div><p>能力结构来自提供的产品方案；具体模型、工具连接器、权限与审计配置以交付清单和环境适配结果为准。</p></details></section>
    ${deploymentSection}
    <section class="detail-section"><details class="detail-disclosure"><summary>查看原始产品体系图</summary><p>以下为提供的产品方案原图；页面中的岗位介绍依据原图整理补充。</p><a class="employee-source-image" href="assets/digital-employees/${line.image}" target="_blank" rel="noopener"><img src="assets/digital-employees/${line.image}" alt="数字员工${esc(line.name)}岗位体系原图" loading="lazy"></a><a class="employee-source-image" href="assets/digital-employees/architecture.png" target="_blank" rel="noopener"><img src="assets/digital-employees/architecture.png" alt="数字员工平台五层架构：模型、资源、网关、开发工具与场景应用" loading="lazy"></a></details></section>
    <p class="related-footer"><a href="index.html#employees">← 返回数字员工总览</a><a href="index.html#general">也可以从单个智能体开始 →</a></p>`;
})();
