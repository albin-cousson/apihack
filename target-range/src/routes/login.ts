// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// "The Vault" mission bug: the query below is built with raw string
// concatenation instead of a parameterized query, so `username`/`password`
// go straight into SQL. Try: username = `' OR '1'='1' -- `
//
// FIX (per the mission): rewrite this with bound parameters, e.g.
//   db.query("SELECT * FROM users WHERE username = ? AND password = ?")
//     .get(username, password)

import { db } from "../db";
import { sign } from "../lib/jwt";

export async function handleLogin(req: Request): Promise<Response> {
  // Accept both JSON and form-urlencoded — sqlmap defaults to form-urlencoded
  // so the mission command `sqlmap --data="username=x&password=y"` must work.
  const ct = req.headers.get("content-type") ?? "";
  let body: Record<string, string> = {};
  if (ct.startsWith("application/json")) {
    const parsed = await req.json().catch(() => null);
    if (parsed) body = parsed as Record<string, string>;
  } else {
    const text = await req.text();
    for (const pair of text.split("&")) {
      const [k, v] = pair.split("=", 2);
      if (k) body[k] = v ? decodeURIComponent(v) : "";
    }
  }
  const username = body.username ?? "";
  const password = body.password ?? "";

  // VULNERABLE: raw string-concatenated SQL. Do not copy this pattern.
  const query = `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;
  let user: { id: number; username: string; role: string } | null = null;
  try {
    user = db.query(query).get() as typeof user;
  } catch (err) {
    return Response.json({ error: "query failed", detail: String(err) }, { status: 400 });
  }

  if (!user) {
    return Response.json({ error: "invalid credentials" }, { status: 401 });
  }

  const token = await sign({ sub: user.username, role: user.role });
  return Response.json({ token, user });
}
