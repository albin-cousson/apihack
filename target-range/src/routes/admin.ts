// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// "Broken Gate" mission target: reachable only with a token whose decoded
// payload has role: "admin" — including a forged one (see lib/jwt.ts).

import { db } from "../db";
import { verify } from "../lib/jwt";

export async function handleAdminUsers(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = token ? await verify(token) : null;

  if (!payload || payload.role !== "admin") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const users = db.query("SELECT id, username, role FROM users").all();
  return Response.json({ users });
}
