#!/bin/bash
# 生成英文版文章封面（cover-en.png / cover-en.svg）
# 与中文封面同构图（方案 A：星野极光·分栏配色），文字换为英文
# 用法：bash scripts/gen-en-covers.sh
set -e
BASE=public/images

# 加载栏目配色（方案 A｜星野极光·分栏配色）
source "$(dirname "$0")/covers-palette.sh"

# 依据最长标题行自适应字号
pick_fs() {
  local t1="$1" t2="$2" maxlen=${#1}
  [ -n "$t2" ] && [ "${#t2}" -gt "$maxlen" ] && maxlen=${#t2}
  if [ "$maxlen" -gt 38 ]; then echo 38
  elif [ "$maxlen" -gt 30 ]; then echo 44
  elif [ "$maxlen" -gt 24 ]; then echo 50
  else echo 56; fi
}

# 生成单张英文封面
# 参数：section slug 标题行1 标题行2(可空) 副标题 标签 署名
gen_cover_en() {
  local section="$1" slug="$2" t1="$3" t2="$4" sub="$5" tag="$6" sig="$7"
  local c1 c2
  c1=$(palette_primary "$section")
  c2=$(palette_secondary "$section")
  local dir="$BASE/$slug"
  mkdir -p "$dir"

  local fs lines=1
  [ -n "$t2" ] && lines=2
  fs=$(pick_fs "$t1" "$t2")

  local title_block sub_y
  if [ -n "$t2" ]; then
    title_block="  <text x=\"60\" y=\"290\" font-family=\"Playfair Display, 'DejaVu Serif', Georgia, serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t1}</text>
  <text x=\"60\" y=\"$((290 + fs))\" font-family=\"Playfair Display, 'DejaVu Serif', Georgia, serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t2}</text>"
    sub_y=$((290 + fs * lines + 26))
  else
    title_block="  <text x=\"60\" y=\"290\" font-family=\"Playfair Display, 'DejaVu Serif', Georgia, serif\" font-size=\"${fs}\" font-weight=\"bold\" fill=\"#ffffff\">${t1}</text>"
    sub_y=$((290 + fs + 26))
  fi

  cat > "$dir/cover-en.svg" <<EOF
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

  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

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

  <rect width="1200" height="4" fill="url(#fade)"/>

  <rect x="60" y="52" width="2" height="64" fill="${c1}" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="64" fill="${c1}" opacity="0.35"/>

  <text x="60" y="170" font-family="'DejaVu Sans Mono', monospace" font-size="20" letter-spacing="6" fill="${c1}" opacity="0.9">${tag}</text>

${title_block}

  <text x="60" y="${sub_y}" font-family="'Source Sans 3', 'DejaVu Sans', Arial, sans-serif" font-size="24" fill="#a3a3a3">${sub}</text>

  <line x1="60" y1="485" x2="360" y2="485" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="360" cy="485" r="4" fill="${c1}"/>
  <line x1="368" y1="485" x2="460" y2="485" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>

  <text x="60" y="540" font-family="'Source Sans 3', 'DejaVu Sans', Arial, sans-serif" font-size="18" fill="#737373">${sig}</text>
</svg>
EOF

  rsvg-convert -o "$dir/cover-en.png" "$dir/cover-en.svg"
  echo "EN cover done: $dir/cover-en.png"
}

# ============ 英文封面数据 ============
# section | slug | 标题行1 | 标题行2(可空) | 副标题 | 标签 | 署名
# ---- ai 墨绿棕 ----
gen_cover_en ai ai-learning-path "AI Learning Path" "From Zero to Practical" "From zero to practical — use it first, understand it next, then go deeper" "AI LEARNING PATH" "Galvin x CodeBuddy · Use it first, then go deeper"
gen_cover_en ai ai-tools-practice "AI Productivity Tools" "5 High-Frequency Use Cases" "A hands-on review across documents, research and writing" "AI TOOLS IN PRACTICE" "Galvin x CodeBuddy · AI amplifies, never replaces"
gen_cover_en ai ai-website-rebuild "Rebuilding a Personal Site with AI" "A Non-Programmer's Experiment" "How a non-programmer rebuilt a bilingual site with AI, end to end" "REBUILDING WITH AI" "Galvin x CodeBuddy · Engineering thinking with AI"
gen_cover_en ai easy-vibe-guide "Easy-Vibe Treasure Guide" "The Best of Datawhale's AI Coding Course" "From browser coding to Claude Code, MCP and Agent Teams" "EASY-VIBE GUIDE" "Galvin x CodeBuddy · From zero to full-stack"

# ---- insights 冰蓝紫 ----
gen_cover_en insights ai-as-colleague "When AI Becomes a Colleague" "Rethinking Work in the Human-AI Era" "AI amplifies output speed; humans provide direction and accountability" "AI AS COLLEAGUE" "Galvin x CodeBuddy · AI amplifies output, humans steer"
gen_cover_en insights digital-economy-pulse "The Pulse of the Digital Economy" "Growth Through Digital Transformation" "When data flows, it reshapes costs and structures across industries" "DIGITAL ECONOMY" "Galvin x CodeBuddy · The data-driven era"
gen_cover_en insights digital-government-notes "Observing Digital Government" "The Logic Behind One-Stop Online Services" "From informatization to intelligence — data moves, citizens stay put" "DIGITAL GOVERNMENT" "Galvin x CodeBuddy · Data moves, citizens stay put"

# ---- tips 琥珀棕 ----
gen_cover_en tips astro-guide "Building Static Sites with Astro" "" "A modern static site generator built for content-driven websites" "BUILDING WITH ASTRO" "Galvin x CodeBuddy · Content-first, zero JS by default"
gen_cover_en tips dark-mode-tailwind "Dark Mode with Tailwind CSS" "" "class strategy + localStorage — theme switching in one line of config" "DARK MODE PRACTICE" "Galvin x CodeBuddy · Light and dark, one line apart"
gen_cover_en tips hello-world "Welcome to My Personal Site" "" "A quiet corner for thinking, sharing and showing my work" "WELCOME ABOARD" "Galvin x CodeBuddy · Content-first, quiet and calm"
gen_cover_en tips vibe-coding "My First Vibe Coding Project" "Building a Bilingual Site with AI" "A non-developer built a 55+ page bilingual site in 5 days by talking to AI" "VIBE CODING" "Galvin x CodeBuddy · A 5-day, 55-page experiment"

# ---- books 紫罗兰 ----
gen_cover_en books meditations "Meditations" "Marcus Aurelius's Private Notes" "A Stoic classic on self-mastery, meaning and inner peace" "MEDITATIONS · STOICISM" "Marcus Aurelius · Stoic classic"
gen_cover_en books pride-and-prejudice "Pride and Prejudice" "Jane Austen's Beloved Novel" "A classic of manners on love, judgment and personal growth" "PRIDE AND PREJUDICE" "Jane Austen · World Literature Classic"
gen_cover_en books the-art-of-war "The Art of War" "A Timeless Guide to Strategy" "Strategic, military philosophy and leadership wisdom at the source" "THE ART OF WAR" "Sun Tzu · The Art of War"

echo "=== all EN covers done ==="
