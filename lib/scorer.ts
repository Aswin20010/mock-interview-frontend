export type Score = {
  star: number;        // 0..1
  clarity: number;     // 0..1
  impact: number;      // 0..1
  final_score: number; // 0..100
  strengths: string[];
  improvements: string[];
  summary: string;
};

// quick keyword heuristics so you have real feedback without LLMs.
// later you can call your backend and keep the same shape.
export function scoreBehavioral(answer: string): Score {
  const a = (answer || "").toLowerCase();

  const starKeys = {
    situation: ["situation", "context", "background"],
    task: ["task", "responsible", "goal", "objective"],
    action: ["action", "i", "implemented", "built", "designed", "led"],
    result: ["result", "impact", "outcome", "reduced", "increased", "improved"],
  };

  const has = (words: string[]) => words.some((w) => a.includes(w));

  const starHits =
    (has(starKeys.situation) ? 1 : 0) +
    (has(starKeys.task) ? 1 : 0) +
    (has(starKeys.action) ? 1 : 0) +
    (has(starKeys.result) ? 1 : 0);

  const numbers = (answer.match(/\b\d+(\.\d+)?\b/g) || []).length;
  const percent = (answer.match(/%/g) || []).length;
  const metricsHits = numbers + percent;

  const words = answer.trim().split(/\s+/).length;
  const sentences = (answer.match(/[.!?]/g) || []).length;

  const star = Math.min(1, starHits / 4);            // 0..1
  const impact = Math.min(1, metricsHits / 3);        // some numbers/percent = more impact
  const clarity = Math.min(1, Math.max(0.2, sentences / 6)); // a few sentences -> clearer

  const final = Math.round((star * 0.5 + clarity * 0.2 + impact * 0.3) * 100);

  const strengths: string[] = [];
  if (starHits >= 3) strengths.push("Good STAR coverage");
  if (metricsHits >= 1) strengths.push("Includes metrics/quantification");
  if (sentences >= 4) strengths.push("Clear multi‑sentence narrative");

  const improvements: string[] = [];
  if (starHits < 4) improvements.push("Cover all STAR parts (Situation, Task, Action, Result)");
  if (metricsHits === 0) improvements.push("Quantify impact (%, time, cost, revenue)");
  if (words > 200) improvements.push("Tighten to 1–2 minutes");

  return {
    star,
    clarity,
    impact,
    final_score: final,
    strengths,
    improvements,
    summary:
      "Heuristic score. Add explicit Result with measurable metrics to improve.",
  };
}
