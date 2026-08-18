// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// Deliberately incomplete: no Content-Security-Policy is set. That's the
// "Reflected Ghosts" mission's fix step — add a restrictive CSP (and any
// other hardening headers you want to practice) here, then re-test the XSS
// payloads and confirm they're now inert.

export function applySecurityHeaders(headers: Headers): Headers {
  // TODO (mission fix): e.g.
  // headers.set(
  //   "Content-Security-Policy",
  //   "default-src 'self'; script-src 'self'; object-src 'none';",
  // );
  return headers;
}
