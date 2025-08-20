// Simple in-memory store for dev/mock mode
type Session = {
  id: string;
  company: string;
  rounds: { type: "Behavioral" | "Coding" | "System Design" }[];
  current: number;
};

const store = new Map<string, Session>();

export function saveSession(s: Session) {
  store.set(s.id, s);
}

export function getSession(id: string) {
  return store.get(id) || null;
}
