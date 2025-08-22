export type RoundType = "Behavioral" | "Coding" | "System Design";

export type Session = {
  id: string;
  company: string;
  rounds: { type: RoundType }[];
  current: number;
  answers: { round: number; text: string }[]; // 👈 store answers
  currentQuestion?: string;
};

const store = new Map<string, Session>();

export function saveSession(s: Session) {
  store.set(s.id, s);
}

export function createSession(payload: { company: string; rounds: { type: RoundType }[]; id: string }) {
  const s: Session = { id: payload.id, company: payload.company, rounds: payload.rounds, current: 0, answers: [] };
  saveSession(s);
  return s;
}

export function getSession(id: string) {
  return store.get(id) || null;
}

export function addAnswer(id: string, round: number, text: string) {
  const s = store.get(id);
  if (!s) return null;
  s.answers.push({ round, text });
  return s;
}
