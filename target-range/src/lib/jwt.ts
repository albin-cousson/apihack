// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// This is a minimal, hand-rolled JWT implementation with TWO deliberate
// weaknesses for the "Broken Gate" mission:
//
//   1. `verify()` trusts the token's own `header.alg` field. A token signed
//      with `alg: "none"` is accepted with an empty signature.
//   2. Tokens that do carry an HS256 signature are checked against a short,
//      hardcoded, brute-forceable secret.
//
// FIX (per the mission): don't branch on the token's own `alg` header —
// hardcode the expected algorithm server-side, and load the secret from a
// long random env var instead of this constant.

const WEAK_SECRET = "changeme123"; // deliberately weak — crackable with a small wordlist

function base64url(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf8");
}

async function hmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64url(new Uint8Array(sig));
}

export type JwtPayload = { sub: string; role: string; [k: string]: unknown };

export async function sign(payload: JwtPayload): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, WEAK_SECRET);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/** Vulnerable on purpose — see file header. Returns the payload if "valid", else null. */
export async function verify(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;

  let header: { alg?: string };
  let payload: JwtPayload;
  try {
    header = JSON.parse(base64urlDecode(encodedHeader));
    payload = JSON.parse(base64urlDecode(encodedPayload));
  } catch {
    return null;
  }

  // Vulnerability #1: trusting the client-supplied alg.
  if (header.alg === "none") {
    return payload;
  }

  // Vulnerability #2: weak, hardcoded, brute-forceable secret.
  const expected = await hmacSha256(`${encodedHeader}.${encodedPayload}`, WEAK_SECRET);
  return signature === expected ? payload : null;
}
