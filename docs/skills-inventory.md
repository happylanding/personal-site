# CodeBuddy 技能清单（Skills Inventory）

> 维护者：CodeBuddy（协作 NPC）
> 更新时间：2026-08-08（第 3 版，新增多平台搜索的公众号/知乎写作技能）
> 关联：Issue #29（添加各种 skills）
> 说明：本文档沉淀 CodeBuddy 在当前环境中**实际可用**的技能清单、每个技能的作用与使用方法。所有技能均已通过**磁盘落盘验证**（存在合法 `SKILL.md`），无弄虚作假。

---

## 〇、当前环境说明（真实状态）

- ✅ 当前 `~/.agents/skills/` 下共有 **130 个技能**，全部具备合法 `SKILL.md`（含 `name` + `description` frontmatter），并已被 `npx skills list -g` 识别。
- ✅ 组成：
  - **16 个 CNB 官方技能**（`cnb.cool` 官方仓库，开箱即用，无需任何密钥）
  - **114 个第三方技能**：Issue 历史链接（superpowers / vercel-labs / hyperframes / caveman / UI·UX Pro Max / Anthropic / 网易文章 / 头条文章）84 个 + **本次多平台新搜索的公众号/知乎写作技能 30 个**，均已逐项重装并验证落盘。
- ⚠️ 按用户要求，**需要配置外部 API 密钥的技能已跳过**：
  - `gzh-explosive-content-detector`（公众号热门文章查询，需 RED FOX API Key）
  - `huashu-wechat-image`（封面配图 AI 模式，需 GEMINI API Key）
  - `aws-wechat-article-images`（公众号配图，需生图 API Key）
  - `aws-wechat-article-publish`（公众号 API 发布，需微信 APPID/APPSECRET）
  - `wechat-director`（视觉导演配图，需生图 API Key）
- ✅ 技能在**新会话启动时**注入生效。本文档中的技能下次新会话即可自动匹配使用。

---

## 一、技能总览（按来源分组）

### 🛠 CNB 官方技能（16 个，平台自带）

| # | 技能名 | 一句话用途 |
|---|--------|-----------|
| 1 | `cnb-api` | 操作 CNB 平台：Issue、PR、评论、CI、制品库读写 |
| 2 | `cnb-code-commit` | 按需求改代码 → 提交 → 推送 → 创建 PR |
| 3 | `cnb-code-review` | 对 PR 代码做专业评审（安全/Bug/质量） |
| 4 | `cnb-docs` | 查询 CNB 平台官方文档 |
| 5 | `cnb-npc-delegate` | 召唤其他 NPC 协同工作 |
| 6 | `cnb-npc-search` | 按关键词语义搜索公开 NPC 角色 |
| 7 | `cnb-pipeline` | 编写/修改/审查 `.cnb.yml` 流水线，诊断 CI 失败 |
| 8 | `cnb-plugin-market` | 搜索 CNB 插件市场并生成流水线插件配置 |
| 9 | `cnb-pr-diff` | 获取 PR 的 diff 变更信息 |
| 10 | `cnb-pr-summary` | 总结 PR 变更，生成结构化变更说明 |
| 11 | `cnb-repo-knowledge-base` | 检索指定仓库的知识库 |
| 12 | `cnb-self-hosted-runner` | 排查自托管 Runner 问题 |
| 13 | `cnb-tapd-resource-fetcher` | 获取 TAPD 需求/缺陷/任务/迭代 |
| 14 | `cnb-text-path-converter` | 把 Issue/PR 里相对路径转成绝对链接 |
| 15 | `cnb-upload-attachment` | 上传附件到 Issue 或 PR 评论 |
| 16 | `markitdown` | 把 PDF/Office/图片/网页转成干净 Markdown |

### 🧠 superpowers（obra/superpowers，14 个）—— AI 工程方法论

