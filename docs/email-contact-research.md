# Galvin 邮箱联系组件优化调研

日期：2026-08-15  
问题：关于页和公共页脚以“复制邮箱”作为主要按钮，把真实邮箱地址放在低对比、次要位置。用户指出这削弱了地址的可识别性和联系方式的直观性。

## 结论

邮箱地址应是联系模块的**首要可见内容与可点击链接**，使用完整的 `mailto:` 地址作为链接文本；“发邮件”和“复制”是围绕该地址的次级、明确操作。不要以泛化按钮文字替代地址，也不应将地址仅放在按钮之后的小字或状态提示中。

建议在关于页使用一个单一的“邮箱地址块”：上方为 `EMAIL` 标签，中间为可点击的 `cgaojiacheng@gmail.com`，下方并列两个次级动作——`发邮件`（`mailto:`）与 `复制`。在页脚使用紧凑版本：完整地址为主链接，旁边仅放一个带明确 accessible name 的复制图标/文本按钮；X 链接维持第二行。

## 证据与规则

| 发现 | Galvin 实现规则 |
| --- | --- |
| University of Minnesota 的无障碍链接指南建议 email address 使用 `mailto:` 链接，且链接文本应简洁、描述性并可脱离上下文理解。[1] | 将完整邮箱本身作为 `mailto:` 的可见链接文字；不再把“复制邮箱”当作唯一的主要文本。 |
| MOJ Design System 将复制按钮定义为快速准确复制重要信息的辅助组件；默认文案为“Copy”，点击后变化为“Copied”，并在约 4 秒后恢复。[2] | 复制作为次级小按钮，`aria-live` 宣布“邮箱已复制”；显示短暂状态后恢复。 |
| 链接与按钮具有不同语义：地址链接用于导航到邮件客户端，复制按钮用于本地操作。 | 同时提供 `mailto:` 与复制，不让用户必须猜测某一动作会打开邮件还是复制地址。 |
| 邮箱地址很长，移动端容易溢出。 | 使用等宽或 14–16px 正文字号、`overflow-wrap:anywhere`，不缩小成不可读的小字；复制按钮保持至少 40px 的触达高度。 |

## 目标结构

```text
EMAIL
cgaojiacheng@gmail.com   ← 可点击，mailto
[ 发邮件 ]  [ 复制邮箱 ]  ← 次级动作
```

页脚简化为：

```text
EMAIL
cgaojiacheng@gmail.com  [复制]
X · @galvin0119 ↗
```

## 桌面视觉核验

1440px 截图确认关于页的联系区先呈现 `EMAIL` 与完整 `cgaojiacheng@gmail.com` mailto 地址，地址采用主文字对比与下划线；复制被收束为同一地址块内的次级按钮，X 保持独立渠道。初版中地址在 X 下方被重复显示的问题已移除，状态行仅在复制成功后临时出现。页脚的地址与复制也并列在同一联系行，不再将“复制邮箱”置于地址之前。

390px 截图确认关于页地址块完整显示为一行，复制动作落在地址下方的独立次级行；页脚的紧凑版本也保留了完整地址、清晰的复制文本与独立 X 路径，未出现横向截断。

## 参考资料

1. University of Minnesota Office for Digital Accessibility, [Links](https://accessibility.umn.edu/guides-resources/7-core-accessibility-skills/links)
2. Ministry of Justice Design System, [Copy button](https://design-patterns.service.justice.gov.uk/components/copy-button/)
