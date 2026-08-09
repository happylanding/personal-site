/**
 * 首页 Hero 眉标的「时令 / 节日题记」数据源
 *
 * 把原来静态的「中国 · 2026年8月9日」升级为「节日优先，节气兜底」的题记：
 *   - **节日优先**：当天恰好是节日（国内 / 国际 / 传统农历节日）时，展示节日名 + 一句应景文案
 *   - **国内优先**：国内节日与国际节日落在同一天时，只展示国内节日（如 4/22 世界地球日 vs 无冲突，
 *     典型冲突示例：11/11 购物节 vs 一战停战纪念日，按国内优先）
 *   - **节气兜底**：没有节日时，回退到二十四节气 + 物候短句（每 15 天一轮换）
 *   - 每个节日 / 节气配一句中文短句与一句英文意译
 *   - 分四季配色（春绿 / 夏金 / 秋橙 / 冬蓝），呼应星野极光主题
 *
 * 日期算法：
 *   - 节气：寿星万年历 24 节气公式（黄经推算，1900–2100 年误差 ≤1 天）
 *   - 农历节日：内置 1900–2100 农历年数据表（公历→农历换算），纯静态构建，无运行时依赖
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

/* ============================================================
 * 二十四节气日期（寿星万年历公式，1900–2100 有效）
 * ============================================================ */

/** 节气日期偏移表（分钟） */
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

/* ============================================================
 * 农历换算（1900–2100，查表法）
 * ============================================================ */

/** 农历年数据表：低位 4 bit = 闰月月份（0 表示无闰月），其余 bit 表示各月大小 */
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

function leapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}
function leapDays(y: number): number {
  return leapMonth(y) ? (LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29) : 0;
}
function monthDays(y: number, m: number): number {
  return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
}
function lYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
  return sum + leapDays(y);
}

interface LunarDate {
  year: number;
  /** 月份；负数表示闰月 */
  month: number;
  day: number;
}

/** 公历 → 农历（基于 1900-01-31 为基准，UTC 计算避免时区偏移） */
function solarToLunar(y: number, m: number, d: number): LunarDate {
  let offset = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000);
  let i = 1900;
  let temp = 0;
  for (; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  const year = i;
  const leap = leapMonth(year);
  let isLeap = false;
  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, i);
    }
    if (isLeap && i === leap + 1) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --i;
    }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }
  return { year, month: isLeap ? -i : i, day: offset + 1 };
}

/* ============================================================
 * 节日数据
 * ============================================================ */

export interface Holiday {
  zh: string;
  en: string;
  /** 节日短句（中文） */
  lineZh: string;
  /** 节日短句（英文） */
  lineEn: string;
  /** 所属季节（决定主题色） */
  season: Season;
  /** 节日类型：domestic=国内 / international=国际 / traditional=传统农历节日 */
  kind: "domestic" | "international" | "traditional";
}

