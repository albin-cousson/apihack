// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// Binds to 127.0.0.1 only, on purpose. Do not change the hostname to "0.0.0.0"
// or expose this port beyond localhost — this app has no business being
// reachable from anywhere but your own machine.

import { handleLogin } from "./routes/login";
import { handleSearch } from "./routes/search";
import { handleGetComments, handlePostComment } from "./routes/comments";
import { handleAdminUsers } from "./routes/admin";
import { applySecurityHeaders } from "./middleware";
import { db } from "./db";

let userCount = 0;
try {
  userCount = (db.query("SELECT COUNT(*) AS n FROM users").get() as { n: number } | null)?.n ?? 0;
} catch {
  // table doesn't exist yet — falls through to the warning below
}
if (userCount === 0) {
  console.warn("[target-range] No seed data found — run `bun run target-range:seed` from the repo root first.\n");
}

const PORT = 4243;
const HOME = `<!doctype html>
<html>
  <head><title>target-range</title></head>
  <body style="font-family: system-ui; max-width: 640px; margin: 3rem auto; line-height: 1.5;">
    <h1>⚠️ target-range</h1>
    <p><strong>Intentionally vulnerable. LOCAL PRACTICE ONLY.</strong>
       Never expose this beyond localhost. See README.md.</p>
    <ul>
      <li><a href="/search?q=hello">/search?q=</a> — reflected XSS</li>
      <li><a href="/comments">/comments</a> — stored XSS, GET/POST</li>
      <li><code>POST /login</code> — SQL injection + weak JWT (see Apihack mission cards)</li>
      <li><code>GET /api/admin/users</code> — requires an admin-role JWT</li>
    </ul>
  </body>
</html>`;

Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    let res: Response;
    if (url.pathname === "/" && req.method === "GET") {
      res = new Response(HOME, { headers: { "content-type": "text/html" } });
    } else if (url.pathname === "/login" && req.method === "POST") {
      res = await handleLogin(req);
    } else if (url.pathname === "/search" && req.method === "GET") {
      res = handleSearch(req);
    } else if (url.pathname === "/comments" && req.method === "GET") {
      res = await handleGetComments();
    } else if (url.pathname === "/comments" && req.method === "POST") {
      res = await handlePostComment(req);
    } else if (url.pathname === "/api/admin/users" && req.method === "GET") {
      res = await handleAdminUsers(req);
    } else {
      res = new Response("not found", { status: 404 });
    }

    applySecurityHeaders(res.headers);
    return res;
  },
});

console.warn(
  "\n⚠️  target-range is running at http://127.0.0.1:" +
    PORT +
    "\n   Intentionally vulnerable. LOCAL PRACTICE ONLY. Never expose this publicly.\n",
);
