# Galvin 前端视觉设计规范与开源能力调研

日期：2026-08-15  
状态：调研中。本文用于暂停当前页面“补丁式”视觉修改后，重新建立 Galvin 内容站的前端视觉工程基线。

## 一、问题定义与评价标准

本次不把“效果更多”当作视觉质量。Galvin 是以中文阅读、AI 学习与工具沉淀为核心的 Astro 静态内容站，后续选型必须同时满足可读性、克制的品牌辨识、移动端稳定性、键盘可用性、轻量运行与长期维护。候选规范、组件库、框架或 Agent Skill 均按以下标准评估。

| 维度 | 评估问题 | Galvin 的底线 |
| --- | --- | --- |
| 视觉系统 | 是否能约束字体、色彩、间距、层级，而不是堆叠单页特效？ | 必须支持有限、语义化的设计令牌。 |
| 内容可读性 | 是否优先服务中文长文、标题/正文比例与移动阅读？ | 正文不小于 16px；标题和正文仅保留必要层级。 |
| 组件质量 | 是否有明确的可访问性、焦点、键盘与状态规范？ | 不接受只提供截图式 UI 的组件集合。 |
| Astro 兼容性 | 是否可以以 CSS、原生 HTML、Web Components 或可隔离的岛屿方式接入？ | 不因单个效果重构为重型 React 全站。 |
| 性能与维护 | 是否需要大量运行时、WebGL、视频或脆弱依赖？ | 首版避免把装饰性效果变成常驻性能负担。 |
| 许可证与成熟度 | 是否开源、许可明确、维护活跃、文档可用？ | 优先 MIT/Apache-2.0/BSD；需标注例外。 |

## 二、已核验的视觉规范基线

### 2.1 令牌优先，而非页面补丁

U.S. Web Design System 将色彩、间距、字体、行高、透明度等有限离散值定义为设计令牌，以提高设计效率和跨组件一致性。[1] 这直接对应 Galvin 当前的主要问题：虽然已有颜色变量，但字体尺度、间距、分隔线密度和信息层级仍以页面局部样式叠加。后续应将 `--galvin-*` 扩展为明确的**语义令牌层**，例如 `--type-display`、`--type-title`、`--type-body`、`--space-section`、`--surface-raised`、`--line-subtle`，禁止各页面自由创造近似字号和间距。

### 2.2 排版与阅读基线

USWDS 建议普通正文使用至少有效 16px；更小字号仅用于短说明。长文本应使用至少 1.5 的行高，标题可使用 1–1.35；可读行长常见于 45–90 字符区间，且标题应更接近其所引导的内容。[2] 因此 Galvin 的中文内容页面应固定一套少量角色：Display、页面标题、区块标题、引语/导语、正文、辅助信息。工具标签、版权、状态编号可以小，但不能承载读者需要反复阅读的内容。

### 2.3 初步规范结论

| 设计对象 | 初步规则 | 不采用的做法 |
| --- | --- | --- |
| 标题层级 | 每个页面仅一个 Display；区块标题不与 Display 竞争。 | 通过多个 40px+ 标题堆叠制造“科技感”。 |
| 正文与说明 | 主正文 16–18px；辅助说明 13–14px；工具标签 11–12px。 | 将邮箱、栏目、导航、正文都压到 10–11px。 |
| 间距 | 使用 4/8px 基准与有限的区块尺度；标题与其下内容更近。 | 仅以大面积空白和重复横线区分区域。 |
| 色彩 | 深色背景中以表面阶差与边界表达层级，紫/青只表示交互或状态。 | 用高饱和发光、过多描边或渐变替代信息层级。 |
| 动效 | 动效仅解释状态、导航或上下文变化，并尊重减少动态效果偏好。 | 进入动画、滚动效果或粒子成为页面的主要内容。 |

### 2.4 无障碍是视觉质量的硬约束

WCAG 2.2 将最小文本对比度、文本缩放、窄屏重排、非文本对比、键盘操作、可见焦点、目标尺寸与动画控制列为可验证的成功准则。[3] 对 Galvin 而言，这意味着“深色科技感”不能依赖低对比灰字、极小等宽字体、只靠颜色传达状态或悬浮才出现的按钮；所有可点击控件须保留键盘焦点和移动端触达空间，非必要动效必须能够在 `prefers-reduced-motion` 下减弱或关闭。

