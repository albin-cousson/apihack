const STORAGE_KEY = "apihack:progress:v1";

type ProgressMap = Record<string, boolean>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isComplete(missionId: string): boolean {
  return Boolean(read()[missionId]);
}

export function toggleComplete(missionId: string): boolean {
  const map = read();
  const next = !map[missionId];
  map[missionId] = next;
  write(map);
  return next;
}

export function getAllProgress(): ProgressMap {
  return read();
}

export function countComplete(missionIds: string[]): number {
  const map = read();
  return missionIds.filter((id) => map[id]).length;
}
