/* =============================================================
 * 龙江智域 · 智能体展示中心 —— 渲染与交互（纯前端，无依赖）
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
      { n: DIGITAL_HUMANS.length, t: "虚拟数字人场景" },
    ];
    $("#stats").innerHTML = items
      .map((i) => `<div class="stat"><b>${i.n}</b><span>${esc(i.t)}</span></div>`)
      .join("");
  }

  /* 语义化矩阵：品牌下分通用和行业两个产品分组，链接进入独立详情。 */
  function renderHeroVisual() {
    const uses = ["办公协同", "研究决策", "内容创作", "知识问答", "数据分析", "会议记录", "法律合规"];
    $("#hero-matrix").innerHTML = `
      <div class="matrix-root"><span class="matrix-logo">智</span><div><p>AI AGENT FAMILY</p><h2>${esc(SITE.brand)} <span>· 智系列</span></h2></div><span class="matrix-index">产品矩阵</span></div>
      <div class="matrix-branch" aria-hidden="true"></div>
      <section class="matrix-workforce"><div><h3>数字员工</h3><span>岗位能力 · 流程协同</span></div><div>${EMPLOYEE_LINES.map(l=>`<a href="employees.html?line=${l.id}">${esc(l.name)} ↗</a>`).join("")}</div></section>
      <section class="matrix-group"><div class="matrix-heading"><h3>通用智能体</h3><span>${STATS.general} 大核心能力</span></div>
        <div class="matrix-general">${ALL_GENERAL.map((a,i)=>`<a class="matrix-item" href="detail.html?agent=${a.id}"><svg viewBox="0 0 24 24" aria-hidden="true">${a.icon}</svg><b>${esc(a.short)}</b><span>${uses[i] || "通用能力"}</span></a>`).join("")}</div></section>
      <section class="matrix-group industry-matrix"><div class="matrix-heading"><h3>行业智能体</h3><span>智政、智企已上线 · 其余规划中</span></div>
        <div class="matrix-industries">${INDUSTRY_SETS.map(st=>`<a href="detail.html?set=${st.id}" class="matrix-item ${st.status === "plan" ? "is-planned" : "is-online"}"><b>${esc(st.name)}</b><span class="sr-only">${esc(st.domains[0])} · ${st.status === "plan" ? "规划中" : "已上线"}</span></a>`).join("")}</div></section>
      <section class="matrix-group matrix-humans-group"><div class="matrix-heading"><h3>虚拟数字人</h3><span>${DIGITAL_HUMANS.length} 大场景 · 能力展示</span></div>
        <div class="matrix-humans">${DIGITAL_HUMANS.map(h=>`<a href="humans.html?id=${h.id}" class="matrix-item"><b>${esc(h.short)}</b><span class="sr-only">${esc(h.industry)}</span></a>`).join("")}</div></section>
      <div class="matrix-base">统一能力底座 <span>知识库 / 工作流 / 模型服务</span></div>`;
  }

  function renderEmployees() {
    document.querySelector('#employee-lines').innerHTML = EMPLOYEE_LINES.map((l,i)=>`<article class="employee-line-card">
      <div class="employee-line-title"><span class="employee-symbol" aria-hidden="true">${['企','政','业'][i]}</span><div><p>${esc(l.eyebrow)}</p><h3>数字员工 · ${esc(l.name)}</h3></div></div>
      <p class="employee-line-promise">${esc(l.tagline)}</p><p class="employee-line-desc">${esc(l.desc)}</p>
      <div class="employee-line-tags">${l.highlights.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      <p class="employee-line-count">${esc(l.count)} · 按需配置</p>${SITE.showPricing?`<div class="employee-line-price"><span>建议起步价</span><b>¥${l.price.toLocaleString('zh-CN')}</b><small>${esc(l.unit)}</small></div>`:''}
      <a class="btn btn-outline" href="employees.html?line=${l.id}">${SITE.showPricing?'查看岗位、部署与价格 →':'查看岗位与部署方式 →'}</a>
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
        ${SITE.showPricing?`<p class="card-price">云端建议价 <b>¥${pricingFor(a).monthly}</b> / 人 / 月</p>`:''}
        <div class="card-foot">
          <span class="badge ${(a.status || "online")}">${STATUS[a.status] ? STATUS[a.status].label : ""}</span>
          <span class="card-cta">${SITE.showPricing?'详情与价格':'查看详情'} ${ARROW_SVG}</span>
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

  /* ---------------- 虚拟数字人卡片（纯场景展示，无价格/试用） ---------------- */
  function humanCard(h) {
    const caps = (h.caps || []).slice(0, 3);
    const more = (h.caps || []).length - caps.length;
    return `
      <a class="card reveal" href="humans.html?id=${h.id}" data-human="${h.id}">
        <div class="card-top">
          <span class="card-illu" aria-hidden="true"><svg viewBox="0 0 24 24">${h.icon}</svg></span>
          <div>
            <h3>${esc(h.name)}</h3>
            <p class="tagline">${esc(h.tagline)}</p>
          </div>
        </div>
        <p class="desc">${esc(h.desc)}</p>
        <div class="cap-list">
          ${caps.map((c) => `<span class="cap">${esc(c)}</span>`).join("")}
          ${more > 0 ? `<span class="cap cap-more">+${more}</span>` : ""}
        </div>
        <div class="card-foot">
          <span class="domain">${esc(h.industry)}</span>
          <span class="card-cta">查看详情 ${ARROW_SVG}</span>
        </div>
      </a>`;
  }
  function renderHumans() {
    $("#humans-grid").innerHTML = DIGITAL_HUMANS.map(humanCard).join("");
    setText("#count-humans", `共 <b>${DIGITAL_HUMANS.length}</b> 个虚拟数字人场景 · 能力与场景展示`);
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

  /* ---------------- 导航当前位置高亮（scroll-spy） ----------------
   * 用"板块顶部是否已经滚过判定线"来判定高亮，判定线的位置直接从 CSS 读：
   * html 的 scroll-padding-top 和 .section 的 scroll-margin-top 是叠加关系
   * （不是取较大值），锚点跳转会让板块顶部正好停在两者之和这条线上；判定线
   * 必须盖过这条线，否则刚跳转过去板块顶部还没"到线"，会被误判成上一个板块
   * （例如点击"虚拟数字人"后高亮仍停在"行业智能体"）。用 getComputedStyle 现读
   * 这两个值，比硬编码一个像素数更不容易因为断点变化、样式调整而再次跑偏。 */
  function bindNavSpy() {
    const links = $$(".nav-link");
    const map = {};
    links.forEach((l) => { map[l.getAttribute("href").slice(1)] = l; });
    const sections = Object.keys(map).map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const lastId = sections[sections.length - 1].id;

    function setActive(id) {
      links.forEach((l) => l.classList.remove("is-active"));
      if (id && map[id]) { map[id].classList.add("is-active"); map[id].setAttribute("aria-current", "true"); }
      links.forEach((l) => { if (!l.classList.contains("is-active")) l.removeAttribute("aria-current"); });
    }

    function activateLine() {
      const rootPad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const sectionMargin = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0;
      return rootPad + sectionMargin + 12; // 加一点缓冲，避免刚好卡在临界像素上。
    }

    function updateActive() {
      const line = activateLine();
      let current = null;
      sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s.id; });
      // 已经滚到页面底部时，最后一个板块可能撑不满判定线以下的空间，直接判它高亮。
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = lastId;
      setActive(current);
    }

    // 点击导航链接时立即高亮目标项，不等锚点跳转的滚动过程结束。
    links.forEach((l) => l.addEventListener("click", () => setActive(l.getAttribute("href").slice(1))));
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();
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
  renderEmployees();
  renderStats();
  renderHeroVisual();
  renderGrids();
  renderHumans();
  bindGlobal();
  bindNavSpy();
  applyFilter();
  redirectLegacyDetail();
})();
