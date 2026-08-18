// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// "Reflected Ghosts" mission bug: `q` is dropped straight into the HTML
// response with no escaping. Try: ?q=<script>alert(document.cookie)</script>
//
// FIX (per the mission): HTML-escape `q` before interpolating it, and add a
// CSP via middleware.ts as a defense-in-depth layer.

export function handleSearch(req: Request): Response {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";

  const html = `<!doctype html>
<html>
  <head><title>target-range · search</title></head>
  <body>
    <h1>Search</h1>
    <form>
      <input name="q" value="${q}" />
      <button type="submit">Search</button>
    </form>
    <!-- VULNERABLE: q is reflected unescaped below -->
    <p>Results for: ${q}</p>
    <p><em>(no real results — this endpoint exists to demonstrate reflected XSS)</em></p>
  </body>
</html>`;

  return new Response(html, { headers: { "content-type": "text/html" } });
}
