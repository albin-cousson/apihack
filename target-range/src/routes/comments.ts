// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// "Reflected Ghosts" mission bug (stored variant): comment bodies are
// rendered unescaped. Try posting: <img src=x onerror="alert('stored')">
//
// FIX (per the mission): HTML-escape comment bodies on render.

import { db } from "../db";

export async function handleGetComments(): Promise<Response> {
  const comments = db.query("SELECT id, body, created_at FROM comments ORDER BY id DESC").all() as {
    id: number;
    body: string;
    created_at: string;
  }[];

  const items = comments
    // VULNERABLE: body is interpolated unescaped.
    .map((c) => `<li><strong>#${c.id}</strong> (${c.created_at}): ${c.body}</li>`)
    .join("\n");

  const html = `<!doctype html>
<html>
  <head><title>target-range · comments</title></head>
  <body>
    <h1>Comments</h1>
    <form method="POST" action="/comments">
      <input name="body" placeholder="Say something" />
      <button type="submit">Post</button>
    </form>
    <ul>${items}</ul>
  </body>
</html>`;

  return new Response(html, { headers: { "content-type": "text/html" } });
}

export async function handlePostComment(req: Request): Promise<Response> {
  const contentType = req.headers.get("content-type") ?? "";
  let body = "";

  if (contentType.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    body = json?.body ?? "";
  } else {
    const form = await req.formData().catch(() => null);
    body = (form?.get("body") as string) ?? "";
  }

  if (body) {
    db.query("INSERT INTO comments (body) VALUES (?)").run(body);
  }

  return Response.redirect("/comments", 303);
}
