#!/bin/bash
# 生成 Vibe Coding 文章正文配图（章节插图，统一星野极光风格）
set -e
DIR=/workspace/public/images/vibe-coding
mkdir -p "$DIR"

# ============ 图2：人机分工 ============
cat > "$DIR/division-of-labor.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.12" cy="0.15" r="0.9">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#16a34a" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#16a34a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.88" cy="0.88" r="0.9">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0.20"/>
      <stop offset="60%" stop-color="#b45309" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <g fill="#ffffff">
    <circle cx="140" cy="70" r="1.6" opacity="0.5"/><circle cx="380" cy="120" r="1.1" opacity="0.35"/>
    <circle cx="620" cy="60" r="1.5" opacity="0.45"/><circle cx="860" cy="110" r="1.2" opacity="0.35"/>
    <circle cx="1080" cy="70" r="1.6" opacity="0.5"/><circle cx="250" cy="400" r="1.0" opacity="0.25"/>
    <circle cx="960" cy="520" r="1.3" opacity="0.25"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#16a34a" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#16a34a" opacity="0.35"/>
  <text x="60" y="150" font-family="monospace" font-size="18" letter-spacing="5" fill="#16a34a">WE DIVIDE THE WORK</text>
  <text x="60" y="216" font-family="Noto Serif CJK SC" font-size="48" font-weight="bold" fill="#ffffff">我们怎么分工</text>
  <text x="60" y="262" font-family="Noto Sans CJK SC" font-size="22" fill="#a3a3a3">我负责描述想法与决策，AI 负责写代码与验证</text>

  <!-- 左侧卡片：传统开发 -->
  <g>
    <rect x="60" y="310" width="500" height="260" rx="16" fill="#161616" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="358" font-family="Noto Sans CJK SC" font-size="24" font-weight="bold" fill="#d4d4d4">传统开发</text>
    <line x1="92" y1="374" x2="528" y2="374" stroke="#ffffff" stroke-opacity="0.08"/>
    <text x="92" y="414" font-family="Noto Sans CJK SC" font-size="20" fill="#a3a3a3">✗ 我写代码，谷歌查文档</text>
    <text x="92" y="452" font-family="Noto Sans CJK SC" font-size="20" fill="#a3a3a3">✗ Ctrl+C / Ctrl+V 复制粘贴</text>
    <text x="92" y="490" font-family="Noto Sans CJK SC" font-size="20" fill="#a3a3a3">✗ 运行 → 报错 → 看日志 → 改</text>
    <text x="92" y="528" font-family="Noto Sans CJK SC" font-size="20" fill="#a3a3a3">✗ "这个 Bug 修了 3 个小时"</text>
  </g>

  <!-- 中间箭头 -->
  <g transform="translate(588,430)">
    <line x1="0" y1="0" x2="46" y2="0" stroke="#16a34a" stroke-width="3"/>
    <polygon points="46,-7 60,0 46,7" fill="#16a34a"/>
  </g>

  <!-- 右侧卡片：我们的方式 -->
  <g>
    <rect x="640" y="310" width="500" height="260" rx="16" fill="#121a14" stroke="#16a34a" stroke-opacity="0.4"/>
    <text x="672" y="358" font-family="Noto Sans CJK SC" font-size="24" font-weight="bold" fill="#4ade80">我们的方式</text>
    <line x1="672" y1="374" x2="1108" y2="374" stroke="#16a34a" stroke-opacity="0.15"/>
    <text x="672" y="414" font-family="Noto Sans CJK SC" font-size="20" fill="#d1fae5">✓ 我描述想法，AI 写代码</text>
    <text x="672" y="452" font-family="Noto Sans CJK SC" font-size="20" fill="#d1fae5">✓ AI 直接修改项目文件</text>
    <text x="672" y="490" font-family="Noto Sans CJK SC" font-size="20" fill="#d1fae5">✓ AI 构建 → 截图验证 → 定位</text>
    <text x="672" y="528" font-family="Noto Sans CJK SC" font-size="20" fill="#d1fae5">✓ "描述症状，3 轮对话解决"</text>
  </g>
</svg>
EOF

