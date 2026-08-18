import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Globe,
  Laptop,
  Smartphone,
  Wifi,
  Box,
  Hammer,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Clock,
} from "lucide-react";
import type { Difficulty, RankColor, Severity, TargetType } from "./types";

const severityStyle: Record<Severity, string> = {
  info: "bg-risk-info/15 text-risk-info border-risk-info/30",
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  high: "bg-risk-high/15 text-risk-high border-risk-high/30",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export function RiskBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wide ${severityStyle[severity]}`}>
      {severity}
    </Badge>
  );
}

const difficultyStyle: Record<Difficulty, string> = {
  intro: "bg-risk-info/15 text-risk-info border-risk-info/30",
  easy: "bg-risk-low/15 text-risk-low border-risk-low/30",
  medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  hard: "bg-risk-high/15 text-risk-high border-risk-high/30",
  insane: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wide ${difficultyStyle[difficulty]}`}>
      {difficulty}
    </Badge>
  );
}

const rankStyle: Record<RankColor, string> = {
  bronze: "text-rank-bronze border-rank-bronze/40 bg-rank-bronze/10",
  silver: "text-rank-silver border-rank-silver/40 bg-rank-silver/10",
  gold: "text-rank-gold border-rank-gold/40 bg-rank-gold/10",
  platinum: "text-rank-platinum border-rank-platinum/40 bg-rank-platinum/10",
  diamond: "text-rank-diamond border-rank-diamond/40 bg-rank-diamond/10",
  master: "text-rank-master border-rank-master/40 bg-rank-master/10",
};

export function RankBadge({ rankColor, children }: { rankColor: RankColor; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={`font-mono text-[11px] uppercase tracking-widest ${rankStyle[rankColor]}`}>
      {children}
    </Badge>
  );
}

const rankBarClass: Record<RankColor, string> = {
  bronze: "bg-rank-bronze",
  silver: "bg-rank-silver",
  gold: "bg-rank-gold",
  platinum: "bg-rank-platinum",
  diamond: "bg-rank-diamond",
  master: "bg-rank-master",
};

export function rankBarClassName(rankColor: RankColor): string {
  return rankBarClass[rankColor];
}

const rankTextClassMap: Record<RankColor, string> = {
  bronze: "text-rank-bronze",
  silver: "text-rank-silver",
  gold: "text-rank-gold",
  platinum: "text-rank-platinum",
  diamond: "text-rank-diamond",
  master: "text-rank-master",
};

export function rankTextClassName(rankColor: RankColor): string {
  return rankTextClassMap[rankColor];
}

const targetIcon: Record<TargetType, React.ComponentType<{ className?: string }>> = {
  "bundled-app": Box,
  "own-repo": GitBranch,
  "own-pc": Laptop,
  "own-phone": Smartphone,
  "home-network": Wifi,
  "vm-lab": Box,
  "self-build": Hammer,
};

export function TargetBadge({ type, label }: { type: TargetType; label: string }) {
  const Icon = targetIcon[type] ?? Globe;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

export function ResourceBadge({ available }: { available: boolean }) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-risk-low">
        <ShieldCheck className="size-3.5" />
        Resource ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-risk-medium">
      <ShieldQuestion className="size-3.5" />
      Resource gap
    </span>
  );
}

export function EstTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="size-3.5" />
      ~{minutes} min
    </span>
  );
}

export { ShieldAlert };
