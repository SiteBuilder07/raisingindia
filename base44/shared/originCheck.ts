// Allowed origins for browser requests from the app's own frontend.
// Server-side calls (no Origin header) pass through — they're protected by
// input validation and rate limiting inside each function.
const ALLOWED_ORIGINS = new Set([
  'https://raisingindia.base44.app',
  'https://raisingindia.net',
  'http://localhost:5173',
  'http://localhost:3000',
]);

// Returns true if the request is from an allowed origin or has no Origin
// header (server-side call). Returns false if a browser from another domain
// is trying to call the function directly.
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('Origin');
  if (!origin) return true;
  return ALLOWED_ORIGINS.has(origin);
}