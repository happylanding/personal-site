# 个人网站改造V1：项目基线

> **项目定位：** Galvin 是一张正在被使用的中文研究工作台。它记录 AI 学习、工作方法与生活轨迹，并通过工具、文章、资源与书目把好奇心做成一点有用的东西。

## 1. 项目身份与当前状态

| 项目项 | 当前约定 |
| --- | --- |
| Manus 项目 | [个人网站改造V1](https://manus.im/app/project/J8d7aWNHGy5d3KkbQLdngy) |
| 代码仓库 | `happylanding/personal-site` |
| 工作分支 | `revamp/galvin-v1` |
| 预览地址 | <https://revamp-galvin-v1.galvinai.pages.dev> |
| 正式生产分支 | `main`，未经用户明确确认不得修改 |
| 内容更新方式 | Markdown + Git；不建设站内内容后台 |
| 部署方式 | GitHub 推送触发 Cloudflare Pages 分支预览；正式发布由用户在平台界面完成 |
| 当前基线提交 | `f500d7f feat: rebuild Galvin visual system` 与 `91654e2 docs: mark rebuild delivery complete` |

平台项目链接已由用户提供。当前自动化浏览器未持有 Manus 登录态，因此**当前任务在平台项目中的归属状态需要在用户已登录的工作台中确认**；仓库内的全部项目基线、文档、任务模型和代码工作不受此限制。

## 2. 有效资产索引

以下文件不是“参考堆”，而是后续任务必须优先读取的有效资产。若任务与其冲突，应先更新本基线与相应决策文档，再开始实现。

| 类型 | 主要文件 | 用途与优先级 |
| --- | --- | --- |
| 视觉宪法 | [`DESIGN.md`](../DESIGN.md) | **最高优先级。** 定义纯色 `#10131d` 画布、令牌角色、中文排版、四种断点规则、导航与禁用模式。 |
| 整站蓝图 | [`whole-site-rebuild-blueprint.md`](whole-site-rebuild-blueprint.md) | **高优先级。** 定义首页、内容目录、阅读页、个人档案四种页面原型与批量实施顺序。 |
| 审计证据 | [`whole-site-baseline-audit.md`](whole-site-baseline-audit.md) | **高优先级。** 记录先前结构性问题，防止重新引入卡片墙、重复标题与内容后置。 |
| 工作治理 | [`whole-site-rebuild-governance.md`](whole-site-rebuild-governance.md) | **高优先级。** 规定视觉、UX、审美、QA 分工与系统级确认门槛。 |
| 导航决策 | [`design-stack-and-navigation-reassessment.md`](design-stack-and-navigation-reassessment.md) | **高优先级。** 定义“造物、叩问、行迹、藏页、关于”及藏页二级资源结构。 |
| 首页/归档试点 | [`home-archive-design-system-v1.md`](home-archive-design-system-v1.md)、[`home-archive-implementation-brief.md`](home-archive-implementation-brief.md) | 首页与叩问内容阅读构图的历史实施依据；以 `DESIGN.md` 与整站蓝图为准。 |
| 具体修订记录 | [`archive-annotation-response.md`](archive-annotation-response.md) | 用户对叩问归档标题、辅助文字、标签披露的直接反馈与已落实方案。 |
| 前端调研 | [`frontend-visual-design-research.md`](frontend-visual-design-research.md)、[`alternative-design-skills-evaluation.md`](alternative-design-skills-evaluation.md) | 仅用于选择审查方法与技能，不得覆盖当前视觉宪法。 |
| 内容与业务配置 | [`src/content.config.ts`](../src/content.config.ts)、[`src/lib/galvin-content.ts`](../src/lib/galvin-content.ts)、[`src/lib/galvin-navigation.ts`](../src/lib/galvin-navigation.ts) | 内容集合、栏目模型、导航信息架构的唯一代码来源。 |
| 页面与组件 | `src/pages/`、`src/components/`、[`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro)、[`src/styles/global.css`](../src/styles/global.css) | 页面原型、共享壳层、交互和设计令牌的实现层。 |
| 质量门禁 | [`tests/galvin-content.test.ts`](../tests/galvin-content.test.ts)、[`tests/e2e/site-baseline.spec.ts`](../tests/e2e/site-baseline.spec.ts) | 内容模型与浏览器可观察行为的回归边界。 |
| 工作状态 | [`todo.md`](../todo.md) | 当前完成情况与后续任务队列。 |

以下文件可保留为**历史研究记录**，但不应作为新设计决策的首要依据：`about-footer-research.md`、`about-footer-visual-audit.md`、`email-contact-research.md`、`mobile-toc-v2-research.md`、`illustration-workflow.md`、`book-upload-workflow.md`、`github-sync.md`。

## 3. 五条任务轨道

将后续工作拆分为五条可独立排期、但共享同一质量门禁的轨道。任何任务只能有一个主轨；需要跨轨时，必须列出依赖与联合验收项。

| 轨道 | 任务代号 | 回答的问题 | 典型范围 | 主验收 |
| --- | --- | --- | --- | --- |
| 视觉 | `V-###` | 页面看起来是否属于 Galvin，层级是否清楚？ | 令牌、排版、留白、响应式构图、控件状态、低干扰动效 | 1440px / 834px / 390px 截图；设计禁用项检查；axe 对比度 |
| 架构 | `A-###` | 内容、路由、组件和数据模型是否能长期演进？ | Astro 集合、栏目模型、导航、共享组件、代码边界、构建依赖 | 类型检查、内容单测、构建、迁移说明 |
| 功能 | `F-###` | 读者能否可靠完成一项明确动作？ | 搜索、筛选、下载、在线阅读、复制邮箱、资源展开、阅读进度 | TDD 行为回归、键盘路径、移动触控、错误/空状态 |
| 文本与内容 | `T-###` | 页面是否有真实、清楚、可公开的内容？ | Markdown 文章、工具说明、资源拆解、书目、元数据、SEO 文案 | 事实与隐私复核、中文风格、链接有效性、内容 schema 校验 |
| 质量与交付 | `Q-###` | 改动是否可以安全合并、预览和回退？ | 视觉 QA、无障碍、性能、Git、Cloudflare 预览、发布说明 | `npm run quality`、Playwright、axe、三视口、干净工作树 |

### 任务命名与边界

每项新工作以 `轨道-编号：动词 + 对象` 命名，例如：`F-001：完善网站与资源的展开检索状态`、`T-001：补齐造物工具的真实使用说明`。一个任务应控制在能够完成“验收标准 → 实际结果 → 核验方式 → 未完成项”闭环的范围内；过大的需求先拆成设计决策任务和实现任务。

## 4. 统一工作流程

### 4.1 每个任务的固定步骤

| 阶段 | 必做动作 | 产物 |
| --- | --- | --- |
| 1. 定义 | 写清读者任务、非目标、涉及轨道、依赖文件和完成标准 | 任务简报；必要时更新 `todo.md` |
| 2. 对齐 | 读取 `DESIGN.md`、相关页面原型、内容模型与既有回归 | 明确不应被破坏的系统约束 |
| 3. 约束 | 先写失败测试或可验证的视觉/内容验收 | 红灯回归或验收清单 |
| 4. 实现 | 以共享令牌与组件优先，不创建局部第二套系统 | 最小可维护代码变更 |
| 5. 验证 | 执行相应的单测、构建、浏览器、axe 与三视口截图 | 可复现的核验结果 |
| 6. 交付 | 更新文档/待办，提交到 `revamp/galvin-v1`，报告四段式结果 | Git 提交、分支预览、下一步建议 |

### 4.2 必须遵守的协作规则

视觉轨不得用局部渐变、网格、卡片阴影或英文眉标“补高级感”；架构轨不得绕开内容集合和现有导航模型；功能轨不得以不可键盘访问的点击容器替代语义控件；文本轨不得公开单位、未脱敏文件或未经授权全文；质量轨不得以“看起来能用”替代真实构建、回归与无障碍检查。

任何修改 `DESIGN.md`、导航栏目、公开身份边界、内容许可边界或生产分支的任务，都属于**系统级变更**，必须先取得用户确认。字号、间距、实现细节、测试选择器和局部组件内部重构，则由执行过程在既有契约内决定。

## 5. 下一阶段建议任务队列

| 优先级 | 任务 | 主轨 | 目的 | 完成标志 |
| --- | --- | --- | --- | --- |
| P0 | `Q-001：建立项目化变更日志与提交模板` | 质量与交付 | 让每个分轨任务在项目中可追溯、可回退 | 变更日志、任务模板、提交约定写入仓库 |
| P0 | `T-001：审计首发内容与公开边界` | 文本与内容 | 为造物、叩问、行迹、藏页建立真实内容最低线 | 内容清单、脱敏规则、缺口列表通过 schema 校验 |
| P1 | `A-001：收敛中文优先的路由与文案边界` | 架构 | 明确遗留英文路由和切换组件的保留/下线策略 | 路由决策、导航和搜索索引一致；构建通过 |
| P1 | `F-001：资源与书架的维护性工作流` | 功能 | 固化站点报告、书目状态、合法外链的新增和更新步骤 | Markdown 模板、校验、空状态与浏览器回归 |
| P1 | `V-001：建立组件级视觉回归基线` | 视觉 | 避免未来分轨任务破坏纯色画布与阅读层级 | 关键页面截图基线、token 检查、缩减动态检查 |
| P2 | `F-002：评估第二阶段服务端资源分析功能` | 功能 | 在不承诺首版的前提下定义“输入网址生成分析”的架构边界 | 技术设计、隐私边界、成本与失败路径评估 |

## 6. 一次任务的交付格式

每个任务结束后必须使用以下四段式结论，便于你在“个人网站改造V1”项目中快速核对：

| 段落 | 应回答的问题 |
| --- | --- |
| 验收标准 | 事先承诺了什么可观察结果？ |
| 实际结果 | 实现了什么，哪些选择是刻意不做的？ |
| 核验方式 | 用了哪些命令、截图、测试或审计？ |
| 未完成项 | 哪些内容应进入下一任务，而不是临时塞入当前改动？ |

## 7. 当前操作说明

当前任务已完成整站视觉与体验重构，代码处于 `revamp/galvin-v1`。由于自动化浏览器访问用户提供的项目链接时仍被重定向至 Manus 登录页，无法从当前会话自动确认“既有任务已加入平台项目”。用户在已登录工作台中确认任务归属后，本文件就是可直接作为项目说明、共享文件或首条项目任务描述的基线。
