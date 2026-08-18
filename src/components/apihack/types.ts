export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type Difficulty = "intro" | "easy" | "medium" | "hard" | "insane";
export type RankColor =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master";
export type TargetType =
  | "bundled-app"
  | "own-repo"
  | "own-pc"
  | "own-phone"
  | "home-network"
  | "vm-lab"
  | "self-build";

export interface Risk {
  label: string;
  severity: Severity;
  mitigation: string;
}

export interface Target {
  type: TargetType;
  label: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  difficulty: Difficulty;
  estMinutes: number;
  target: Target;
  resourceAvailable: boolean;
  resourceNote?: string;
  tools: string[];
  steps: string[];
  legalBoundaries: string[];
  risks: Risk[];
  completionCriteria: string[];
  writeupPrompts: string[];
}

export interface Level {
  id: string;
  rank: number;
  title: string;
  codename: string;
  tagline: string;
  summary: string;
  rankColor: RankColor;
  missions: Mission[];
}
