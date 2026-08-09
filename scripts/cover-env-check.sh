#!/bin/bash
# ============================================================
# cover-env-check.sh — 封面/配图渲染环境检查（全脚本共享）
#
# 用途：所有 SVG → PNG 的生成脚本在渲染前调用本脚本，
#       确保当前环境具备渲染出"无乱码/无豆腐块"图片的必要依赖：
#         1. rsvg-convert（librsvg2-bin）—— SVG → PNG 渲染器
#         2. 中文字体（Noto CJK / 宋体等）—— 缺了中文会渲染成"空心方框/豆腐块"
#
# 用法：
#   source "$(dirname "$0")/cover-env-check.sh"
#   check_cover_env            # 不满足时直接 exit 1，阻止继续生成坏图
#
# 依赖检查说明：
#   - 用 fc-list 检查已安装字体的 lang=zh 能力。字体必须同时支持
#     "显示中文"（lang=zh）才能渲染出正常汉字，否则会出现乱码/豆腐块。
#   - 环境不满足时脚本会打印明确的安装命令并退出，
#     避免在无字体环境下生成坏图（曾因此在 Issue #61 / #80 反复出现乱码）。
# ============================================================

check_cover_env() {
  # 1. rsvg-convert 是否存在
  if ! command -v rsvg-convert >/dev/null 2>&1; then
    echo "❌ 缺少 rsvg-convert：SVG → PNG 渲染器未安装。" >&2
    echo "   请先安装：apt-get update && apt-get install -y librsvg2-bin" >&2
    return 1
  fi

  # 2. 中文字体是否存在（必须支持 lang=zh，否则中文渲染成豆腐块/空心方框）
  if ! command -v fc-list >/dev/null 2>&1; then
    echo "❌ 缺少 fc-list（fontconfig）：无法检查中文字体。" >&2
    echo "   请先安装：apt-get update && apt-get install -y fontconfig fonts-noto-cjk" >&2
    return 1
  fi

  local zh_fonts
  zh_fonts="$(fc-list :lang=zh 2>/dev/null | head -n 1)"
  if [ -z "$zh_fonts" ]; then
    echo "❌ 缺少中文字体：当前环境没有任何支持中文（lang=zh）的字体。" >&2
    echo "   在此环境下渲染，中文会变成空心方框/豆腐块（乱码）。" >&2
    echo "   请先安装：apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra" >&2
    echo "   安装后建议执行 fc-cache -f 刷新字体缓存再重新生成。" >&2
    return 1
  fi

  echo "✅ 渲染环境检查通过（rsvg-convert + 中文字体已就绪）"
  return 0
}
