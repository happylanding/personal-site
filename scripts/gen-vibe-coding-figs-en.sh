#!/bin/bash
# 生成 Vibe Coding 文章英文版正文配图（章节插图，统一星野极光风格）
# 与中文版 gen-vibe-coding-figs.sh 同构图，文字全部英文（Times New Roman 优先 + 宋体回退）
# 用法：bash scripts/gen-vibe-coding-figs-en.sh
set -e
DIR=/workspace/public/images/vibe-coding
mkdir -p "$DIR"

# 英文插图文件命名约定：<图名>-en.svg / <图名>-en.png
# （对应中文版 <图名>.svg / <图名>.png，英文正文引用 -en 版本）

# ============ 图2-EN：人机分工 ============
cat > "$DIR/division-of-labor-en.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.12" cy="0.15" r="0.9">
      <stop offset="0%" stop-color="#B45309" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#B45309" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.88" cy="0.88" r="0.9">
      <stop offset="0%" stop-color="#4ADE80" stop-opacity="0.20"/>
      <stop offset="60%" stop-color="#4ADE80" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#4ADE80" stop-opacity="0"/>
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
  <rect x="60" y="52" width="2" height="60" fill="#B45309" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#B45309" opacity="0.35"/>
  <line x1="76" y1="52" x2="76" y2="112" stroke="#B45309" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="94" cy="68" r="3" fill="#B45309" opacity="0.85"/>
  <circle cx="94" cy="82" r="3" fill="#B45309" opacity="0.5"/>
  <circle cx="94" cy="96" r="3" fill="#B45309" opacity="0.25"/>
  <text x="60" y="150" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" letter-spacing="5" fill="#FBBF24">WE DIVIDE THE WORK</text>
  <text x="60" y="216" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="48" font-weight="bold" fill="#ffffff">How We Divided the Work</text>
  <text x="60" y="262" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" fill="#a3a3a3">I describe ideas and make decisions; AI writes code and verifies</text>

  <!-- 左侧卡片：传统开发 -->
  <g>
    <rect x="60" y="310" width="500" height="260" rx="16" fill="#161616" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="358" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="24" font-weight="bold" fill="#d4d4d4">Traditional Dev</text>
    <line x1="92" y1="374" x2="528" y2="374" stroke="#ffffff" stroke-opacity="0.08"/>
    <text x="92" y="414" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#a3a3a3">✗ I write code, Google for docs</text>
    <text x="92" y="452" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#a3a3a3">✗ Ctrl+C / Ctrl+V copy-paste</text>
    <text x="92" y="490" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#a3a3a3">✗ Run → error → check logs → fix</text>
    <text x="92" y="528" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#a3a3a3">✗ "This bug took 3 hours to fix"</text>
  </g>

  <!-- 中间箭头 -->
  <g transform="translate(588,430)">
    <line x1="0" y1="0" x2="46" y2="0" stroke="#B45309" stroke-width="3"/>
    <polygon points="46,-7 60,0 46,7" fill="#B45309"/>
  </g>

  <!-- 右侧卡片：我们的方式 -->
  <g>
    <rect x="640" y="310" width="500" height="260" rx="16" fill="#1C1917" stroke="#B45309" stroke-opacity="0.4"/>
    <text x="672" y="358" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="24" font-weight="bold" fill="#FBBF24">Our Way</text>
    <line x1="672" y1="374" x2="1108" y2="374" stroke="#B45309" stroke-opacity="0.15"/>
    <text x="672" y="414" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#FEF3C7">✓ I describe ideas, AI writes code</text>
    <text x="672" y="452" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#FEF3C7">✓ AI edits project files directly</text>
    <text x="672" y="490" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#FEF3C7">✓ AI builds → verifies → pinpoints</text>
    <text x="672" y="528" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" fill="#FEF3C7">✓ "Solved in 3 rounds of dialogue"</text>
  </g>
</svg>
EOF

