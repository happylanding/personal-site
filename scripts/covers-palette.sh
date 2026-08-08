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
# insights 冰蓝紫：冰蓝 #0E96E9 + 蓝紫 #6C7AFF
# ai       墨绿棕：墨绿 #16A34A + 暖褐 #B45309
# tips     琥珀棕：琥珀 #B45309 + 青绿 #4ADE80
# books    紫罗兰：紫罗兰 #7C3AED + 品红 #F33BD6

get_palette() {
  local section="$1"
  case "$section" in
    insights) echo "#0E96E9|#6C7AFF" ;;
    ai)       echo "#16A34A|#B45309" ;;
    tips)     echo "#B45309|#4ADE80" ;;
    books)    echo "#7C3AED|#F33BD6" ;;
    *)        echo "#16A34A|#B45309" ;;  # 默认 ai 配色
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
palette_tag() {
  local section="$1"
  case "$section" in
    insights) echo "#38BDF8" ;;
    ai)       echo "#4ADE80" ;;
    tips)     echo "#FBBF24" ;;
    books)    echo "#A78BFA" ;;
    *)        echo "#4ADE80" ;;
  esac
}
