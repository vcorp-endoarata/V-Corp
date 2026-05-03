/**
 * ルールベースの危機表現検知。
 *
 * 設計方針:
 * - 当事者の自然な吐露を「禁止」しない (投稿は隠さない)
 * - 検出時は投稿者本人にだけ、優しく相談先を提示する
 * - 偽陽性 (普通の発言を危機と誤判定) を最小化
 * - 偽陰性 (本当の危機の見落とし) は通報・人力で補完
 *
 * 重要: AI ではなくキーワードのみのため、文脈理解は限定的。
 *      誤検出はある前提で、UI も「ご無理せず」「もしよかったら」など
 *      非強制的なトーンで表示する。
 */

export type CrisisSeverity = "high" | "medium" | "low";

export type CrisisResult = {
  detected: boolean;
  severity: CrisisSeverity | null;
  matched: string[];
};

/** 直接的な希死念慮 (高) */
const DIRECT_IDEATION = [
  "死にたい",
  "死のう",
  "死のうかな",
  "死ねたら",
  "自殺したい",
  "自殺する",
  "自殺しよう",
  "消えたい",
  "消えてしまいたい",
  "終わらせたい",
  "終わりにしたい",
  "いなくなりたい",
];

/** 手段の言及 (高) */
const METHOD_MENTION = [
  "首吊り",
  "首をくくる",
  "首つろう",
  "リスカ",
  "リストカット",
  "オーバードーズ",
  "OD",
  "飛び降り",
  "飛び降りよう",
  "飛び降りたい",
  "練炭",
];

/** 自傷 (中〜高) */
const SELF_HARM = [
  "自傷したい",
  "自傷してる",
  "自分を傷つけたい",
  "自分を傷つけ",
  "腕を切",
  "手首を切",
];

/** 強い絶望 (中) */
const HOPELESSNESS = [
  "生きてる意味がない",
  "生きる意味がない",
  "生きてる意味ない",
  "生きる意味ない",
  "生きてる価値がない",
  "存在価値がない",
  "もう生きていけない",
  "限界",
];

/**
 * 偽陽性判定用パターン。
 * これらが付近にあれば「危機ではない」と判定して除外する。
 */
const FALSE_POSITIVE_GUARDS = [
  // 過去の話 + 回復
  /(死にたかった|思った)(けど|が|ものの|時もあった|時期もあった|頃もあった)/,
  // 否定
  /死にたく(ない|ありません)/,
  /消えたく(ない|ありません)/,
  // 引用・第三者の話
  /[「『"][^」』"]*(死にたい|消えたい|自殺)[^」』"]*[」』"]/,
  /(って|と)(言われ|聞いた|書いてあ|思った人)/,
  // 教育・予防
  /自殺(対策|予防|防止|相談|について話|を防)/,
  /(死にたい|自殺)(という|っていう)(気持ち|想い|思い|感情|言葉|表現)を(もつ|抱え|理解)/,
  // 比喩・誇張
  /(暑くて|寒くて|眠くて|忙しくて|疲れすぎて|笑い)(死に|死ん)/,
  /死ぬほど(疲れ|忙しい|眠い|笑った|暑い|寒い|お腹|美味しい|可愛い|幸せ|嬉しい)/,
];

function hasFalsePositiveContext(text: string): boolean {
  return FALSE_POSITIVE_GUARDS.some((rx) => rx.test(text));
}

function findMatches(text: string, list: string[]): string[] {
  return list.filter((kw) => text.includes(kw));
}

/**
 * テキストに危機表現が含まれるかを判定する。
 *
 * @param raw 投稿本文 (改行・全角空白等含む)
 * @returns 検知結果。severity が高いほど早急な対応が望ましい。
 */
export function detectCrisis(raw: string): CrisisResult {
  // 全角→半角・空白除去・小文字化で安定化
  const normalized = raw
    .replace(/\s+/g, "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0),
    )
    .toLowerCase();

  const direct = findMatches(normalized, DIRECT_IDEATION);
  const method = findMatches(normalized, METHOD_MENTION);
  const selfHarm = findMatches(normalized, SELF_HARM);
  const hopeless = findMatches(normalized, HOPELESSNESS);

  const allMatched = [...direct, ...method, ...selfHarm, ...hopeless];

  if (allMatched.length === 0) {
    return { detected: false, severity: null, matched: [] };
  }

  // 偽陽性ガードに合致したら見送り
  // (過去形での回復表現、否定、引用、教育、比喩・誇張)
  if (hasFalsePositiveContext(raw)) {
    return { detected: false, severity: null, matched: [] };
  }

  // 直接表現 or 手段言及 → 高
  if (direct.length > 0 || method.length > 0) {
    return { detected: true, severity: "high", matched: allMatched };
  }
  // 自傷 → 中
  if (selfHarm.length > 0) {
    return { detected: true, severity: "medium", matched: allMatched };
  }
  // 絶望のみ → 低 (UI上は表示しないことも検討)
  return { detected: true, severity: "low", matched: allMatched };
}
