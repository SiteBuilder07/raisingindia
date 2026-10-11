// Returns the client IP address from request headers, or 'unknown' if it
// can't be determined. Used for server-side rate limiting and dedupe in
// public backend functions, so throttling never relies on a client-supplied
// value (which an attacker can rotate freely).
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown';
}