| 技能名 | 用途 | 怎么触发 |
|--------|------|---------|
| `brainstorming` | 动手前先澄清需求与设计 | 说"先帮我梳理下需求/设计" |
| `test-driven-development` | 先写测试再写实现（TDD） | 说"按 TDD 来" |
| `writing-plans` | 写实施计划 | 说"先写个计划" |
| `executing-plans` | 按计划逐步执行 | 说"按计划执行" |
| `systematic-debugging` | 系统性排障 | 遇到 bug 说"系统排查下" |
| `subagent-driven-development` | 子代理驱动的开发 | 说"用子代理做" |
| `dispatching-parallel-agents` | 并行派发多个子代理 | 说"并行处理" |
| `requesting-code-review` | 主动请求代码评审 | 说"帮我 review 代码" |
| `receiving-code-review` | 接收并处理评审意见 | review 后自动触发 |
| `verification-before-completion` | 完成前必须验证 | 说"验证一下再交付" |
| `using-git-worktrees` | 用 git worktree 并行开发 | 说"用 worktree 开分支" |
| `finishing-a-development-branch` | 收尾开发分支 | 说"收尾这个分支" |
| `writing-skills` | 编写/编辑/验证新 Skill | 说"帮我写个 Skill" |
| `using-superpowers` | superpowers 总入口/路由 | 新会话自动加载 |

### ⚡ vercel-labs/agent-skills（9 个）—— 部署与前端工程

| 技能名 | 用途 | 怎么触发 |
|--------|------|---------|
| `deploy-to-vercel` | 部署应用到 Vercel | 说"部署到 Vercel" |
| `vercel-optimize` | Vercel 成本/性能优化审计 | 说"优化下 Vercel 部署" |
| `vercel-cli-with-tokens` | 用 access token 操作 Vercel CLI/环境变量 | 说"配置 Vercel 环境变量" |
| `vercel-react-best-practices` | React/Next.js 性能优化指南 | 说"按 Vercel 最佳实践改" |
| `vercel-react-native-skills` | React Native / Expo 移动端最佳实践 | 移动端相关 |
| `vercel-react-view-transitions` | React View Transition 动效 | 说"加页面转场动效" |
| `vercel-composition-patterns` | React 可扩展组合模式 | 说"重构组件组合方式" |
| `web-design-guidelines` | UI 无障碍/性能/UX 合规审查（100+ 规则） | 说"审查 UI 合规性" |
| `writing-guidelines` | 文档/文案写作规范审查（80+ 规则） | 说"检查下文案规范" |

### 🎬 HyperFrames（heygen-com/hyperframes，25 个）—— HTML→视频

| 技能名 | 用途 |
|--------|------|
| `hyperframes` | 路由器+能力地图：任何「做视频/动画」先读它自动分发 |
| `hyperframes-core` | 合成契约（HTML→MP4 核心规范） |
| `hyperframes-animation` / `hyperframes-keyframes` | 动画与关键帧实现 |
| `hyperframes-cli` | CLI 渲染/预览/打包 |
| `hyperframes-registry` | 注册表组件安装/发现/接线 |
| `hyperframes-creative` | 非动画方向创意指导 |
| `media-use` | Agent Media OS 素材获取/处理/编码 |
| `motion-graphics` | 动效图形设计 |
| `general-video` | 通用视频制作 |
| `slideshow` | 幻灯片/轮播视频 |
| `figma` | 从 Figma 导入内容 |
| `embedded-captions` / `captions-overlay` | 字幕（内嵌/叠加） |
| `faceless-explainer` | 无脸讲解视频 |
| `music-to-video` | 音乐生成视频 |
| `pr-to-video` / `changelog-video` | PR/更新日志转视频 |
| `product-launch-video` | 产品发布视频 |
| `remotion-to-hyperframes` | Remotion 项目迁移 |
| `talking-head-recut` | 口播视频重剪 |
| `cut-the-curve` | 曲线剪辑技巧 |
| `motion-doctrine` | 动态设计原则 |
| `oversized-cursor` | 超大光标动效 |
| `seam-craft` | 无缝转场 |

> 触发方式：说"用 hyperframes 做个 xxx 视频"即可，核心路由器自动分发。

### 🦴 caveman（JuliusBrussee/caveman，7 个）—— 极简输出模式