/** 公历节日：month / day 为固定公历日期 */
export const FIXED_HOLIDAYS: (Holiday & { month: number; day: number })[] = [
  // —— 国内节日（kind: domestic，优先展示） ——
  { month: 1, day: 1,  zh: "元旦",   en: "New Year's Day",      lineZh: "一元复始，万象更新",   lineEn: "a fresh start to a new year", kind: "domestic", season: "winter" },
  { month: 3, day: 8,  zh: "妇女节", en: "Women's Day",         lineZh: "致敬每一个「她」",     lineEn: "celebrating every her",        kind: "domestic", season: "spring" },
  { month: 3, day: 12, zh: "植树节", en: "Arbor Day",           lineZh: "种一棵树，种一个春天", lineEn: "plant a tree, plant a spring", kind: "domestic", season: "spring" },
  { month: 5, day: 1,  zh: "劳动节", en: "Labor Day",           lineZh: "每一份努力都算数",     lineEn: "every effort counts",          kind: "domestic", season: "spring" },
  { month: 5, day: 4,  zh: "青年节", en: "Youth Day",           lineZh: "恰同学少年，风华正茂", lineEn: "youth in full bloom",          kind: "domestic", season: "spring" },
  { month: 6, day: 1,  zh: "儿童节", en: "Children's Day",      lineZh: "愿你眼里有光，心中有梦", lineEn: "eyes bright, dreams alive",    kind: "domestic", season: "summer" },
  { month: 7, day: 1,  zh: "建党节", en: "CPC Founding Day",    lineZh: "初心不改，历久弥新",   lineEn: "stay true to the original vow", kind: "domestic", season: "summer" },
  { month: 8, day: 1,  zh: "建军节", en: "Army Day",           lineZh: "致敬最可爱的人",       lineEn: "salute to the bravest",        kind: "domestic", season: "summer" },
  { month: 9, day: 10, zh: "教师节", en: "Teachers' Day",      lineZh: "桃李不言，下自成蹊",   lineEn: "silent peaches, well-worn paths", kind: "domestic", season: "autumn" },
  { month: 10, day: 1, zh: "国庆节", en: "National Day",       lineZh: "山河远阔，国泰民安",   lineEn: "vast land, peaceful times",    kind: "domestic", season: "autumn" },

  // —— 国际节日（kind: international，与国内冲突时让位） ——
  { month: 2, day: 14, zh: "情人节",   en: "Valentine's Day",  lineZh: "爱意不止于玫瑰",     lineEn: "love beyond the roses",    kind: "international", season: "winter" },
  { month: 3, day: 14, zh: "白色情人节", en: "White Day",      lineZh: "回赠一份小心意",     lineEn: "a sweet return gift",      kind: "international", season: "spring" },
  { month: 4, day: 1,  zh: "愚人节",   en: "April Fools' Day", lineZh: "整活要有，真诚也要有", lineEn: "pranks, but stay sincere", kind: "international", season: "spring" },
  { month: 4, day: 22, zh: "世界地球日", en: "Earth Day",      lineZh: "珍爱地球，人与自然和谐共生", lineEn: "love the earth, live in harmony", kind: "international", season: "spring" },
  { month: 5, day: 12, zh: "护士节",   en: "Nurses' Day",      lineZh: "白衣执甲，向光而行",   lineEn: "angels in white, walking toward light", kind: "international", season: "spring" },
  { month: 5, day: 31, zh: "世界无烟日", en: "No Tobacco Day", lineZh: "清新空气，从每一口开始", lineEn: "fresh air, one breath at a time", kind: "international", season: "spring" },
  { month: 6, day: 5,  zh: "世界环境日", en: "Environment Day", lineZh: "守护同一片蓝天碧水",   lineEn: "guard the same sky and waters", kind: "international", season: "summer" },
  { month: 6, day: 21, zh: "世界音乐日", en: "Music Day",      lineZh: "万物皆有旋律",         lineEn: "everything has a melody",  kind: "international", season: "summer" },
  { month: 10, day: 16, zh: "世界粮食日", en: "Food Day",      lineZh: "一粥一饭，当思来之不易", lineEn: "every grain is hard-earned", kind: "international", season: "autumn" },
  { month: 10, day: 24, zh: "联合国日",  en: "United Nations Day", lineZh: "四海一家，共赴美好",  lineEn: "one world, one shared future", kind: "international", season: "autumn" },
  { month: 11, day: 10, zh: "世界青年节", en: "World Youth Day", lineZh: "世界属于青年，青年创造世界", lineEn: "the world belongs to the young", kind: "international", season: "winter" },
  { month: 12, day: 3,  zh: "国际残疾人日", en: "Disability Day", lineZh: "有爱无碍，平等同行",  lineEn: "barrier-free, walk together", kind: "international", season: "winter" },
  { month: 12, day: 10, zh: "世界人权日", en: "Human Rights Day", lineZh: "尊重每一种权利",      lineEn: "respect every right",        kind: "international", season: "winter" },
  { month: 12, day: 24, zh: "平安夜",   en: "Christmas Eve",   lineZh: "愿你今夜好梦",         lineEn: "may your night be peaceful", kind: "international", season: "winter" },
  { month: 12, day: 25, zh: "圣诞节",   en: "Christmas Day",   lineZh: "Merry Christmas，岁岁平安", lineEn: "Merry Christmas, stay safe", kind: "international", season: "winter" },
];

