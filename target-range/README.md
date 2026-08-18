# ⚠️ target-range — intentionally vulnerable, LOCAL PRACTICE ONLY

This is the bundled practice target for Apihack's **Silver** rank
(`Web Exploitation`). Every bug in this app is **on purpose**. It exists so
Silver never blocks on "I don't have a resource to hack" — you always have
this.

## Rules

- **Never expose this beyond `127.0.0.1`.** It binds to localhost only by
  default (`src/index.ts`) — do not change that, do not port-forward it, do
  not deploy it to a public host, do not put it behind a tunnel (ngrok,
  Cloudflare Tunnel, etc.).
- It stores plaintext passwords and uses a deliberately weak JWT secret.
  That's the point of the exercise — it is not a template for real code.
- Treat every "fix it" step in the Apihack mission cards as the actual goal:
  the point isn't just to break it, it's to leave it patched.

## Run it

```bash
bun install          # from the repo root, or inside target-range/
bun run target-range:seed   # (from repo root) resets the DB to a clean seed state
bun run target-range        # (from repo root) starts the server on http://127.0.0.1:4243
```

## What's in here, on purpose

| Route | Bug | Mission |
|---|---|---|
| `POST /login` | SQL injection (raw string-concatenated query) | The Vault |
| `GET /search?q=` | Reflected XSS (unescaped output) | Reflected Ghosts |
| `GET/POST /comments` | Stored XSS (unescaped output) | Reflected Ghosts |
| `POST /login` (token issuance) | Weak/forgeable JWT (`alg: none` + weak HMAC secret) | Broken Gate |
| `GET /api/admin/users` | Trusts the forged token's `role` claim | Broken Gate |

Fix each one in place (`src/routes/login.ts`, `src/middleware.ts`,
`src/lib/jwt.ts`) as described in its mission card, then re-run the same
exploit and confirm it now fails.