| 技能名 | 用途 |
|--------|------|
| `caveman` | 核心压缩模式，输出 token 平均省 65%（lite/full/ultra/wenyan 多档） |
| `caveman-commit` | 极简 Conventional Commits 提交信息生成器 |
| `caveman-review` | 单行式 PR 评审评论（`L42: 🔴 bug: user null`） |
| `caveman-stats` | 统计会话 token 用量与节省金额 |
| `caveman-compress` | 压缩记忆类文件，输入 token 平均省 46% |
| `caveman-help` | 全部模式/命令速查卡 |
| `cavecrew` | 委派 caveman 风格子代理的决策指南 |

> 触发方式：说"caveman 模式"或"/caveman"进入；"normal mode"退出。

### 🎨 UI/UX Pro Max（nextlevelbuilder/ui-ux-pro-max-skill，7 个）—— 设计规范

| 技能名 | 用途 |
|--------|------|
| `ui-ux-pro-max` | 核心设计库：67+ 风格、161 色板、57 字体组合、99+ UX 规则、25 图表 |
| `ui-styling` | 基于 shadcn/ui 的美观可访问 UI 组件 |
| `design` | 品牌识别+设计令牌+logo 生成综合设计 |
| `design-system` | 三层令牌架构设计系统 |
| `brand` | 品牌语气、视觉识别、资产管理 |
| `banner-design` | 社交媒体/广告/网站 hero 横幅设计 |
| `slides` | HTML 演示文稿（Chart.js + 设计令牌） |

> 触发方式：说"用 UI/UX Pro Max 的 Glassmorphism 风格重做首页"等。内置 `astro.csv` 专项配置，与个人网站 Astro 技术栈对口。

### 🏛 Anthropic 官方（anthropics/skills，2 个）

| 技能名 | 用途 |
|--------|------|
| `frontend-design` | 官方出品，反「AI 审美套路」：拒绝 Inter/紫色渐变/对称网格 |
| `brand-guidelines` | Anthropic 官方品牌色板与字体规范 |

### 📊 内容创作（网易文章推荐，4 个开源 + 同仓库扩展）

| 技能名 | 来源仓库 | 用途 |
|--------|---------|------|
| `excalidraw-diagram` | coleam00/excalidraw-diagram-skill | 把内容绘制成可视化图表（流程图/思维导图/架构图），输出 `.excalidraw` / Mermaid `.md` |
| `html-ppt` | lewislulu/html-ppt-skill | HTML PPT 生成器：36 种主题 + 14 套 deck 模板，纯静态 HTML 键盘可操控 |
| `infocard` | markdown-viewer/skills | 把内容变成杂志级信息卡片（HTML/CSS 嵌入 Markdown），自动分析内容密度/情绪/配色/版式 |
| `wechat-article-to-markdown` | jackwener/wechat-article-to-markdown | 微信公众号文章转干净 Markdown（元数据+图片本地化+代码块），需 `uv tool install wechat-article-to-markdown` 装 CLI |

> 附带：`markdown-viewer/skills` 仓库还装上了同源的 **14 个可视化技能**（archimate、architecture、bpmn、canvas、cloud、data-analytics、graphviz、infographic、iot、mindmap、network、security、uml、vega），用于生成各类专业图表/架构图/思维导图。

### 📱 公众号工作流（头条文章推荐，无密钥部分）

| 技能名 | 来源 | 用途 |
|--------|------|------|
| `wechat-writer-kit` | SkillHub（@sophiayuan1984-jpg） | 公众号文章写作全流程助手：初始化账号画像→选题→成稿→存档，支持多账号 |
| `wechat-article-typeset` | SkillHub（@shiker1996） | 公众号预设主题排版：Markdown 一键渲染主题 + 生成可复制到公众号后台的预览链接 |
| SkillHub CLI | skillhub.cn | 国内优先的 Skill 商店 CLI（`skillhub search/install`） |

> 已按用户要求**跳过需密钥**的两个：`gzh-explosive-content-detector`（RED FOX API）、`huashu-wechat-image`（GEMINI API）。

### ✍️ 公众号/知乎写作技能（本次多平台新搜索，30 个）

> 2026-08-08 应 Galvin 要求，在 GitHub 等多平台检索「公众号/知乎写作模式」的 Skill，筛选出**无需外部密钥**的 30 个并全部安装验证。按能力分 5 组：

**① 公众号写作风格（2 个）**

