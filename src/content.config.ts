import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const riskSchema = z.object({
  label: z.string(),
  severity: z.enum(["info", "low", "medium", "high", "critical"]),
  mitigation: z.string(),
});

const targetSchema = z.object({
  type: z.enum([
    "bundled-app",
    "own-repo",
    "own-pc",
    "own-phone",
    "home-network",
    "vm-lab",
    "self-build",
  ]),
  label: z.string(),
});

const missionSchema = z.object({
  id: z.string(),
  title: z.string(),
  objective: z.string(),
  difficulty: z.enum(["intro", "easy", "medium", "hard", "insane"]),
  estMinutes: z.number(),
  target: targetSchema,
  resourceAvailable: z.boolean(),
  resourceNote: z.string().optional(),
  tools: z.array(z.string()),
  steps: z.array(z.string()),
  legalBoundaries: z.array(z.string()),
  risks: z.array(riskSchema),
  completionCriteria: z.array(z.string()),
  writeupPrompts: z.array(z.string()),
});

const levels = defineCollection({
  loader: file("src/data/levels.json"),
  schema: z.object({
    id: z.string(),
    rank: z.number(),
    title: z.string(),
    codename: z.string(),
    tagline: z.string(),
    summary: z.string(),
    rankColor: z.enum([
      "bronze",
      "silver",
      "gold",
      "platinum",
      "diamond",
      "master",
    ]),
    missions: z.array(missionSchema),
  }),
});

export const collections = { levels };