# ============ 图3：五个阶段 ============
cat > "$DIR/five-stages.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#16a34a" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#16a34a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.8" cy="0.9" r="0.8">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <g fill="#ffffff">
    <circle cx="100" cy="90" r="1.5" opacity="0.45"/><circle cx="300" cy="60" r="1.1" opacity="0.35"/>
    <circle cx="520" cy="100" r="1.4" opacity="0.4"/><circle cx="760" cy="60" r="1.2" opacity="0.35"/>
    <circle cx="980" cy="90" r="1.5" opacity="0.45"/><circle cx="1150" cy="140" r="1.1" opacity="0.3"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#16a34a" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#16a34a" opacity="0.35"/>
  <text x="60" y="150" font-family="monospace" font-size="18" letter-spacing="5" fill="#16a34a">FIVE STAGES</text>
  <text x="60" y="216" font-family="Noto Serif CJK SC" font-size="48" font-weight="bold" fill="#ffffff">五个阶段：从零到上线</text>
  <text x="60" y="262" font-family="Noto Sans CJK SC" font-size="22" fill="#a3a3a3">约 14 小时，完成 55+ 双语页面</text>

  <!-- 时间线 -->
  <line x1="120" y1="430" x2="1080" y2="430" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>

  <!-- 节点1 -->
  <circle cx="140" cy="430" r="14" fill="#0c0c0c" stroke="#16a34a" stroke-width="3"/>
  <text x="140" y="400" font-family="Noto Sans CJK SC" font-size="22" font-weight="bold" fill="#4ade80" text-anchor="middle">搭骨架</text>
  <text x="140" y="478" font-family="Noto Sans CJK SC" font-size="18" fill="#d4d4d4" text-anchor="middle">约 2 小时</text>
  <text x="140" y="508" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">选型 Astro · 目录结构</text>
  <text x="140" y="530" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">数据模型 · 4 专栏页</text>

  <!-- 节点2 -->
  <circle cx="375" cy="430" r="14" fill="#0c0c0c" stroke="#16a34a" stroke-width="3"/>
  <text x="375" y="400" font-family="Noto Sans CJK SC" font-size="22" font-weight="bold" fill="#4ade80" text-anchor="middle">核心功能</text>
  <text x="375" y="478" font-family="Noto Sans CJK SC" font-size="18" fill="#d4d4d4" text-anchor="middle">约 1 小时</text>
  <text x="375" y="508" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">中英双语 · 明暗主题</text>
  <text x="375" y="530" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">全文搜索 · 表格视图</text>

  <!-- 节点3 -->
  <circle cx="610" cy="430" r="14" fill="#0c0c0c" stroke="#16a34a" stroke-width="3"/>
  <text x="610" y="400" font-family="Noto Sans CJK SC" font-size="22" font-weight="bold" fill="#4ade80" text-anchor="middle">磨页面</text>
  <text x="610" y="478" font-family="Noto Sans CJK SC" font-size="18" fill="#d4d4d4" text-anchor="middle">约 4 小时</text>
  <text x="610" y="508" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">对话最密集的阶段</text>
  <text x="610" y="530" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">像一场即兴演奏</text>

  <!-- 节点4 -->
  <circle cx="845" cy="430" r="14" fill="#0c0c0c" stroke="#b45309" stroke-width="3"/>
  <text x="845" y="400" font-family="Noto Sans CJK SC" font-size="22" font-weight="bold" fill="#fbbf24" text-anchor="middle">手机适配</text>
  <text x="845" y="478" font-family="Noto Sans CJK SC" font-size="18" fill="#d4d4d4" text-anchor="middle">约 6 小时 · 最艰难</text>
  <text x="845" y="508" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">汉堡菜单迭代 4 版</text>
  <text x="845" y="530" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">每步都有根因分析</text>

  <!-- 节点5 -->
  <circle cx="1080" cy="430" r="14" fill="#0c0c0c" stroke="#16a34a" stroke-width="3"/>
  <text x="1080" y="400" font-family="Noto Sans CJK SC" font-size="22" font-weight="bold" fill="#4ade80" text-anchor="middle">部署上线</text>
  <text x="1080" y="478" font-family="Noto Sans CJK SC" font-size="18" fill="#d4d4d4" text-anchor="middle">约 1 小时</text>
  <text x="1080" y="508" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">GitHub + Cloudflare</text>
  <text x="1080" y="530" font-family="Noto Sans CJK SC" font-size="15" fill="#737373" text-anchor="middle">1-2 分钟自动上线</text>
</svg>
EOF