| 技能名 | 来源仓库（溯源） | 用途 |
|--------|-----------------|------|
| `wechat-writing-style` | [yaoleifly/wechat-writing-style](https://github.com/yaoleifly/wechat-writing-style) | 微信公众号中文写作风格指南：结论先行、口语化高密度、短段落、具体化举例；润色/改写/敏感性审查/标题优化 |
| `wechat-writer` | [DavidLam-oss/wechat-writing-team](https://github.com/DavidLam-oss/wechat-writing-team) | 公众号写作全流程 v3.5：素材发芽→访谈挖掘→选题质检→正文写作→归档，支持 /write /interview /sprout /harvest 子命令 |

**② 公众号一条龙全流程（6 个，aiworkskills 套件）**

| 技能名 | 来源仓库（溯源） | 用途 |
|--------|-----------------|------|
| `aws-wechat-article-main` | [aiworkskills/wechat-article-skills](https://github.com/aiworkskills/wechat-article-skills) | 公众号一条龙总控入口：选题→写稿→审稿→排版→配图→发布 8 子 skill 串联 |
| `aws-wechat-article-topics` | 同上 | 公众号选题、爆款标题、热点追踪、系列策划 |
| `aws-wechat-article-writing` | 同上 | 公众号长文写作引擎：从提纲/话题生成初稿，改写/续写/润色/开头结尾优化 |
| `aws-wechat-article-review` | 同上 | 发布前合规审查：敏感词扫描、错别字、政治合规、平台规范校验 |
| `aws-wechat-article-formatting` | 同上 | Markdown 一键转公众号可粘贴 HTML，多主题/字号/段落样式 |
| `aws-wechat-article-assets` | 同上 | 业务资料库与 .aws 预设包：主题/配色/字体管理、素材入库 |

> 同仓库的 `aws-wechat-article-images`（需生图 Key）、`aws-wechat-article-publish`（需微信 API 密钥）、`aws-wechat-sticker`（配图）**已跳过**。

**③ 公众号长文磨稿系统（12 个，grindraft）**

| 技能名 | 来源仓库（溯源） | 用途 |
|--------|-----------------|------|
| `grindraft-init` / `grindraft-seed` | [Patrick-mufeng/grindraft-skill](https://github.com/Patrick-mufeng/grindraft-skill) | 磨稿系统初始化 / 选题种子库 |
| `grindraft-bump` | 同上 | 灵感增量、素材积累 |
| `grindraft-trends` / `grindraft-recommend` | 同上 | 热点趋势追踪 / 选题推荐 |
| `grindraft-format` / `grindraft-polish` | 同上 | 排版 / 润色打磨 |
| `grindraft-humanize` | 同上 | 去 AI 味、人性化改写 |
| `grindraft-persona` | 同上 | 账号人设 / 读者画像 |
| `grindraft-predict` / `grindraft-score-blind` / `grindraft-retro` | 同上 | 盲预测评分 / 发布后复盘进化（每写一篇下一篇更准） |
| `grindraft-publish` | 同上 | 发布输出 |

**④ 知乎写作（2 个）**

| 技能名 | 来源仓库（溯源） | 用途 |
|--------|-----------------|------|
| `salt-story` | [yfge/salt-story](https://github.com/yfge/salt-story) | 知乎盐选付费故事写作：反转、无 AI 味、对齐盐选官方投稿标准（1万-10万字短篇） |
| `zhiforge` | [yfge/zhiforge](https://github.com/yfge/zhiforge) | 知炼：知识库(Markdown博客)→知乎回答自动转化闭环（热点搜索→知识库匹配→撰写→审核→发布→回存） |

**⑤ 写作方法论 / 去 AI 味 / 多平台分发（8 个）**

| 技能名 | 来源仓库（溯源） | 用途 |
|--------|-----------------|------|
| `writing-assistant` | [Agentchengfeng/writing-assistant-skill](https://github.com/Agentchengfeng/writing-assistant-skill) | 自媒体写作交互式助手：用户画像 + 写作方法库 |
| `workflow-producer` | [dongbeixiaohuo/writing-agent](https://github.com/dongbeixiaohuo/writing-agent) | 中文长文/公众号/观点文工作流总导演（多阶段产物规划） |
| `style-modeler` | 同上 | 从作者文章样本建立/更新可复用写作风格档案 |
| `web-article-extractor` | 同上 | 网页文章素材提取 |
| `stop-ai-slop-zh` | [VincentOld/stop-slop-zh](https://github.com/VincentOld/stop-slop-zh) | 消除中文 AI 写作痕迹：拆排比三件套、去名词化、具体细节化 |
| `floodsung` | [floodsung/floodsung-skill](https://github.com/floodsung/floodsung-skill) | 知乎大 V 风格数字分身：用本人语料（152 文章+178 想法+254 回答）写作 |
| `content-pipeline` | [OrangeViolin/content-pipeline](https://github.com/OrangeViolin/content-pipeline) | 内容生产分发管线：素材→出稿→排版→封面→多平台转换（公众号/小红书/即刻/播客） |
| `publish-all` | [iPythoning/publish-all](https://github.com/iPythoning/publish-all) | 一篇 Markdown 分发多平台：博客+公众号 Word+知乎 Markdown+小红书文案 |

---

## 二、按「你想做的事」快速索引

| 你想做的事 | 找这个技能 |
|-----------|-----------|
| 在 CNB 上管理 Issue/PR/评论/CI | `cnb-api` |
| 改代码并提 PR / 评审 PR | `cnb-code-commit` / `cnb-code-review` |
| 部署到 Vercel、优化部署成本 | `deploy-to-vercel` / `vercel-optimize` |
| 审查网页 UI 的无障碍/性能/UX | `web-design-guidelines` |
| 让界面变好看（风格库） | `ui-ux-pro-max` / `frontend-design` |
| 做视频 / 动画 / 幻灯片 | `hyperframes`（路由器自动分发） |
| 画流程图 / 思维导图 / 架构图 | `excalidraw-diagram` 或 markdown-viewer 系列 |
| 做 PPT / 信息卡片 | `html-ppt` / `infocard` |
| 写公众号文章 / 排版 | `wechat-writer-kit` / `wechat-article-typeset` / `aws-wechat-article-main` / `wechat-writing-style` |
| 公众号一条龙（选题→写→审→排） | `aws-wechat-article-main`（总控）/ `aws-wechat-article-topics` / `aws-wechat-article-review` / `aws-wechat-article-formatting` |
| 公众号长文磨稿 / 复盘进化 | `grindraft-init` → ... → `grindraft-retro`（12 个系列） |
| 写知乎盐选付费故事 | `salt-story` |
| 知识库转知乎回答 | `zhiforge` |
| 去除 AI 味（中文） | `stop-ai-slop-zh` / `grindraft-humanize` |
| 模仿某作者风格写作 | `style-modeler` / `floodsung` / `wechat-writing-style` |
| 一篇稿子分发多平台 | `content-pipeline` / `publish-all` |
| 公众号文章转 Markdown | `wechat-article-to-markdown` |
| 开发前澄清需求 / 按 TDD 写代码 | `brainstorming` / `test-driven-development` |
| 系统性排障 | `systematic-debugging` |
| 让回复更简洁（省 token） | `caveman` |
| PDF/Office/网页转 Markdown | `markitdown` |
| 排查自托管 Runner / 流水线 | `cnb-self-hosted-runner` / `cnb-pipeline` |

---

## 三、注意事项

1. **新会话生效**：技能清单在会话启动时注入，新装的技能在**新会话**中自动可用。
2. **密钥依赖**：当前所有已装技能**均无需外部 API 密钥**（需密钥的已按用户要求跳过）。
3. **升级方式**：`npx skills update` 一键升级 GitHub 来源技能；SkillHub 来源技能用 `skillhub` 重新安装。
4. **提及 vs 召唤**：评论中 `@npc` 会召唤 NPC 干活；只提及不召唤时用反引号包裹（\`@npc\`）。
5. **UI/UX Pro Max CLI**：`uipro` v2.14.1 已全局安装，可用 `uipro update` 升级。
6. **wechat-article-to-markdown**：使用前需先 `uv tool install wechat-article-to-markdown` 安装 CLI 工具。