## 三、权威来源（已阅读）

1. U.S. Web Design System, [Design tokens](https://designsystem.digital.gov/design-tokens/)
2. U.S. Web Design System, [Typography](https://designsystem.digital.gov/components/typography/)
3. W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

## 四、开源技能与组件候选：已核验发现

### 4.1 视觉工作流技能

| 候选 | 来源与许可 | 已核验能力 | 对 Galvin 的判断 |
| --- | --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design)；技能许可需以仓库 LICENSE 为准 | 强调设计应从真实主题、读者与页面职责出发；排版、结构、编号和动效必须有内容意义，避免模板化默认视觉。 | **推荐作为视觉方向与页面重构前的必经工作流**。它直接对应 Galvin 当前的“标签、编号、横线过多却缺少内容语义”问题。 |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | 以最新 Web Interface Guidelines 审查 UI 代码，覆盖 UI、UX、可访问性和实现质量。 | **推荐作为每轮实现后的审查门禁**，但它是审查技能，不能替代视觉方向。 |
| Superdesign Skill | [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill)，MIT | 支持从代码库提取设计系统、产生/迭代视觉草图、沉淀独立设计系统文档。 | **推荐作为一次性设计探索与系统提取工具**，不作为线上运行时依赖；需先在独立草图阶段验证，再人工转写为 Astro/CSS。 |
| Design Auditor | [Ashutos1997/claude-design-auditor-skill](https://github.com/Ashutos1997/claude-design-auditor-skill) | 已核验：仓库说明覆盖 19 类设计审查，可检查 Figma、HTML/CSS/React/Vue 代码、截图、线框图和文字描述，并给出分类评分与 WCAG 覆盖；仓库界面未显示明确 LICENSE 文件。 | **候选，但暂不安装**。它适合作为截图/代码的第二审查意见；因许可证未明确，安装或复制其内容前必须取得明确许可信息。 |

### 4.2 组件与框架候选：已核验发现

| 候选 | 适配性 | 结论 |
| --- | --- | --- |
| Shoelace | Web Components 原本与 Astro 相容，且提供丰富互动组件与设计令牌；但官网已明确标记该项目停止活跃开发并迁移至 Web Awesome。[4] | **不建议在新工作包中引入 Shoelace**。仅可参考其组件 API 与可访问性模式；若未来确有 Web Components 需求，应单独评估其继任项目 Web Awesome。 |
| 当前 Astro + 原生 HTML/CSS/少量脚本 | 与现有内容集合、SSG、Cloudflare Pages 和已有测试最兼容。 | **保留为生产基座**。视觉质量问题应先由令牌、页面结构和审查流程解决，而不是换框架。 |
| React-only 组件库（如 shadcn/Radix 类型） | 生态成熟，但会增加 React islands、样式和维护复杂度。 | **不作为当前内容站默认依赖**。仅在确需复杂可访问交互且原生方案不合理时局部采用。 |

### 4.3 动效与页面连续性

Astro 官方将 View Transitions 定义为保持页面状态之间视觉连续性的选择，并说明其同时提供淡入、滑动、浏览器回退、降级和 `prefers-reduced-motion` 支持。[5] 对 Galvin 的结论是：**保留当前 Astro 静态内容架构，后续仅在全站视觉系统稳定后，以一次受控试点评估页面级淡入或共享元素过渡**。不将“丝滑”理解为滚动劫持、全站 SPA 化或大量常驻动画。

4. Shoelace, [Shoelace documentation](https://shoelace.style/)
5. Astro, [View transitions](https://docs.astro.build/en/guides/view-transitions/)

## 五、开源能力选型矩阵

本轮通过已验证的 GitHub 技能索引进行了实时检索，覆盖 `design`、`frontend design`、`accessibility` 和 `audit` 等关键词。检索结果并不意味着应全部安装。Galvin 当前真正缺少的是**视觉方向形成、代码级审查与可追溯设计令牌**，而不是更多会生成界面的运行时依赖。

| 类别 | 候选 | 价值 | 采用级别 | 风险/边界 |
| --- | --- | --- | --- | --- |
| 设计方向 Skill | `frontend-design` | 在实现前要求明确受众、页面职责、独特设计论点和“编号/分隔/动效是否具有内容意义”。 | **建议导入** | 不提供组件或审查报告，须与测试和视觉核验配合。 |
| 代码审查 Skill | `web-design-guidelines` | 每轮完成后按最新 Web Interface Guidelines 审查 UI、UX 与可访问性。 | **建议导入** | 输出是问题清单，不会替代设计师的构图选择。 |
| 草图/系统探索 | Superdesign Skill | 从现有代码提取设计 DNA、形成独立系统文档、在草图层反复迭代。 | **建议按需导入** | 不作为生产依赖；先输出草图与令牌，再人工转写到 Astro/CSS。 |
| 第二审查意见 | Design Auditor | 对代码、截图和线框图做多维设计检查，含 WCAG、排版、间距、图标和导航。 | **暂缓导入** | 仓库未呈现明确许可证；先确认许可与实际审查质量。 |
| 复杂浮层定位 | Floating UI DOM | 只解决菜单、提示、弹出层等定位/碰撞问题。 | **按需添加 npm 包** | 它不是完整无障碍组件库，ARIA、焦点与键盘仍需自己实现和测试。 |
| Web Components | Web Awesome（Shoelace 的继任项目） | 框架无关的组件、主题和令牌思路，可作为后续复杂交互的候选。 | **仅调研，不引入** | 必须单独核验许可证、包体积、Astro SSR/水合与可访问性；不能用它替代 Galvin 的品牌视觉系统。 |

### 建议导入的 Skill 入口

| Skill | 来源 | 导入入口 | 用法定位 |
| --- | --- | --- | --- |
| `frontend-design` | `anthropics/skills` | [导入](https://manus.im/app#settings/skills/import?githubUrl=https://github.com/anthropics/skills/tree/main/skills/frontend-design) | 每次“新页面/重大视觉重构”开始前；先确定主题、受众、页面唯一任务与视觉论点。 |
| `web-design-guidelines` | `vercel-labs/agent-skills` | [导入](https://manus.im/app#settings/skills/import?githubUrl=https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | 每次实现后审查指定 CSS/组件文件；修复高影响问题后再截图验收。 |
| Superdesign Skill | `superdesigndev/superdesign-skill` | [导入](https://manus.im/app#settings/skills/import?githubUrl=https://github.com/superdesigndev/superdesign-skill) | 只用于独立设计探索、竞品拆解和可实现的设计系统草案。 |

> 本轮只完成了调研与筛选，**未安装任何外部 Skill、未添加任何 npm 依赖、未改变生产代码**。推荐的两项 Skill 也应在你确认后再导入，避免把未经试用的工作流直接带入项目。

## 六、Galvin 的推荐生产组合

### 6.1 不换框架，先重建系统

建议保留 **Astro 7 + Tailwind CSS 4 + 原生 Astro 组件 + 少量原生脚本**。Astro 的内容集合、静态构建、Cloudflare Pages 部署和既有测试已契合 Galvin 的内容站定位。此前页面质量不佳的根源是缺少被严格执行的视觉系统，而不是 Astro 能力不足。

新系统应采用“**令牌 → 页面原型 → 组件 → 验收**”的顺序：先在 `src/styles/tokens.css`（或等价全局位置）定义字体、空间、表面、边界、动效和焦点；再以一个页面为唯一试点；试点通过后才迁移其余栏目。禁止直接在单页 CSS 中继续叠加近似的字号、间距和边框色。

| 层 | 生产建议 | 禁止事项 |
| --- | --- | --- |
| 令牌层 | 设立不超过 6 级字体角色、6–8 级空间角色、4 级文字色和 3 级表面色。 | 任意页面自行创建 `13px`、`15px`、`17px` 等近似字号。 |
| 原语层 | 使用原生 `button`、`a`、`dialog`、`details`、表单控件与当前 `Icon.astro`；保持语义 HTML。 | 为普通链接、复制动作或目录功能引入整套前端框架。 |
| 组件层 | 将 Header、Footer、内容卡片、文章目录、联系块做成有状态规范的少量组件。 | 用统一“圆角卡片 + 紫色渐变 + 图标”套满所有内容。 |
| 交互层 | 仅在搜索、目录、复制、弹层等真实任务中使用 JS；需要浮层再评估 Floating UI DOM。 | 为“科技感”引入常驻 WebGL、粒子、滚动劫持或全局自定义光标。 |
| 动效层 | 先实现 120–220ms 的状态反馈；页面过渡以 Astro View Transitions 小范围试点。 | 在视觉系统未稳定前全面启用 ClientRouter 或复杂页面入场动画。 |

### 6.2 视觉规范 v1（待下一轮试点固化）

| 维度 | 规范 | 验收方式 |
| --- | --- | --- |
| 字体 | 中文正文以 `Noto Sans SC` 16–18px、1.65–1.8 行高为基线；IBM Plex Mono 仅用于数字、状态和短标签。 | 390px、834px、1440px 下检查正文、邮箱、栏目与按钮均无需放大阅读。 |
| 层级 | 一页只允许一个 Display；页面标题、区块标题、正文、辅助信息分别使用固定角色。 | 截图中读者可在 3 秒内分辨标题、主体内容、下一步操作。 |
| 间距 | 采用 4/8px 基线；相邻区块间距仅使用预设尺度；标题下方间距小于标题上方间距。 | CSS 审查禁止页面局部的随机间距值。 |
| 深色界面 | 通过表面阶差、文本对比和有限边界建立层级；电紫/荧青只承担交互、状态或一处主信号。 | WCAG 对比度、键盘焦点、关闭状态和减少动态效果测试通过。 |
| 图标 | 使用现有线性图标语言；所有图标须说明操作或内容含义。 | 仅装饰的图标不得重复出现在每一个卡片/列表项。 |
| 动效 | 一个页面最多一个主叙事动效；组件状态只动 `opacity`/`transform`，并支持减少动态效果。 | 录屏/截图检查页面不因滚动、加载或悬浮而抢夺阅读注意力。 |

## 七、下一次视觉重构的工作流门禁

下一次不应从关于页或页脚继续修改。建议选择 **首页首屏 + 一个内容列表** 作为唯一试点，理由是它们最能定义全站视觉语言，也最容易验证是否真的改善了内容阅读和导航。

| 阶段 | 必做产物 | 通过条件 |
| --- | --- | --- |
| 1. 设计说明 | 一页简报：读者、页面唯一任务、视觉隐喻、禁用元素、文字角色、交互边界。 | 用户确认一个方向，而非在代码中寻找方向。 |
| 2. 令牌草案 | 字体、空间、表面、边界、焦点、动效共一份 token 表。 | 无随意新增的页面局部数值。 |
| 3. 静态构图 | 1440px、834px、390px 三种构图截图或草图。 | 首屏、内容密度和行动入口均可被视觉审查。 |
| 4. 实现与测试 | 组件、CSS、键盘/屏幕阅读器语义、浏览器回归。 | 功能测试、可访问性测试和视觉核验全部通过。 |
| 5. 审查 | 先跑 `web-design-guidelines`，再进行人工视觉检查。 | 修复高影响审查项后才推送预览。 |

## 八、明确排除项

本阶段不建议：把整站迁移至 React/Next、引入一套重型全局组件库、依赖已停止维护的 Shoelace、安装许可证不明确的审查技能、使用从截图复制而来的视觉模板，或以大量玻璃拟态/霓虹/粒子掩盖信息层级问题。

## 参考资料

1. U.S. Web Design System, [Design tokens](https://designsystem.digital.gov/design-tokens/)
2. U.S. Web Design System, [Typography](https://designsystem.digital.gov/components/typography/)
3. W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
4. Anthropic, [frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
5. Vercel Labs, [web-design-guidelines skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)
6. Superdesign, [superdesign-skill](https://github.com/superdesigndev/superdesign-skill)
7. Ashutos1997, [claude-design-auditor-skill](https://github.com/Ashutos1997/claude-design-auditor-skill)
8. Astro, [View transitions](https://docs.astro.build/en/guides/view-transitions/)
9. Floating UI, [Getting started](https://floating-ui.com/docs/getting-started)
10. Shoelace, [Documentation](https://shoelace.style/)