# ============ 图4：四种配合方式 ============
cat > "$DIR/four-modes.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.2" r="0.95">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#16a34a" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#16a34a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <g fill="#ffffff">
    <circle cx="180" cy="80" r="1.5" opacity="0.45"/><circle cx="500" cy="60" r="1.1" opacity="0.35"/>
    <circle cx="820" cy="100" r="1.4" opacity="0.4"/><circle cx="1100" cy="70" r="1.2" opacity="0.35"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#16a34a" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#16a34a" opacity="0.35"/>
  <text x="60" y="150" font-family="monospace" font-size="18" letter-spacing="5" fill="#16a34a">FOUR WAYS WE COLLABORATE</text>
  <text x="60" y="216" font-family="Noto Serif CJK SC" font-size="48" font-weight="bold" fill="#ffffff">四种深度配合方式</text>
  <text x="60" y="262" font-family="Noto Sans CJK SC" font-size="22" fill="#a3a3a3">比"问一句、答一句"复杂得多</text>

  <!-- 2x2 卡片 -->
  <g>
    <rect x="60" y="310" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="356" font-family="Noto Serif CJK SC" font-size="26" font-weight="bold" fill="#4ade80">01 截图驱动</text>
    <text x="92" y="396" font-family="Noto Sans CJK SC" font-size="18" fill="#a3a3a3">截图丢给 AI，说一句"你看，这不对"</text>
    <text x="92" y="422" font-family="Noto Sans CJK SC" font-size="18" fill="#737373">AI 定位源码 → 分析 → 修改 → 验证</text>
  </g>
  <g>
    <rect x="620" y="310" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="652" y="356" font-family="Noto Serif CJK SC" font-size="26" font-weight="bold" fill="#4ade80">02 感受驱动</text>
    <text x="652" y="396" font-family="Noto Sans CJK SC" font-size="18" fill="#a3a3a3">"间距太大""动画不流畅""颜色柔和些"</text>
    <text x="652" y="422" font-family="Noto Sans CJK SC" font-size="18" fill="#737373">主观表达 → 翻译成 padding/transition 修改</text>
  </g>
  <g>
    <rect x="60" y="458" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="504" font-family="Noto Serif CJK SC" font-size="26" font-weight="bold" fill="#4ade80">03 试探式探索</text>
    <text x="92" y="544" font-family="Noto Sans CJK SC" font-size="18" fill="#a3a3a3">"手机端菜单一般怎么做？"</text>
    <text x="92" y="570" font-family="Noto Sans CJK SC" font-size="18" fill="#737373">AI 给方案，我选一个，它实施</text>
  </g>
  <g>
    <rect x="620" y="458" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="652" y="504" font-family="Noto Serif CJK SC" font-size="26" font-weight="bold" fill="#4ade80">04 翻译 + 审校</text>
    <text x="652" y="544" font-family="Noto Sans CJK SC" font-size="18" fill="#a3a3a3">界面文案我写中文，AI 翻成英文</text>
    <text x="652" y="570" font-family="Noto Sans CJK SC" font-size="18" fill="#737373">导航、按钮、404、SEO 全覆盖</text>
  </g>
</svg>
EOF

# ============ 图5：四个最难的问题 ============
cat > "$DIR/four-problems.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.25" r="0.95">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0.26"/>
      <stop offset="60%" stop-color="#b45309" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <g fill="#ffffff">
    <circle cx="120" cy="80" r="1.5" opacity="0.45"/><circle cx="420" cy="60" r="1.1" opacity="0.35"/>
    <circle cx="760" cy="100" r="1.4" opacity="0.4"/><circle cx="1100" cy="70" r="1.2" opacity="0.35"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#b45309" opacity="0.8"/>
  <rect x="66" y="52" width="2" height="60" fill="#b45309" opacity="0.4"/>
  <text x="60" y="150" font-family="monospace" font-size="18" letter-spacing="5" fill="#b45309">FOUR HARDEST PROBLEMS</text>
  <text x="60" y="216" font-family="Noto Serif CJK SC" font-size="48" font-weight="bold" fill="#ffffff">四个最难的问题</text>
  <text x="60" y="262" font-family="Noto Sans CJK SC" font-size="22" fill="#a3a3a3">每一个都是从"现象 → 分析 → 方案"走出来的</text>

  <g font-family="Noto Sans CJK SC">
    <rect x="60" y="312" width="1080" height="62" rx="12" fill="#171310" stroke="#b45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="343" r="16" fill="#b45309" opacity="0.9"/>
    <text x="98" y="350" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">1</text>
    <text x="140" y="338" font-size="22" font-weight="bold" fill="#fbbf24">overflow-x: hidden 的连锁反应</text>
    <text x="140" y="362" font-size="17" fill="#a3a3a3">一个看似无害的 CSS 属性，引发跨文件的问题</text>

    <rect x="60" y="386" width="1080" height="62" rx="12" fill="#171310" stroke="#b45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="417" r="16" fill="#b45309" opacity="0.9"/>
    <text x="98" y="424" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">2</text>
    <text x="140" y="412" font-size="22" font-weight="bold" fill="#fbbf24">两个按钮的光学重叠</text>
    <text x="140" y="436" font-size="17" fill="#a3a3a3">z-index 分布不合理 → 汉堡按钮动画变 X，位置统一</text>

    <rect x="60" y="460" width="1080" height="62" rx="12" fill="#171310" stroke="#b45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="491" r="16" fill="#b45309" opacity="0.9"/>
    <text x="98" y="498" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">3</text>
    <text x="140" y="486" font-size="22" font-weight="bold" fill="#fbbf24">点击空白无法关闭</text>
    <text x="140" y="510" font-size="17" fill="#a3a3a3">"overlay 内任意点击都关闭"——11 行代码变 4 行</text>

    <rect x="60" y="534" width="1080" height="62" rx="12" fill="#171310" stroke="#b45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="565" r="16" fill="#b45309" opacity="0.9"/>
    <text x="98" y="572" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">4</text>
    <text x="140" y="560" font-size="22" font-weight="bold" fill="#fbbf24">Cloudflare Pages 子域名误解</text>
    <text x="140" y="584" font-size="17" fill="#a3a3a3">显示名和 .pages.dev 子域名分离 → 删除重建拿回 galvinai</text>
  </g>
</svg>
EOF

# 批量转 PNG
for f in "$DIR"/division-of-labor.svg "$DIR"/five-stages.svg "$DIR"/four-modes.svg "$DIR"/four-problems.svg; do
  rsvg-convert -o "${f%.svg}.png" "$f"
done
echo "=== done ==="
ls -la "$DIR"