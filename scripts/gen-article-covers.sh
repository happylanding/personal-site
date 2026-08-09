#!/bin/bash
# 生成其余文章的封面横幅（统一「星野极光」风格，方案 A：按栏目区分配色）
# 用法：bash scripts/gen-article-covers.sh
set -e
BASE=/workspace/public/images

# 加载栏目配色（方案 A｜星野极光·分栏配色）
source "$(dirname "$0")/covers-palette.sh"

# 生成单张封面 SVG + PNG
# 参数：section slug title1 title2 subtitle tagline signature
gen_cover() {
  local section="$1" slug="$2" t1="$3" t2="$4" sub="$5" tag="$6" sig="$7"
  local c1 c2
  c1=$(palette_primary "$section")
  c2=$(palette_secondary "$section")
  local tag_c
  tag_c=$(palette_tag "$section")
  local dir="$BASE/$slug"
  mkdir -p "$dir"
  local svg="$dir/cover.svg"

  # 标题字号：单行时 64，两行时 56
  local fs=56
  if [ -z "$t2" ]; then fs=64; fi

  local title_block=""
  local title_gap=20   # 主标题两行行间距：比字号多 20px
  if [ -n "$t2" ]; then
    title_block="  <text x=\"60\" y=\"290\" font-family=\"'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t1}</text>
  <text x=\"60\" y=\"$((${fs} + 290 + ${title_gap}))\" font-family=\"'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t2}</text>"
    local sub_y=$(( $fs * 2 + 300 + ${title_gap} ))
  else
    title_block="  <text x=\"60\" y=\"290\" font-family=\"'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t1}</text>"
    local sub_y=372
  fi

  cat > "$svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow1" cx="0.15" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.32"/>
      <stop offset="60%" stop-color="${c1}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.85" cy="0.85" r="0.9">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="${c2}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- 星野 -->
  <g fill="#ffffff">
    <circle cx="120" cy="90" r="1.8" opacity="0.5"/>
    <circle cx="280" cy="160" r="1.2" opacity="0.4"/>
    <circle cx="430" cy="70" r="1.6" opacity="0.45"/>
    <circle cx="580" cy="130" r="1.1" opacity="0.35"/>
    <circle cx="720" cy="80" r="1.7" opacity="0.5"/>
    <circle cx="880" cy="150" r="1.2" opacity="0.4"/>
    <circle cx="1030" cy="90" r="1.5" opacity="0.45"/>
    <circle cx="1150" cy="140" r="1.1" opacity="0.35"/>
    <circle cx="200" cy="300" r="1.3" opacity="0.3"/>
    <circle cx="350" cy="380" r="1.0" opacity="0.25"/>
    <circle cx="520" cy="320" r="1.4" opacity="0.3"/>
    <circle cx="700" cy="400" r="1.0" opacity="0.25"/>
    <circle cx="900" cy="330" r="1.3" opacity="0.3"/>
    <circle cx="1050" cy="420" r="1.0" opacity="0.25"/>
    <circle cx="90" cy="500" r="1.2" opacity="0.25"/>
    <circle cx="640" cy="540" r="1.1" opacity="0.2"/>
    <circle cx="980" cy="560" r="1.4" opacity="0.25"/>
  </g>

  <!-- 顶部光带 -->
  <rect width="1200" height="4" fill="url(#fade)"/>

  <!-- 装饰：左上角双竖线 + 圆点节奏（填充空白区域） -->
  <rect x="60" y="52" width="2" height="64" fill="${c1}" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="64" fill="${c1}" opacity="0.35"/>
  <line x1="76" y1="52" x2="76" y2="116" stroke="${c1}" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="94" cy="70" r="3" fill="${c1}" opacity="0.85"/>
  <circle cx="94" cy="84" r="3" fill="${c1}" opacity="0.5"/>
  <circle cx="94" cy="98" r="3" fill="${c1}" opacity="0.25"/>
  <line x1="104" y1="70" x2="118" y2="70" stroke="${c1}" stroke-opacity="0.5" stroke-width="1.5"/>

  <!-- 标签 -->
  <text x="60" y="170" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="20" letter-spacing="6" fill="${tag_c}" opacity="0.9">${tag}</text>

  <!-- 主标题 -->
${title_block}

  <!-- 副标题 -->
  <text x="60" y="${sub_y}" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="26" fill="#a3a3a3">${sub}</text>

  <!-- 分隔线 -->
  <line x1="60" y1="485" x2="360" y2="485" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="360" cy="485" r="4" fill="${c1}"/>
  <line x1="368" y1="485" x2="460" y2="485" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>

  <!-- 底部署名 -->
  <text x="60" y="540" font-family="'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif" font-size="18" fill="#737373">${sig}</text>
</svg>
EOF

  rsvg-convert -o "$dir/cover.png" "$svg"
  echo "cover done: $dir/cover.png"
}

