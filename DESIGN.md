# Galvin DESIGN.md

## Visual intent

Galvin is a Chinese AI learning and making journal for a digital-government and digital-economy practitioner. The visual direction is **quiet instrument**: a dark editorial workspace that feels precise, calm and capable, not like a SaaS dashboard or a generic AI landing page. The page should earn one mood: **composed**.

The primary reader task is to understand what Galvin is doing now, then choose a direct route into making or inquiry. Content has priority over decoration. Motion supports state changes only and always has a reduced-motion fallback.

## Token roles

Use the existing Galvin semantic tokens. Do not introduce local hex colors, font sizes, radii or animation timings when a semantic token applies.

| Role | Token/value | Usage |
| --- | --- | --- |
| Canvas | `--galvin-canvas: #070b14` | Full page ground |
| Raised surface | `--galvin-surface: #11192b` | Inputs, popovers and only essential contained controls |
| Primary text | `--galvin-text-primary: #f4f7ff` | Headings, primary links and essential content |
| Secondary text | `--galvin-text-secondary` | Body support, summaries and navigation |
| Muted text | `--galvin-text-muted` | Dates and nonessential metadata, never core labels |
| Active signal | `--galvin-signal-violet: #9b8cff` | Active navigation, selection, focus and primary interaction |
| State signal | `--galvin-signal-cyan: #61f2d0` | Status only; never a competing CTA color |

Depth is communicated by surface shifts and hairline separators, not floating cards or offset shadows. Use one visual field per page maximum.

## Typography

Use `Noto Sans SC` for Chinese reading and `IBM Plex Mono` only for concise utility text. Never use a tiny utility style for a label that is necessary to understand the page.

| Role | Desktop | Tablet | Mobile | Rule |
| --- | ---: | ---: | ---: | --- |
| Display statement | 64–72px | 52–60px | 38–44px | Tight but readable; never occupy the full mobile viewport |
| Section title | 32–40px | 28–34px | 24–28px | No decorative English eyebrow required |
| Article/entry title | 22–28px | 21–26px | 20–24px | Favour line breaks that preserve Chinese phrase units |
| Lead/body | 18px | 17px | 17px | Line-height 1.65–1.8; reading measure constrained |
| Metadata | 14–15px | 14px | 14px | Mono only when the information is truly technical |
| Micro utility | 12–13px | 12–13px | 12–13px | Not for essential controls or navigation labels |

## Layout

At 1440px, use an asymmetric editorial grid with generous outer gutters and a constrained reading rail. At 834px, preserve hierarchy before columns; collapse decorative fields first. At 390px, use a single content rail with 16–20px gutters, minimum 44px touch targets and no horizontally clipped primary labels.

Section voids should be more generous than within-section gaps. Separate large page chapters with 64–96px desktop space and 40–56px mobile space; keep title, explanation and immediate action together at 12–24px.

## Navigation and resource grouping

Desktop global navigation exposes `造物`、`叩问`、`行迹`、`藏页` and `关于`. The homepage carries `此刻`; do not duplicate it as a global peer. `藏页` is the only parent with one click-activated submenu: `网站与资源` and `书架`.

The desktop resource popover must have a textual caret, native button semantics, a visible focus state and Escape close with focus return. Mobile navigation displays the two resource links directly under a `藏页` group label. Do not use hover-only or cascading menus.

## Page signatures

| Page | Composition |
| --- | --- |
| Homepage | Statement, current-status annotation, editorial entry rail and one restrained signal field |
| Archive | Continuous question directory, compact search/filter rail and reading-first metadata |
| Navigation | Visible desktop hierarchy, one-layer resource popover and direct mobile disclosure |

## Prohibited patterns

Do not use a card wall, repeated outlined containers, arbitrary display scaling, English eyebrow clutter, ornamental numeric indexes, fake statistics, global cursors, WebGL particles, scroll hijacking, purple gradients or heavy offset shadows. Do not reproduce an external brand's colors, typeface, logo or component treatment.

## Delivery gates

After each visual change, verify 1440px, 834px and 390px screenshots in default and reduced-motion modes. Run the project's type, build, browser and axe checks. Reject any design with obscured focus, low-contrast text, clipped labels, horizontal overflow, a control below 44px on mobile, or decorations that outrank the reader task.