# ============ 图3-EN：五个阶段 ============
cat > "$DIR/five-stages-en.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="#B45309" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#B45309" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.8" cy="0.9" r="0.8">
      <stop offset="0%" stop-color="#4ADE80" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#4ADE80" stop-opacity="0"/>
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
  <rect x="60" y="52" width="2" height="60" fill="#B45309" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#B45309" opacity="0.35"/>
  <line x1="76" y1="52" x2="76" y2="112" stroke="#B45309" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="94" cy="68" r="3" fill="#B45309" opacity="0.85"/>
  <circle cx="94" cy="82" r="3" fill="#B45309" opacity="0.5"/>
  <circle cx="94" cy="96" r="3" fill="#B45309" opacity="0.25"/>
  <text x="60" y="150" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" letter-spacing="5" fill="#FBBF24">FIVE STAGES</text>
  <text x="60" y="216" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="48" font-weight="bold" fill="#ffffff">Five Stages: From Zero to Launch</text>
  <text x="60" y="262" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" fill="#a3a3a3">About 14 hours, 55+ bilingual pages</text>

  <!-- 时间线 -->
  <line x1="120" y1="430" x2="1080" y2="430" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>

  <!-- 节点1 -->
  <circle cx="140" cy="430" r="14" fill="#0c0c0c" stroke="#B45309" stroke-width="3"/>
  <text x="140" y="400" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" font-weight="bold" fill="#FBBF24" text-anchor="middle">Skeleton</text>
  <text x="140" y="478" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#d4d4d4" text-anchor="middle">~2 hrs</text>
  <text x="140" y="508" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">Astro · structure</text>
  <text x="140" y="530" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">data · 4 sections</text>

  <!-- 节点2 -->
  <circle cx="375" cy="430" r="14" fill="#0c0c0c" stroke="#B45309" stroke-width="3"/>
  <text x="375" y="400" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" font-weight="bold" fill="#FBBF24" text-anchor="middle">Core Features</text>
  <text x="375" y="478" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#d4d4d4" text-anchor="middle">~1 hr</text>
  <text x="375" y="508" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">bilingual · themes</text>
  <text x="375" y="530" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">search · table view</text>

  <!-- 节点3 -->
  <circle cx="610" cy="430" r="14" fill="#0c0c0c" stroke="#B45309" stroke-width="3"/>
  <text x="610" y="400" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" font-weight="bold" fill="#FBBF24" text-anchor="middle">Polish Pages</text>
  <text x="610" y="478" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#d4d4d4" text-anchor="middle">~4 hrs</text>
  <text x="610" y="508" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">most dense phase</text>
  <text x="610" y="530" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">like an improv jam</text>

  <!-- 节点4 -->
  <circle cx="845" cy="430" r="14" fill="#0c0c0c" stroke="#4ADE80" stroke-width="3"/>
  <text x="845" y="400" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" font-weight="bold" fill="#fbbf24" text-anchor="middle">Mobile Fixes</text>
  <text x="845" y="478" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#d4d4d4" text-anchor="middle">~6 hrs · hardest</text>
  <text x="845" y="508" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">menu · 4 versions</text>
  <text x="845" y="530" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">root-cause each step</text>

  <!-- 节点5 -->
  <circle cx="1080" cy="430" r="14" fill="#0c0c0c" stroke="#B45309" stroke-width="3"/>
  <text x="1080" y="400" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" font-weight="bold" fill="#FBBF24" text-anchor="middle">Deploy</text>
  <text x="1080" y="478" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#d4d4d4" text-anchor="middle">~1 hr</text>
  <text x="1080" y="508" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">GitHub + Cloudflare</text>
  <text x="1080" y="530" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="15" fill="#737373" text-anchor="middle">live in 1-2 min</text>
</svg>
EOF

# ============ 图4-EN：四种配合方式 ============
cat > "$DIR/four-modes-en.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.2" r="0.95">
      <stop offset="0%" stop-color="#B45309" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#B45309" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <g fill="#ffffff">
    <circle cx="180" cy="80" r="1.5" opacity="0.45"/><circle cx="500" cy="60" r="1.1" opacity="0.35"/>
    <circle cx="820" cy="100" r="1.4" opacity="0.4"/><circle cx="1100" cy="70" r="1.2" opacity="0.35"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#B45309" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="60" fill="#B45309" opacity="0.35"/>
  <line x1="76" y1="52" x2="76" y2="112" stroke="#B45309" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="94" cy="68" r="3" fill="#B45309" opacity="0.85"/>
  <circle cx="94" cy="82" r="3" fill="#B45309" opacity="0.5"/>
  <circle cx="94" cy="96" r="3" fill="#B45309" opacity="0.25"/>
  <text x="60" y="150" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" letter-spacing="5" fill="#FBBF24">FOUR WAYS WE COLLABORATE</text>
  <text x="60" y="216" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="48" font-weight="bold" fill="#ffffff">Four Ways of Deep Collaboration</text>
  <text x="60" y="262" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" fill="#a3a3a3">Far more complex than "ask one, answer one"</text>

  <!-- 2x2 卡片 -->
  <g>
    <rect x="60" y="310" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="356" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="26" font-weight="bold" fill="#FBBF24">01 Screenshot-Driven</text>
    <text x="92" y="396" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#a3a3a3">Drop a screenshot and say "look, this is wrong"</text>
    <text x="92" y="422" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#737373">AI locates source → analyzes → fixes → verifies</text>
  </g>
  <g>
    <rect x="620" y="310" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="652" y="356" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="26" font-weight="bold" fill="#FBBF24">02 Feeling-Driven</text>
    <text x="652" y="396" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#a3a3a3">"Too much spacing" "Not smooth" "Softer colors"</text>
    <text x="652" y="422" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#737373">Feelings → padding / transition changes</text>
  </g>
  <g>
    <rect x="60" y="458" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="92" y="504" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="26" font-weight="bold" fill="#FBBF24">03 Exploratory Probing</text>
    <text x="92" y="544" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#a3a3a3">"How are mobile menus usually done?"</text>
    <text x="92" y="570" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#737373">AI offers options, I pick one, it builds</text>
  </g>
  <g>
    <rect x="620" y="458" width="520" height="130" rx="14" fill="#151515" stroke="#ffffff" stroke-opacity="0.10"/>
    <text x="652" y="504" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="26" font-weight="bold" fill="#FBBF24">04 Translation + Review</text>
    <text x="652" y="544" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#a3a3a3">I write copy in Chinese, AI translates it</text>
    <text x="652" y="570" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#737373">Nav, buttons, 404, SEO all covered</text>
  </g>
