import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle } from "lucide-react";
import type { Level, Mission } from "./types";
import {
  DifficultyBadge,
  EstTime,
  RankBadge,
  ResourceBadge,
  RiskBadge,
  TargetBadge,
  rankBarClassName,
  rankTextClassName,
} from "./badges";
import { isComplete, toggleComplete, countComplete } from "./progress";

function MissionDetail({ mission }: { mission: Mission }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isComplete(mission.id));
  }, [mission.id]);

  return (
    <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden border-border bg-card">
      <DialogHeader className="shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={mission.difficulty} />
          <EstTime minutes={mission.estMinutes} />
          <ResourceBadge available={mission.resourceAvailable} />
        </div>
        <DialogTitle className="font-mono text-xl">{mission.title}</DialogTitle>
        <DialogDescription className="text-foreground/80">{mission.objective}</DialogDescription>
      </DialogHeader>

      <ScrollArea className="min-h-0 flex-1 pr-4">
        <div className="space-y-5 text-sm">
          <div>
            <TargetBadge type={mission.target.type} label={mission.target.label} />
            {!mission.resourceAvailable && mission.resourceNote && (
              <p className="mt-2 rounded-md border border-risk-medium/30 bg-risk-medium/10 p-3 text-xs text-risk-medium">
                <strong className="font-mono uppercase tracking-wide">Resource gap — </strong>
                {mission.resourceNote}
              </p>
            )}
          </div>

          {mission.tools.length > 0 && (
            <section>
              <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Tools</h4>
              <div className="flex flex-wrap gap-1.5">
                {mission.tools.map((t) => (
                  <span key={t} className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 font-mono text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">How to do it</h4>
            <ol className="list-decimal space-y-2 pl-5 marker:font-mono marker:text-primary">
              {mission.steps.map((s, i) => (
                <li key={i} className="leading-relaxed">
                  {s}
                </li>
              ))}
            </ol>
          </section>

          <Separator />

          <section>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-risk-medium">Legal boundaries</h4>
            <ul className="space-y-1.5">
              {mission.legalBoundaries.map((b, i) => (
                <li key={i} className="flex gap-2 leading-relaxed text-foreground/90">
                  <span className="text-risk-medium">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Risks</h4>
            <div className="space-y-2">
              {mission.risks.map((r, i) => (
                <div key={i} className="rounded-md border border-border bg-secondary/30 p-2.5">
                  <div className="mb-1 flex items-center gap-2">
                    <RiskBadge severity={r.severity} />
                    <span className="font-medium">{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Mitigation: {r.mitigation}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Completion criteria</h4>
            <ul className="space-y-1.5">
              {mission.completionCriteria.map((c, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-primary">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>

          {mission.writeupPrompts.length > 0 && (
            <section>
              <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Write it up</h4>
              <ul className="space-y-1.5">
                {mission.writeupPrompts.map((p, i) => (
                  <li key={i} className="italic leading-relaxed text-foreground/80">
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </ScrollArea>

      <button
        type="button"
        onClick={() => setDone(toggleComplete(mission.id))}
        className="mt-2 inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-secondary/60 data-[done=true]:border-primary/50 data-[done=true]:bg-primary/10 data-[done=true]:text-primary"
        data-done={done}
      >
        {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
        {done ? "Marked complete" : "Mark as complete"}
      </button>
    </DialogContent>
  );
}

function MissionCard({ mission }: { mission: Mission }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(isComplete(mission.id));
  }, [mission.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group cursor-pointer border-border bg-card/60 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_0_1px_var(--color-primary)_inset,0_8px_24px_-12px_rgba(34,197,94,0.35)]"
          data-done={done}
        >
          <CardHeader className="gap-2 px-4">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="font-mono text-base leading-snug">{mission.title}</CardTitle>
              {done ? (
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground/40" />
              )}
            </div>
            <p className="line-clamp-2 text-xs text-muted-foreground">{mission.objective}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={mission.difficulty} />
              <EstTime minutes={mission.estMinutes} />
            </div>
            {!mission.resourceAvailable && <ResourceBadge available={false} />}
          </CardHeader>
        </Card>
      </DialogTrigger>
      <MissionDetail mission={mission} />
    </Dialog>
  );
}

function LevelSection({ level }: { level: Level }) {
  const missionIds = useMemo(() => level.missions.map((m) => m.id), [level.missions]);
  const [complete, setComplete] = useState(0);

  useEffect(() => {
    setComplete(countComplete(missionIds));
    const onStorage = () => setComplete(countComplete(missionIds));
    window.addEventListener("storage", onStorage);
    const interval = setInterval(onStorage, 800);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [missionIds]);

  const total = level.missions.length;
  const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <section id={level.id} className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <RankBadge rankColor={level.rankColor}>Rank {level.rank} · {level.codename}</RankBadge>
          </div>
          <h2 className="font-mono text-2xl font-semibold tracking-tight">{level.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{level.tagline}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-muted-foreground">
            {complete}/{total} missions
          </div>
          <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${rankBarClassName(level.rankColor)}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-foreground/80">{level.summary}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {level.missions.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </div>
    </section>
  );
}

function OverallProgress({ levels }: { levels: Level[] }) {
  const allIds = useMemo(() => levels.flatMap((l) => l.missions.map((m) => m.id)), [levels]);
  const [complete, setComplete] = useState(0);

  useEffect(() => {
    setComplete(countComplete(allIds));
    const tick = () => setComplete(countComplete(allIds));
    window.addEventListener("storage", tick);
    const interval = setInterval(tick, 800);
    return () => {
      window.removeEventListener("storage", tick);
      clearInterval(interval);
    };
  }, [allIds]);

  const currentLevel =
    [...levels]
      .sort((a, b) => a.rank - b.rank)
      .find((l) => countComplete(l.missions.map((m) => m.id)) < l.missions.length) ??
    levels[levels.length - 1];

  const total = allIds.length;
  const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <div className="mb-14 flex flex-col gap-4 rounded-xl border border-border bg-card/50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Current focus</div>
        <div className={`mt-1 font-mono text-lg font-semibold ${
          currentLevel ? rankTextClassName(currentLevel.rankColor) : ""
        }`}>
          {currentLevel ? `${currentLevel.codename} · ${currentLevel.title}` : "All ranks complete"}
        </div>
      </div>
      <div className="sm:w-64">
        <div className="mb-1.5 flex justify-between font-mono text-xs text-muted-foreground">
          <span>{complete}/{total} missions</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function LevelBoard({ levels }: { levels: Level[] }) {
  const sorted = useMemo(() => [...levels].sort((a, b) => a.rank - b.rank), [levels]);
  return (
    <div>
      <OverallProgress levels={sorted} />
      <div className="space-y-16">
        {sorted.map((level) => (
          <LevelSection key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
}
