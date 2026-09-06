/* =============================================================
 * 智域 · 智能体展示中心 —— 渲染与交互（纯前端，无依赖）
 * ============================================================= */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
  const ARROW_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
  const EXT_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3zm7 14h-2v3H5V6h3V4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/></svg>';

  const state = { industryFilter: "online" };

  /* ---------------- 顶部统计 ---------------- */
  function renderStats() {
    const items = [
      { n: EMPLOYEE_LINES.length, t: "数字员工产品线" },
      { n: STATS.general, t: "通用智能体" },
      { n: STATS.sets, t: "行业智能体分类" },
    ];
    $("#stats").innerHTML = items
      .map((i) => `<div class="stat"><b>${i.n}</b><span>${esc(i.t)}</span></div>`)
      .join("");
  }

  /* 语义化矩阵：品牌下分通用和行业两个产品分组，链接进入独立详情。 */
  function renderHeroVisual() {
    const uses = ["办公协同", "研究决策", "内容创作", "知识问答", "数据分析"];
    $("#hero-matrix").innerHTML = `
      <div class="matrix-root"><span class="matrix-logo">智</span><div><p>AI AGENT FAMILY</p><h2>${esc(SITE.brand)} <span>· 智系列</span></h2></div><span class="matrix-index">产品矩阵</span></div>
      <div class="matrix-branch" aria-hidden="true"></div>
      <section class="matrix-workforce"><div><h3>数字员工</h3><span>岗位能力 · 流程协同</span></div><div>${EMPLOYEE_LINES.map(l=>`<a href="employees.html?line=${l.id}">${esc(l.name)} ↗</a>`).join("")}</div></section>
      <section class="matrix-group"><div class="matrix-heading"><h3>通用智能体</h3><span>${STATS.general} 大核心能力</span></div>
        <div class="matrix-general">${ALL_GENERAL.map((a,i)=>`<a class="matrix-item" href="detail.html?agent=${a.id}"><svg viewBox="0 0 24 24" aria-hidden="true">${a.icon}</svg><b>${esc(a.short)}</b><span>${uses[i] || "通用能力"}</span></a>`).join("")}</div></section>
      <section class="matrix-group industry-matrix"><div class="matrix-heading"><h3>行业智能体</h3><span>智政、智企已上线 · 其余规划中</span></div>
        <div class="matrix-industries">${INDUSTRY_SETS.map(st=>`<a href="detail.html?set=${st.id}" class="matrix-item ${st.status === "plan" ? "is-planned" : "is-online"}"><b>${esc(st.name)}</b><span class="sr-only">${esc(st.domains[0])} · ${st.status === "plan" ? "规划中" : "已上线"}</span></a>`).join("")}</div></section>
      <section class="matrix-meetings"><h3>会议与记录</h3><div>${MEETING_PRODUCTS.map(p=>`<a href="products.html?product=${p.id}">${p.icon}<span><b>${esc(p.name)}</b><small>${esc(p.priceLabel)}</small></span><span aria-hidden="true">↗</span></a>`).join("")}</div></section>
      <div class="matrix-base">统一能力底座 <span>知识库 / 工作流 / 模型服务</span></div>`;
  }

  function renderEmployees() {
    document.querySelector('#employee-lines').innerHTML = EMPLOYEE_LINES.map((l,i)=>`<article class="employee-line-card">
      <div class="employee-line-title"><span class="employee-symbol" aria-hidden="true">${['企','政','业'][i]}</span><div><p>${esc(l.eyebrow)}</p><h3>数字员工 · ${esc(l.name)}</h3></div></div>
      <p class="employee-line-promise">${esc(l.tagline)}</p><p class="employee-line-desc">${esc(l.desc)}</p>
      <div class="employee-line-tags">${l.highlights.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      <p class="employee-line-count">${esc(l.count)} · 按需配置</p><div class="employee-line-price"><span>建议起步价</span><b>¥${l.price.toLocaleString('zh-CN')}</b><small>${esc(l.unit)}</small></div>
      <a class="btn btn-outline" href="employees.html?line=${l.id}">查看岗位、部署与价格 →</a>
    </article>`).join('');
  }

  function countOfSet(set) {
    return (set.agentRefs || []).length + (set.agents || []).length;
  }
  function agentsOfSet(set) {
    const list = [];
    (set.agentRefs || []).forEach((id) => {
      const a = GENERAL_AGENTS.find((x) => x.id === id);
      if (a) list.push(a);
    });
    (set.agents || []).forEach((a) => list.push(a));
    return list;
  }

  /* ---------------- 通用智能体卡片 ---------------- */
  function agentCard(a, kind) {
    const caps = (a.caps || []).slice(0, 3);
    const more = (a.caps || []).length - caps.length;
    const cls = kind === "v" ? "card v-card reveal" : "card reveal";
    return `
      <a class="${cls}" href="detail.html?agent=${a.id}" data-agent="${a.id}">
        <div class="card-top">
          ${kind === "g" && a.icon
            ? `<span class="card-illu" aria-hidden="true"><svg viewBox="0 0 24 24">${a.icon}</svg></span>`
            : `<span class="mono ${kind === "v" ? "v" : ""}">${esc(a.short || a.name.slice(0, 2))}</span>`}
          <div>
            <h3>${esc(a.name)}</h3>
            <p class="tagline">${esc(a.tagline)}</p>
          </div>
        </div>
        <p class="desc">${esc(a.desc)}</p>
        <div class="cap-list">
          ${caps.map((c) => `<span class="cap">${esc(c)}</span>`).join("")}
          ${more > 0 ? `<span class="cap cap-more">+${more}</span>` : ""}
        </div>
        <p class="card-price">云端建议价 <b>¥${pricingFor(a).monthly}</b> / 人 / 月</p>
        <div class="card-foot">
          <span class="badge ${(a.status || "online")}">${STATUS[a.status] ? STATUS[a.status].label : ""}</span>
          <span class="card-cta">详情与价格 ${ARROW_SVG}</span>
        </div>
      </a>`;
  }

  /* ---------------- 行业产品集卡片 ---------------- */
  function setCard(s) {
    const agents = agentsOfSet(s);
    const isPlan = s.status === "plan";
    return `
      <a class="card v-card reveal" href="detail.html?set=${s.id}" data-set="${s.id}">
        ${agents.length ? `<span class="count-pill">${agents.length} 个智能体</span>` : ""}
        <div class="card-top">
          <span class="mono ${isPlan ? "p" : "v"}">${esc(s.name)}</span>
          <div>
            <h3>${esc(s.setName)}</h3>
            <p class="tagline">${esc(s.domains.join(" · "))}</p>
          </div>
        </div>
        <p class="desc">${esc(s.desc)}</p>
        ${
          agents.length
            ? `<div class="cap-list">${agents
                .slice(0, 4)
                .map((a) => `<span class="cap">${esc(a.short || a.name)}</span>`)
                .join("")}${
                agents.length > 4 ? `<span class="cap cap-more">+${agents.length - 4}</span>` : ""
              }</div>`
            : `<div class="domains">${s.domains.map((d) => `<span class="domain">${esc(d)}</span>`).join("")}</div>`
        }
        <div class="card-foot">
          <span class="badge ${s.status}">${STATUS[s.status].label}</span>
          <span class="card-cta">${agents.length ? "查看场景与助手" : "查看规划"} ${ARROW_SVG}</span>
        </div>
      </a>`;
  }

  function renderGrids() {
    $("#general-grid").innerHTML = ALL_GENERAL.map((a) => agentCard(a, "g")).join("");
    $("#industry-grid").innerHTML = INDUSTRY_SETS.map(setCard).join("");
    applyFilter();
  }

  /* ---------------- 行业筛选 ---------------- */

  function applyFilter() {
    let shownSets = 0;
    $$("#industry-grid [data-set]").forEach((el) => {
      const s = findSet(el.dataset.set);
      if (!s) return;
      const ok =
        state.industryFilter === "all" ||
        (state.industryFilter === "online" && s.status !== "plan") ||
        (state.industryFilter === "plan" && s.status === "plan");
      el.style.display = ok ? "" : "none";
      if (ok) shownSets++;
    });

    const filtering = state.industryFilter !== "all";
    $("#empty").hidden = !filtering || shownSets > 0;

    // 结果计数：常驻可见 + aria-live 播报（筛选后仍能知道命中多少）
    setText("#count-general", `共 <b>${ALL_GENERAL.length}</b> 个通用智能体 · 查看能力与用法`);
    const onlineSets = INDUSTRY_SETS.filter((x) => x.status !== "plan").length;
    setText("#count-industry", filtering
      ? `匹配 <b>${shownSets}</b> / ${INDUSTRY_SETS.length} 个行业分类`
      : `共 <b>${INDUSTRY_SETS.length}</b> 个行业分类 · 已上线 ${onlineSets} 个，其余规划中`);
    setText("#result-status", filtering ? `已筛选：${shownSets} 个行业分类。` : "");
  }
  function setText(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

  function resetFilters() {
    state.industryFilter = "all";
    $$("#industry-filters .chip").forEach((c) => { c.classList.toggle("is-active", c.dataset.filter === "all"); c.setAttribute("aria-pressed", String(c.dataset.filter === "all")); });
    applyFilter();
  }

  // 兼容已分享的旧详情地址；新卡片使用真实链接，支持返回和新标签页。
  function redirectLegacyDetail() {
    const match = location.hash.match(/^#(agent|set)=([^&]+)$/);
    if (match) {
      let id = match[2];
      try { id = decodeURIComponent(id); } catch (_) { /* 无效编码交给未找到页面处理 */ }
      location.replace("detail.html?" + match[1] + "=" + encodeURIComponent(id));
    }
  }

  /* ---------------- 导航当前位置高亮（scroll-spy） ---------------- */
  function bindNavSpy() {
    const links = $$(".nav-link");
    const map = {};
    links.forEach((l) => { map[l.getAttribute("href").slice(1)] = l; });
    const sections = Object.keys(map).map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    const visible = {};
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
        let best = null, bestRatio = 0;
        sections.forEach((s) => {
          const r = visible[s.id] || 0;
          if (r > bestRatio) { bestRatio = r; best = s.id; }
        });
        links.forEach((l) => l.classList.remove("is-active"));
        if (best) { map[best].classList.add("is-active"); map[best].setAttribute("aria-current", "true"); }
        links.forEach((l) => { if (!l.classList.contains("is-active")) l.removeAttribute("aria-current"); });
      },
      { rootMargin: "-84px 0px -55% 0px", threshold: [0, .15, .35, .6, 1] }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindGlobal() {
    window.addEventListener("hashchange", redirectLegacyDetail);
    $$("#industry-filters .chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        state.industryFilter = chip.dataset.filter;
        $$("#industry-filters .chip").forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
        applyFilter();
      })
    );
    $("#empty-reset").addEventListener("click", resetFilters);
  }

  /* ---------------- 启动 ---------------- */
  $("#meeting-grid").innerHTML = MEETING_PRODUCTS.map(p=>`<article class="meeting-card"><div class="meeting-card-top"><span class="meeting-symbol">${p.icon}</span><span class="plan-label">${esc(p.type)}</span></div><h3>${esc(p.name)}</h3><p class="meeting-promise">${esc(p.tagline)}</p><p class="meeting-description">${esc(p.desc)}</p><div class="meeting-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div><div class="meeting-card-foot"><div><span>${esc(p.priceCaption)}</span><p><b>¥${p.price}</b> ${esc(p.unit)}</p></div><a class="btn btn-outline" href="products.html?product=${p.id}">了解产品与价格 →</a></div></article>`).join("");
  renderEmployees();
  renderStats();
  renderHeroVisual();
  renderGrids();
  bindGlobal();
  bindNavSpy();
  applyFilter();
  redirectLegacyDetail();
})();
