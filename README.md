# 龙江智域 · 智系列智能体展示中心

无构建、无外部运行依赖的静态产品站。直接打开 index.html，或运行 `python3 -m http.server 8000`，访问 http://127.0.0.1:8000。

## 页面结构

- `index.html`：品牌矩阵、通用智能体、行业方案和选购引导。卡片是真实链接，云端起步价格直接可见。
- `detail.html?agent=zhichuang`：独立智能体详情，展示用途、输入与结果、示例、部署与建议价。
- `detail.html?set=zhiqi`：行业组合详情，附助手入口和组合部署价格。
- 旧 `index.html#agent=…` / `#set=…` 链接自动转入独立详情页。
- 不再使用弹层或内部滚动。原生浏览器返回、刷新、分享地址、新标签打开均可用。
- 首页原 #pricing / #deploy / #box-card 锚点进入选购引导；详细方案已移到各产品内。

部署时需上传 index.html、detail.html 以及完整 assets 目录；无需服务器路由重写，file:// 同样可用。

## 内容配置

`assets/data.js` 管理 7 个通用智能体、12 个行业组合（2 个已上线、10 个规划中），共 17 个独立智能体。

- `AGENT_GUIDES` / `INDUSTRY_GUIDES`：用途、适用对象、输入材料、输出、示例与使用边界；在行业复用数据装配前应用。
- `AGENT_PRICE_TIERS` / `PRICE_PROFILES`：每个助手对应的云端建议价、任务额度、私有化方案起价。
- `PRICE_SOURCES`：官方竞品价格、比较口径与原始链接。
- `BOX_MODELS`：两款一体机配置与保守人数估算。
- 新增助手时应补齐用途信息和价格分档；规划产品不展示在售价格或试用。

首页由 assets/app.js 渲染，独立详情由 assets/detail.js 渲染，样式为 assets/styles.css 与 assets/detail.css。非法详情 ID 显示未找到页面与返回入口。

## 定价说明

当前建议价：办公 ¥19/人/月（300 次标准任务），研究分析 ¥29（200 次），专业任务 ¥39（100 次）；行业组合 ¥199/5人/月（1,500 次团队共享）。个人套餐知识库 1GB、组合 5GB。费用、额度与交付内容都是拟定方案，正式销售前需核验实际模型成本和服务成本。

私有化单助手 ¥1.98万起、行业组合 ¥2.98万起，均含标准平台；Lite / Pro 一体机 ¥3.98万 / ¥5.98万。已有平台可复用，不对每个助手重复收取硬件费用，新增授权或适配单独评估。

资料来源与容量推导见 docs/pricing-and-capacity.md，其中旧方案明确保留为历史记录，最新按文档开头及当前配置执行。

## 试用配置

SITE.trialBase 仍为原占位地址 https://ai-trial.example.com。详情页检测占位域名，不显示无效试用按钮；替换真实 URL 后自动显示。外部系统的真实试用尚未验证。规划产品始终无试用按钮。

## 验证

`node --check assets/app.js`、`node --check assets/data.js`、`node --check assets/detail.js`。
已检查全部28个详情的数据渲染、原生导航、价格关联、规划状态、旧链接、手机宽度和浏览器错误；网页检查不代表硬件性能验收。

## 数字员工产品线（2026-09-06）

新增首页重点数字员工专区与独立详情 employees.html?line=enterprise / government / industry。
企业16岗、政府6岗、行业7类21岗与现有智能体目录并列；目录数量不等于入门套餐包含数量。
岗位数据和建议价在 assets/employees-data.js，渲染和样式在 assets/employees.js / employees.css。
部署需一并上传 employees.html、这些资源及 assets/digital-employees 原图目录。
完整产品依据、竞品价格、建议价与实施边界见 docs/digital-employees.md。

会议与记录（原智记通、极会通）已合并为第 6 个通用智能体「智会」，详情页 `detail.html?agent=zhihui` 以"两种使用形态"展示录音卡与视频会议两条内容，不再单独设 products.html。定价依据见 [docs/meeting-products.md](docs/meeting-products.md)。

## 虚拟数字人场景（2026-09-08）

第四个产品维度，与数字员工、通用智能体、行业智能体并列，首页 `#humans` 板块展示 10 张场景卡片，独立详情为 `humans.html?id=daoban` 等。
覆盖金融、零售、教育、政务、交通、会展、酒店、工业、康养、招聘十大行业，仅做能力与场景介绍，不接入试用系统，不参与 SITE.showPricing 报价开关。
数据在 `assets/humans-data.js`（`DIGITAL_HUMANS`），渲染在 `assets/humans.js`，复用 `assets/styles.css` 的卡片组件与 `assets/detail.css` 的详情页排版，无需新增独立样式表。
部署需一并上传 humans.html 及 assets/humans-data.js、assets/humans.js。