/** 农历节日：month / day 为农历月日（闰月节日一律不重复计算） */
export const LUNAR_HOLIDAYS: (Holiday & { month: number; day: number })[] = [
  { month: 1, day: 1,  zh: "春节",   en: "Spring Festival",   lineZh: "爆竹声中一岁除，春风送暖入屠苏", lineEn: "firecrackers bid the old year farewell", kind: "traditional", season: "winter" },
  { month: 1, day: 15, zh: "元宵节", en: "Lantern Festival",  lineZh: "花灯如昼，人月两圆",     lineEn: "lanterns bright, hearts united", kind: "traditional", season: "winter" },
  { month: 2, day: 2,  zh: "龙抬头", en: "Dragon Head",       lineZh: "二月二，龙抬头，鸿运当头", lineEn: "the dragon rises, luck follows", kind: "traditional", season: "spring" },
  { month: 5, day: 5,  zh: "端午节", en: "Dragon Boat Festival", lineZh: "粽叶飘香，龙舟竞渡",   lineEn: "zongzi aroma, dragon boats race", kind: "traditional", season: "summer" },
  { month: 7, day: 7,  zh: "七夕",   en: "Qixi Festival",     lineZh: "金风玉露一相逢，便胜却人间无数", lineEn: "one meeting outshines countless mortal days", kind: "traditional", season: "summer" },
  { month: 7, day: 15, zh: "中元节", en: "Ghost Festival",    lineZh: "慎终追远，不忘来处",     lineEn: "honor the past, remember the source", kind: "traditional", season: "summer" },
  { month: 8, day: 15, zh: "中秋节", en: "Mid-Autumn Festival", lineZh: "海上生明月，天涯共此时", lineEn: "the bright moon rises over the sea", kind: "traditional", season: "autumn" },
  { month: 9, day: 9,  zh: "重阳节", en: "Double Ninth",      lineZh: "登高望远，岁岁安康",     lineEn: "climb high, see far, stay well", kind: "traditional", season: "autumn" },
  { month: 12, day: 8, zh: "腊八节", en: "Laba Festival",     lineZh: "过了腊八就是年",         lineEn: "after Laba, the New Year draws near", kind: "traditional", season: "winter" },
  { month: 12, day: 23, zh: "小年",   en: "Little New Year",  lineZh: "祭灶扫尘，迎祥纳福",     lineEn: "sweep the dust, welcome fortune", kind: "traditional", season: "winter" },
];

/** 节日按「国内 > 传统 > 国际」的优先级 */
const HOLIDAY_KIND_ORDER: Record<Holiday["kind"], number> = {
  domestic: 0,
  traditional: 1,
  international: 2,
};

/** 节日名，用于冲突检测时判断是否同一天 */
interface DayHoliday {
  zh: string;
  en: string;
  lineZh: string;
  lineEn: string;
  season: Season;
  kind: Holiday["kind"];
}

/**
 * 取 date 当天的「节日题记」；没有节日时返回 null（调用方回退到节气）。
 * 同一天若有多个节日，按 国内 > 传统 > 国际 的优先级只展示一个。
 */
export function getHoliday(date: Date = new Date()): DayHoliday | null {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const lunar = solarToLunar(y, m, d);

  const matches: DayHoliday[] = [];

  for (const h of FIXED_HOLIDAYS) {
    if (h.month === m && h.day === d) {
      matches.push({ zh: h.zh, en: h.en, lineZh: h.lineZh, lineEn: h.lineEn, season: h.season, kind: h.kind });
    }
  }
  for (const h of LUNAR_HOLIDAYS) {
    // 仅匹配非闰月（农历节日的闰月重复日不展示，避免一年过两次）
    if (lunar.month > 0 && Math.abs(lunar.month) === h.month && lunar.day === h.day) {
      matches.push({ zh: h.zh, en: h.en, lineZh: h.lineZh, lineEn: h.lineEn, season: h.season, kind: h.kind });
    }
  }

  if (matches.length === 0) return null;

  matches.sort((a, b) => HOLIDAY_KIND_ORDER[a.kind] - HOLIDAY_KIND_ORDER[b.kind]);
  return matches[0];
}

/**
 * 取 date 时刻的「题记」：
 *   - 有节日 → 节日题记（国内 > 传统 > 国际，冲突时国内优先）
 *   - 无节日 → 节气题记（二十四节气轮换）
 */
export function getMotto(date: Date = new Date()): DayHoliday | SolarTerm {
  return getHoliday(date) ?? getCurrentTerm(date);
}
