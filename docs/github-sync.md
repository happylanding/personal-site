# CNB → GitHub 自动同步方案

> 目标：在 CNB 仓库 `Galvin2026/personal-site` 完成的代码改动，自动推送到 GitHub 仓库 `happylanding/personal-site`，从而触发 Cloudflare Pages 自动构建部署。

---

## 一、链路总览

```
CNB Galvin2026/personal-site        ← 开发 / 提交 / 构建验证（所有改动都在这里）
        │ ① push 到 main 自动触发
        │ ② 每日 02:00 定时兜底
        ▼
   git-sync 插件（CNB 官方镜像 tencentcom/git-sync）
        │ 携带 GitHub Access Token 推送 main 分支
        ▼
GitHub happylanding/personal-site   ← Cloudflare Pages 连接源
        │ Cloudflare 检测到 push，自动构建
        ▼
Cloudflare Pages → https://galvinai.pages.dev
```

**一句话总结**：`.cnb.yml` 里配置了一条「构建验证 + git-sync 同步」流水线，每次你 push 到 CNB 的 `main`，流水线先跑一遍 `npm run build` 验证，通过后自动把 `main` 推送到 GitHub，Cloudflare 随即自动上线。**全程无需手动操作。**

---

## 二、一次性配置（约 5 分钟，只需做一次）

### 第 1 步：在 GitHub 生成 Personal Access Token（PAT）

1. 打开 GitHub → 右上角头像 → **Settings** → 底部 **Developer settings**
2. 进入 **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
3. 填写 Note（如 `CNB sync`），Expiration 自选（建议 90 天，到期提醒续期）
4. **勾选权限**：只需 `repo`（勾选后会展开 `repo:status`、`repo_deployment`、`public_repo` 等子项，`public_repo` 已够用，因为你的仓库是公开的）
5. 点击 **Generate token**，**立即复制**生成的 `ghp_...` 字符串（只显示这一次，关闭页面后就看不到了）

> ⚠️ Token 相当于 GitHub 密码，请妥善保管，不要提交到代码仓库、不要贴到评论里。

### 第 2 步：在 CNB 创建「密钥仓库」存放 Token

1. 打开 https://cnb.cool/new/repos
2. **仓库类型**选择 **`密钥仓库`**（高安全等级，禁止本地克隆，仅 Web 界面可编辑，支持流水线引用与审计）
3. 填写仓库名（如 `secret`）、描述，创建
4. 在密钥仓库中新建文件 `github-sync.yml`，内容：

```yaml
GITHUB_USERNAME: happylanding
GITHUB_ACCESS_TOKEN: ghp_你的token
```

5. 保存。密钥仓库文件仅支持 Web 界面编辑，且带水印与审计日志，比明文放普通仓库安全得多。

> 参考：CNB 密钥仓库文档 https://docs.cnb.cool/zh/repo/secret.md

### 第 3 步：把密钥仓库地址填进 `.cnb.yml`

打开仓库根目录的 `.cnb.yml`，找到两处 `imports:`，把 `<密钥仓库路径>` 替换成你的实际地址：

```
https://cnb.cool/Galvin2026/secret/-/blob/main/github-sync.yml
```

（即 `https://cnb.cool/<组织>/<密钥仓库名>/-/blob/main/github-sync.yml`）

### 第 4 步：提交生效

```bash
git add .cnb.yml
git commit -m "ci: 配置 CNB→GitHub 自动同步"
git push origin main
```

推送后流水线自动运行：构建验证 → 同步 GitHub → Cloudflare 部署。

---

## 三、日常使用

之后**不需要任何额外操作**。在 CNB 完成改动、合并到 `main` 后：

| 环节 | 谁来做 |
|------|--------|
| 构建验证（`npm run build`） | CNB 流水线自动 |
| 推送到 GitHub | CNB 流水线自动（git-sync） |
| Cloudflare 重新部署 | GitHub 检测到 push 自动 |

**唯一例外**：如果某次流水线失败（如 GitHub Token 过期、构建报错），需要查看 CNB 流水线日志定位原因；修复后重新 push 即可自动重试。

---

## 四、方案细节说明

### 1. 为什么用 git-sync 插件而不是自己写脚本？

