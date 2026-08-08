#!/bin/bash
# ============================================================
# gen-cover.sh — 单篇文章封面生成器（星野极光 · 分栏配色）
#
# 用法：
#   bash scripts/gen-cover.sh <文章.md 路径>
#   bash scripts/gen-cover.sh <slug>
#   bash scripts/gen-cover.sh --article src/content/articles/xxx.md --tag "xxx" ...
#
# 自动读取文章 frontmatter（title/titleEn/description/section/date），
# 生成 public/images/<slug>/cover.svg + cover.png（中文）
# 以及 cover-en.svg + cover-en.png（英文，有 titleEn 时）。
#
# 可选覆盖参数（透传给 scripts/cover-render.mjs）：
#   --title-cn / --title-en / --desc-cn / --desc-en / --tag / --tag-en / --sig-cn / --sig-en / --out / --no-png
# ============================================================
set -e
cd "$(dirname "$0")/.."   # 仓库根目录

usage() {
  echo "用法: bash scripts/gen-cover.sh <文章.md 或 slug> [--tag ...]"
  exit 1
}

if [ $# -lt 1 ]; then usage; fi

ARTICLE=""
declare -a EXTRA=()

while [ $# -gt 0 ]; do
  case "$1" in
    --article) ARTICLE="$2"; shift 2 ;;
    -h|--help) usage ;;
    --*) EXTRA+=("$1"); EXTRA+=("$2"); shift 2 ;;
    *) ARTICLE="$1"; shift ;;
  esac
done

# 允许传 slug：自动定位到 articles 目录
if [ -n "$ARTICLE" ] && [ ! -f "$ARTICLE" ]; then
  if [ -f "src/content/articles/$ARTICLE.md" ]; then
    ARTICLE="src/content/articles/$ARTICLE.md"
  else
    echo "❌ 找不到文章: $ARTICLE"
    exit 1
  fi
fi

if [ ! -f "$ARTICLE" ]; then
  echo "❌ 文章文件不存在: $ARTICLE"
  exit 1
fi

echo "🎨 生成封面: $ARTICLE"
node scripts/cover-render.mjs --article "$ARTICLE" "${EXTRA[@]}"
echo "✅ 完成，如需调整文案可加 --tag/--sig-cn 等参数重跑"
