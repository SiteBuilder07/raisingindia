// Returns the client IP address from request headers, or 'unknown' if it can't
// be determined. Used for server-side rate limiting and dedupe in public backend
// functions, so only values the platform edge sets are trusted: a client can put
// anything it likes in x-forwarded-for, including a fresh random address on every
// request. We therefore prefer the edge-injected headers, and when we fall back
// to x-forwarded-for we take the rightmost entry (the one appended by the proxy
// closest to us) rather than the leftmost, client-supplied one.
export function getClientIp(req: Request): string {
  const headers = req.headers;

  // Injected by the platform's edge proxy — not settable by the caller.
  const edgeIp = headers.get('cf-connecting-ip') || headers.get('x-real-ip');
  if (edgeIp && edgeIp.trim()) return edgeIp.trim();

  // Fallback for other proxies: the last hop is the one our infrastructure
  // recorded, so it cannot be rotated by a script.
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map((hop) => hop.trim()).filter(Boolean);
    const ip = hops[hops.length - 1];
    if (ip) return ip;
  }

  return 'unknown';
}