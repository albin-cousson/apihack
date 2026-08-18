// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
import { Database } from "bun:sqlite";
import path from "node:path";

const DB_PATH = path.join(import.meta.dir, "..", "data.db");

export const db = new Database(DB_PATH, { create: true });
