---
title: "Excel 空 Sheet 批量清理工具"
titleEn: "Excel Empty Sheet Cleaner"
description: "部署在目标文件夹，双击运行即可自动扫描并删除 Excel 文件中的空 Sheet，保留格式与样式。支持识别 .csv 伪装成 xlsx 的文件与多种编码。"
descriptionEn: "Drop it into any folder and double-click to run — automatically scans and removes empty sheets from Excel files, keeping formatting intact. Handles CSV-as-XLSX imposters and multi-encoding."
type: "script"
status: "stable"
version: "v2.0"
command: "双击 运行.bat 即可（或 powershell -File ExcelSheetCleaner.ps1）"
downloadUrl: "/downloads/excel-sheet-cleaner.zip"
date: 2026-08-08
updated: 2026-08-08
tags: ["Excel", "效率", "批量清理", "WPS"]
tagsEn: ["excel", "productivity", "batch-cleanup", "wps"]
featured: true
---

## 简介

针对日常重复性工作中的 Excel 空 Sheet 清理需求制作的轻量脚本工具：把 `ExcelSheetCleaner.ps1` + `运行.bat` 放进存放 Excel 的文件夹，双击即可批量扫描并删除无数据的空 Sheet。

## 特性

- **零依赖** — 基于 Windows 原生 PowerShell + COM 接口，无需安装 Java 等运行时
- **轻量级** — 仅 ~14KB，开箱即用
- 自动识别 Excel / WPS，用 COM 接口处理，保留原文件格式与样式
- CSV 自动检测编码（UTF-8 / GBK / GB2312）
- 自动识别 `.csv` 扩展名但实际为 XLSX 格式的"伪装文件"
- 处理完毕在同目录生成 `excel-cleaner-log.txt` 日志，末尾按文件列出明细

## 删除规则

- Sheet 仅有标题行、无实际数据 → 删除
- Sheet 完全空白 → 删除
- Sheet 名称标注数量为 0（如 `Sheet1(0)`）→ 删除
- `可用性` / `可用` 开头的 Sheet → **始终保留**

## 环境要求

- Windows（Win7 及以上）
- 安装了 Office Excel 或 WPS