# ============ 文章封面数据 ============
# section | slug | 主标题行1 | 主标题行2(可空) | 副标题 | 标签 | 署名
# ---- ai 墨绿棕 ----
gen_cover ai ai-learning-path "AI 学习路径" "从零基础到能落地" "先会用，再理解，后深入，让 AI 变成生产力" "AI LEARNING PATH" "Galvin × CodeBuddy · 先会用，再理解，后深入"
gen_cover ai ai-tools-practice "AI 效率工具实测" "我的 5 个高频使用场景" "文档、纪要、写作、问答、代码——AI 是放大器，不是替身" "AI TOOLS IN PRACTICE" "Galvin × CodeBuddy · AI 是放大器，不是替身"
gen_cover ai ai-website-rebuild "用 AI 重构个人网站" "一场非程序员的改造实验" "需求 → 方案 → 执行 → 验证，把工程思维借给 AI" "REBUILDING WITH AI" "Galvin × CodeBuddy · 把工程思维借给 AI"
gen_cover ai easy-vibe-guide "Easy-Vibe 宝藏指南" "Datawhale AI 编程教程全拆解" "从 60 秒贪吃蛇到 Claude Code、MCP、Agent 团队" "EASY-VIBE TREASURE GUIDE" "Galvin × CodeBuddy · 曾经最难的是怎么写代码"

# ---- insights 冰蓝紫 ----
gen_cover insights ai-as-colleague "当 AI 成为同事" "人机协作时代的工作方式重构" "从工具到协作者，评审与判断成为新的核心竞争力" "AI AS COLLEAGUE" "Galvin × CodeBuddy · AI 放大产出，人提供方向"
gen_cover insights digital-economy-pulse "数字经济脉搏" "从产业数字化看中国经济的底层逻辑" "数据流动起来，就会重塑几乎所有行业的成本与格局" "DIGITAL ECONOMY PULSE" "Galvin × CodeBuddy · 数据的时代底色"
gen_cover insights digital-government-notes "数字政府观察" "一网通办背后的治理逻辑" "信息化 → 数字化 → 智能化，数据多跑路、群众少跑腿" "DIGITAL GOVERNMENT" "Galvin × CodeBuddy · 数据多跑路，群众少跑腿"

# ---- tips 琥珀棕 ----
gen_cover tips astro-guide "使用 Astro 构建静态网站" "" "零 JavaScript 默认输出，内容驱动的现代静态站点生成器" "BUILDING WITH ASTRO" "Galvin × CodeBuddy · 内容优先，零 JS 默认"
gen_cover tips dark-mode-tailwind "Tailwind CSS 暗色模式实践" "" "class 策略 + localStorage，一行配置实现主题切换" "DARK MODE WITH TAILWIND" "Galvin × CodeBuddy · 亮暗之间，一行切换"
gen_cover tips hello-world "欢迎来到我的个人网站" "" "记录思考、分享见解、展示作品的线上空间" "WELCOME ABOARD" "Galvin × CodeBuddy · 内容优先，安静克制"

# ---- books 紫罗兰 ----
gen_cover books meditations "沉思录" "马可·奥勒留的内心独白" "斯多葛学派经典 · 关于自我修养与内心平静的永恒智慧" "MEDITATIONS · STOICISM" "Marcus Aurelius · 斯多葛学派经典"
gen_cover books pride-and-prejudice "傲慢与偏见" "简·奥斯汀的经典爱情小说" "十九世纪英国乡绅阶层的生活与婚恋观" "PRIDE AND PREJUDICE" "Jane Austen · 世界文学经典"
gen_cover books the-art-of-war "孙子兵法" "兵学圣典的现代启示" "战略、军事哲学与领导智慧的源头" "THE ART OF WAR" "Sun Tzu · 兵学圣典"

echo "=== all covers done ==="
