#!/bin/bash
# ============================================================
# 方案 A｜星野极光·分栏配色
# 延续「星野极光」风格，仅按栏目区分主色 / 辅色
# （与 2026-08-08 Issue #29 方案 A 示例图一致）
# ============================================================

# 栏目 → 主色(primary, c1) / 辅色(secondary, c2)
# 主色：左上角光晕 + 双竖线 + 标签文字 + 分隔线圆点
# 辅色：右下角光晕（副光）
#
# insights 行业洞察·酒红：#8E1F2F + 深红棕 #6C2A33
# ai       AI 学习·深蓝：#1E3A8A + 深蓝灰 #27477F
# tips     实用技巧·琥珀棕：#B45309 + 青绿 #4ADE80
# books    书籍专区·紫罗兰：#7C3AED + 品红 #F33BD6
# invest   投资复盘·酒红：#8E1F2F + 深红棕 #6C2A33（与 insights 一致）

get_palette() {
  local section="$1"
  case "$section" in
    insights|invest) echo "#8E1F2F|#6C2A33" ;;
    ai)       echo "#1E3A8A|#27477F" ;;
    tips)     echo "#B45309|#4ADE80" ;;
    books)    echo "#7C3AED|#F33BD6" ;;
    *)        echo "#1E3A8A|#27477F" ;;  # 默认 ai 配色
  esac
}

# 返回主色
palette_primary() {
  get_palette "$1" | cut -d'|' -f1
}

# 返回辅色
palette_secondary() {
  get_palette "$1" | cut -d'|' -f2
}

# 返回标签文字用色（主色的亮版，保证可读性）
# 酒红/深蓝底色较深，标签文字用浅色亮版，避免颜色重叠难以分辨
palette_tag() {
  local section="$1"
  case "$section" in
    insights|invest) echo "#E8A2AC" ;;
    ai)       echo "#8FB4F5" ;;
    tips)     echo "#FBBF24" ;;
    books)    echo "#A78BFA" ;;
    *)        echo "#8FB4F5" ;;
  esac
}