</svg>
EOF

# ============ 图5-EN：四个最难的问题 ============
cat > "$DIR/four-problems-en.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.5" cy="0.25" r="0.95">
      <stop offset="0%" stop-color="#B45309" stop-opacity="0.26"/>
      <stop offset="60%" stop-color="#B45309" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <g fill="#ffffff">
    <circle cx="120" cy="80" r="1.5" opacity="0.45"/><circle cx="420" cy="60" r="1.1" opacity="0.35"/>
    <circle cx="760" cy="100" r="1.4" opacity="0.4"/><circle cx="1100" cy="70" r="1.2" opacity="0.35"/>
  </g>
  <rect x="60" y="52" width="2" height="60" fill="#B45309" opacity="0.8"/>
  <rect x="66" y="52" width="2" height="60" fill="#B45309" opacity="0.4"/>
  <line x1="76" y1="52" x2="76" y2="112" stroke="#B45309" stroke-opacity="0.2" stroke-width="1"/>
  <circle cx="94" cy="68" r="3" fill="#B45309" opacity="0.9"/>
  <circle cx="94" cy="82" r="3" fill="#B45309" opacity="0.55"/>
  <circle cx="94" cy="96" r="3" fill="#B45309" opacity="0.3"/>
  <text x="60" y="150" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" letter-spacing="5" fill="#FBBF24">FOUR HARDEST PROBLEMS</text>
  <text x="60" y="216" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="48" font-weight="bold" fill="#ffffff">The Four Hardest Problems</text>
  <text x="60" y="262" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="22" fill="#a3a3a3">Each one went from symptom → analysis → fix</text>

  <g font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif">
    <rect x="60" y="312" width="1080" height="62" rx="12" fill="#171310" stroke="#B45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="343" r="16" fill="#B45309" opacity="0.9"/>
    <text x="98" y="350" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">1</text>
    <text x="140" y="338" font-size="22" font-weight="bold" fill="#fbbf24">The Chain Reaction of overflow-x: hidden</text>
    <text x="140" y="362" font-size="17" fill="#a3a3a3">A seemingly harmless CSS property caused cross-file problems</text>

    <rect x="60" y="386" width="1080" height="62" rx="12" fill="#171310" stroke="#B45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="417" r="16" fill="#B45309" opacity="0.9"/>
    <text x="98" y="424" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">2</text>
    <text x="140" y="412" font-size="22" font-weight="bold" fill="#fbbf24">The Optical Overlap of Two Buttons</text>
    <text x="140" y="436" font-size="17" fill="#a3a3a3">z-index layering → hamburger animates to X, one place to close</text>

    <rect x="60" y="460" width="1080" height="62" rx="12" fill="#171310" stroke="#B45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="491" r="16" fill="#B45309" opacity="0.9"/>
    <text x="98" y="498" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">3</text>
    <text x="140" y="486" font-size="22" font-weight="bold" fill="#fbbf24">Clicking Blank Space Doesn't Close</text>
    <text x="140" y="510" font-size="17" fill="#a3a3a3">"Any click in the overlay closes it" — 11 lines became 4</text>

    <rect x="60" y="534" width="1080" height="62" rx="12" fill="#171310" stroke="#B45309" stroke-opacity="0.35"/>
    <circle cx="98" cy="565" r="16" fill="#B45309" opacity="0.9"/>
    <text x="98" y="572" font-size="20" font-weight="bold" fill="#0c0c0c" text-anchor="middle">4</text>
    <text x="140" y="560" font-size="22" font-weight="bold" fill="#fbbf24">Cloudflare Pages Subdomain Trap</text>
    <text x="140" y="584" font-size="17" fill="#a3a3a3">Display name and subdomain are separate — redeploy to get galvinai</text>
  </g>
</svg>
EOF

# 批量转 PNG
for f in "$DIR"/division-of-labor-en.svg "$DIR"/five-stages-en.svg "$DIR"/four-modes-en.svg "$DIR"/four-problems-en.svg; do
  rsvg-convert -o "${f%.svg}.png" "$f"
done
echo "=== EN figures done ==="
ls -la "$DIR"/*-en.*