`tencentcom/git-sync` 是 CNB **官方**迁移工具里提供的跨 Git 平台同步插件（参考 [迁移工具文档](https://docs.cnb.cool/zh/guide/migration-tools.md)），专门做「从 CNB 同步到 GitHub」这类场景：
- 通过 HTTPS 认证，天然支持 GitHub Token
- 参数化配置（目标仓库 / 分支 / 强制推送 / 自定义提交者），无需手写 git 命令
- 与密钥仓库 `imports` 机制无缝配合，Token 不落仓库、不进日志

### 2. 为什么 push 事件只同步 main？

`main` 是 Cloudflare 连接的部署分支。临时分支（如 `auto/fix-xxx`）如果也推上去，会污染 GitHub 仓库且触发无意义的 Cloudflare 构建。所以：
- `main.push` → 构建 + 同步
- 其他分支 push → 只构建验证，不同步
- 每天 02:00 定时任务兜底同步一次，防止漏推

### 3. 为什么需要定时任务兜底？

正常情况下 push 触发就够了。定时任务是「双保险」：万一某次 push 事件流水线因网络抖动等失败，第二天凌晨会自动补一次同步，保证 GitHub 与 CNB 一致。

### 4. 关于 force push

git-sync 默认非 force。若后续遇到「CNB 与 GitHub 历史分叉」需要强推，可在同步任务 settings 里加 `force: true`。正常情况下不需要。

### 5. 关于初始历史

当前 CNB 仓库与 GitHub 仓库**没有共享 Git 历史**（CNB 是从 P0 源码导入新建的，GitHub 上另有原始提交）。git-sync 首次推送 `main` 时会把 CNB 的 `main` 整体推上去，属于**覆盖式推送**——Cloudflare 直接基于新历史构建，线上内容一致，无需担心。

> 如果你希望**保留 GitHub 原始提交历史**（把 CNB 的历史叠在 GitHub 历史之上），改用 `sync_mode: rebase` 即可（见下方「可选配置」）。但注意 CNB 与 GitHub 的文件集有少量差异（CNB 多了 `docs/`、`ArticleTOC.astro` 等），rebase 可能产生冲突，需要人工处理一次。**默认建议直接覆盖式（push 模式）**，简单干净。

---

## 五、可选配置

### 5.1 改用 rebase 模式保留 GitHub 历史

```yaml
- name: sync-to-github
  image: tencentcom/git-sync
  settings:
    target_url: https://github.com/happylanding/personal-site.git
    auth_type: https
    username: ${GITHUB_USERNAME}
    password: ${GITHUB_ACCESS_TOKEN}
    branch: main
    sync_mode: rebase   # 保留目标仓库中 GitHub 特有的文件/历史
```

### 5.2 同步所有分支 / 标签

```yaml
settings:
  # 不写 branch 则同步所有分支
  push_tags: true       # 同时推送标签
```

### 5.3 不同环境用不同 Token

可在密钥仓库中放多份文件（如 `github-sync-prod.yml`、`github-sync-dev.yml`），按流水线分别 `imports` 引用，符合最小权限原则。

---

## 六、故障排查速查表

| 现象 | 可能原因 | 处理 |
|------|---------|------|
| 流水线报 `Authentication failed` | Token 失效/权限不足 | 在 GitHub 重新生成 PAT，更新密钥仓库文件 |
| 流水线报 `build` 阶段失败 | 代码构建报错 | 查看流水线日志，修复代码后重新 push |
| Cloudflare 没触发部署 | GitHub 未收到推送 / Cloudflare 连接问题 | 先查 CNB 流水线日志确认同步是否成功；再到 GitHub 仓库 Commits 页看有没有新提交；最后到 Cloudflare Pages → Deployments 查看 |
| 同步成功但线上无变化 | 构建缓存 | 到 Cloudflare Pages → Deployments 手动触发 Retry |

---

## 七、相关链接

- CNB 密钥仓库文档：https://docs.cnb.cool/zh/repo/secret.md
- CNB 文件引用（imports）文档：https://docs.cnb.cool/zh/build/file-reference.md
- CNB 迁移工具（含 Git Sync）：https://docs.cnb.cool/zh/guide/migration-tools.md
- git-sync 插件源码：https://cnb.cool/cnb/plugins/tencentcom/git-sync
