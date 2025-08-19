export type RoundType = "Behavioral" | "Coding" | "System Design";

export interface RoundCfg { type: RoundType }

export interface SessionOut {
  id: string;
  company: string;
  rounds: RoundCfg[];
  current: number;
}
