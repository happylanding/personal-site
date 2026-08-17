# Galvin 替代视觉设计技能核验

日期：2026-08-15
状态：候选核验中。目标是替代无法被平台导入的 Superdesign，而非增加与现有工作流重复的技能。

## 准入标准

候选必须同时满足：存在可定位的 `SKILL.md`；能以 GitHub 子目录被导入器识别；许可证明确且允许本次使用；有可观察的维护迹象；能补足现有 `frontend-design`（视觉方向）与 `web-design-guidelines`（实现后审查）之间的设计系统、构图或 UX 评估缺口。任何依赖付费 API、运行未审查脚本、或仅是历史 IDE 扩展的候选均不得直接进入试点。

## 已核验候选

| 候选 | 技能文件与维护证据 | 许可证/依赖 | 适配结论 |
| --- | --- | --- | --- |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 不是 `SKILL.md` 技能包，而是 80+ 真实网站分析形成的 `DESIGN.md` 集合；仓库有 `design-md/` 目录、MIT 许可证、61 次提交，最新可见更新约两周前。 | 仅 Markdown，无运行时、无 CLI、无外部 API。 | **强参考库，不作为技能导入**。可为 Galvin 提供经过分析的布局、令牌、组件状态与“Do/Don't”基准；应从中选择一个低风险参考并提炼为 Galvin 自有 `DESIGN.md`，绝不整份复制品牌视觉。 |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 根目录可见 `.claude/skills`，已核验实际路径 `.claude/skills/ui-ux-pro-max/SKILL.md`；仓库当前显示 214 次提交，最近提交约两天前。技能涵盖样式、色彩、字体配对、UX 规则、图标、动效与技术栈检索，并要求先生成设计系统再做页面实现。 | GitHub 明示 MIT；技能使用其目录内的本地数据与 Python 检索脚本，不强制外部 API。包含 CLI、数据和示例，但本次只考虑导入技能目录，不运行其 CLI；写入设计系统文件时禁止使用 `--force` 覆盖既有决策。 | **强候选**。它补足设计方向与审查之间的“设计智能/模式检索”能力，且可选择性使用，不改变 Astro 运行时。 |
| [UX/UI Principles Agent Skills](https://github.com/uxuiprinciples/agent-skills) | 有五个独立技能目录（包括 `uxui-evaluator`、`interface-auditor`），每个按 README 声明包含 `SKILL.md`；最近可见提交约四个月前且总提交数仅 2。 | README 说技能可自由使用与分发，但仓库页面未显示明确 LICENSE；增强输出依赖可选付费 API。 | **不建议导入**。即使离线可用，许可证不够明确、维护证据较弱，并且审查功能与已导入 `web-design-guidelines` 重叠。 |
| [UI UX Agent Skill System](https://github.com/sergekostenchuk/ui-ux-agent-skill-system) | GitHub 搜索发现；有核心、数据、适配器、评测和发布检查，最近可见更新约两个月前，21 次提交。 | Apache-2.0；README 的安全默认值强调本地优先，外部服务需获用户授权。 | **观察候选，不在本轮导入**。结构严谨但生态较小，且需进一步核验其 Agent Skill 子目录能否被当前导入器识别；目前它与已导入的 UI UX Pro Max 功能重叠。 |
| [Open Design](https://github.com/nexu-io/open-design) | GitHub 搜索发现；近期仍频繁更新，提供设计系统、模板、桌面应用、Agent 集成和本地优先工作流。 | Apache-2.0；它是完整的本地桌面设计环境而非单一轻量 `SKILL.md`。 | **不作为本次技能安装**。其产品体量、运行环境和学习成本远超两页视觉试点；可在未来需要独立画布/原型工具时重新评估。 |
| [UX/UI Agent Skills](https://github.com/plugin87/ux-ui-agent-skills) | 有清晰的 `.claude/skills/` 目录，含 `apply-aesthetic`、`redesign`、`design-tokens`、`design-qa`、`design-review`、`a11y-audit` 等细粒度 `SKILL.md`；最近发布 v2.4.0，公开 16 个标签、34 次提交。已核验：`apply-aesthetic` 强制先写 Brief Inference，再映射审美到语义令牌并检查对比；`design-qa` 提供令牌/硬编码检查、axe、真实渲染对比、跨视口视觉回归与人工无障碍清单。 | MIT；包含本地规则、令牌、组件与脚本。技能注明应先审阅后使用。 | **本轮最强补充候选**。不导入整仓；只建议导入 `apply-aesthetic`（构图/审美方向）与 `design-qa`（渲染后视觉 QA）两个子技能。令牌、可访问性和审查技能与当前已有能力重叠，暂不重复导入。 |

## 当前结论

现阶段只将 UI UX Pro Max 保留为首选候选。导入前仍需读取其实际 `SKILL.md`，核对不会要求运行未经审查的 CLI 或将通用 SaaS/营销模板强加给 Galvin 的内容站。若这项核验通过，将把它作为第三项、仅在构图与组件取舍阶段触发的技能；它不会替换 Astro、Tailwind 或现有内容模型。
