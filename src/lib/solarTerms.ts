/**
 * 二十四节气 —— 首页 Hero 眉标的「时令题记」数据源
 *
 * 把原来静态的「中国 · 2026年8月9日」升级为随节气轮换的物候短句：
 *   - 每个节气配一句经典《月令七十二候》物候语（zh）与一句英文意译（en）
 *   - 节气每 15 天左右轮换一次，一年 24 变，天然带有时间流逝的仪式感
 *   - 分四季配色（春绿 / 夏金 / 秋橙 / 冬蓝），呼应星野极光主题
 *
 * 日期算法：寿星万年历的 24 节气公式（黄经推算，1900–2100 年误差 ≤1 天）。
 * 与 ASTRO 静态构建兼容：构建时即算出当前节气，无运行时依赖。
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SolarTerm {
  /** 节气序号（0=小寒 … 23=冬至，与 sTerm 公式索引一致） */
  index: number;
  zh: string;
  en: string;
  /** 物候短句（中文，出自《月令七十二候》等经典） */
  lineZh: string;
  /** 物候短句（英文意译） */
  lineEn: string;
  season: Season;
}

/** 四季配色（呼应星野极光主题色：绿 / 金 / 橙 / 冰蓝） */
export const SEASON_COLORS: Record<Season, string> = {
  spring: "#22c55e", // 春 · 生发之绿
  summer: "#b45309", // 夏 · 盛阳之金
  autumn: "#d97706", // 秋 · 收获之橙
  winter: "#0ea5e9", // 冬 · 凝敛之蓝
};

/** 二十四节气（自小寒起） */
export const SOLAR_TERMS: SolarTerm[] = [
  { index: 0,  zh: "小寒", en: "Minor Cold",         lineZh: "雁北乡",         lineEn: "wild geese turn north", season: "winter" },
  { index: 1,  zh: "大寒", en: "Major Cold",         lineZh: "征鸟厉疾",       lineEn: "hawks hunt the cold",   season: "winter" },
  { index: 2,  zh: "立春", en: "Start of Spring",    lineZh: "东风解冻",       lineEn: "east wind thaws",      season: "spring" },
  { index: 3,  zh: "雨水", en: "Rain Water",         lineZh: "草木萌动",       lineEn: "grass stirs green",    season: "spring" },
  { index: 4,  zh: "惊蛰", en: "Awakening of Insects", lineZh: "春雷始鸣",     lineEn: "thunder wakes the world", season: "spring" },
  { index: 5,  zh: "春分", en: "Spring Equinox",     lineZh: "昼夜均而寒暑平", lineEn: "day equals night",     season: "spring" },
  { index: 6,  zh: "清明", en: "Pure Brightness",    lineZh: "气清景明",       lineEn: "clear and bright",     season: "spring" },
  { index: 7,  zh: "谷雨", en: "Grain Rain",         lineZh: "雨生百谷",       lineEn: "rain grows the grain", season: "spring" },
  { index: 8,  zh: "立夏", en: "Start of Summer",    lineZh: "万物繁茂",       lineEn: "all things grow tall", season: "summer" },
  { index: 9,  zh: "小满", en: "Grain Full",         lineZh: "小得盈满",       lineEn: "grain begins to fill", season: "summer" },
  { index: 10, zh: "芒种", en: "Grain in Ear",       lineZh: "有芒之种",       lineEn: "awned grains to sow",  season: "summer" },
  { index: 11, zh: "夏至", en: "Summer Solstice",    lineZh: "日长之至",       lineEn: "the longest day",      season: "summer" },
  { index: 12, zh: "小暑", en: "Minor Heat",         lineZh: "温风至",         lineEn: "warm wind arrives",    season: "summer" },
  { index: 13, zh: "大暑", en: "Major Heat",         lineZh: "土润溽暑",       lineEn: "earth damp and steamy", season: "summer" },
  { index: 14, zh: "立秋", en: "Start of Autumn",    lineZh: "云天收夏色",     lineEn: "summer fades, autumn sings", season: "autumn" },
  { index: 15, zh: "处暑", en: "End of Heat",        lineZh: "暑气渐消",       lineEn: "heat slowly recedes",  season: "autumn" },
  { index: 16, zh: "白露", en: "White Dew",          lineZh: "白露为霜",       lineEn: "dew turns to frost",   season: "autumn" },
  { index: 17, zh: "秋分", en: "Autumn Equinox",     lineZh: "秋色平分",       lineEn: "autumn divides the sky", season: "autumn" },
  { index: 18, zh: "寒露", en: "Cold Dew",           lineZh: "露气寒冷",       lineEn: "cold dew falls",       season: "autumn" },
  { index: 19, zh: "霜降", en: "Frost's Descent",    lineZh: "气肃而凝",       lineEn: "frost forms, air crisp", season: "autumn" },
  { index: 20, zh: "立冬", en: "Start of Winter",    lineZh: "水始冰",         lineEn: "water begins to freeze", season: "winter" },
  { index: 21, zh: "小雪", en: "Minor Snow",         lineZh: "虹藏不见",       lineEn: "rainbows hide away",   season: "winter" },
  { index: 22, zh: "大雪", en: "Major Snow",         lineZh: "岁暮天寒",       lineEn: "deep winter settles",  season: "winter" },
  { index: 23, zh: "冬至", en: "Winter Solstice",    lineZh: "一阳来复",       lineEn: "yang returns, light grows", season: "winter" },
];

/** 节气日期偏移表（分钟，寿星万年历公式，1900–2100 有效） */
const S_TERM_INFO = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551,
  218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447,
  419210, 440795, 462224, 483532, 504758,
];

interface TermDate {
  year: number;
  month: number; // 0-based
  day: number;
}

/** 计算某年第 n 个节气落在公历几月几日（UTC 精度即可） */
function sTermDate(year: number, n: number): TermDate {
  const off = new Date(
    (31556925974.7 * (year - 1900) + S_TERM_INFO[n] * 60000) +
      Date.UTC(1900, 0, 6, 2, 5)
  );
  return { year, month: off.getUTCMonth(), day: off.getUTCDate() };
}

/**
 * 取 date 时刻所处的节气。
 * 边界处理：公历 1 月初（小寒前）仍属上一年冬至时段，直接回退到「冬至」。
 */
export function getCurrentTerm(date: Date = new Date()): SolarTerm {
  const y = date.getFullYear();
  const ts = date.getTime();
  let last: SolarTerm = SOLAR_TERMS[23]; // 默认冬至（处理年初小寒前的边界）
  for (let n = 0; n < 24; n++) {
    const d = sTermDate(y, n);
    const t = new Date(d.year, d.month, d.day).getTime();
    if (t <= ts) last = SOLAR_TERMS[n];
    else break; // 节气按时间顺序排列，遇到第一个晚于当天的即可停止
  }
  return last;
}
