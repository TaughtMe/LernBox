/// <reference types="@cloudflare/workers-types" />

// Env-Definition für Pages Functions
export interface Env {
  BASIC_AUTH_USER?: string;
  BASIC_AUTH_PASS?: string;
}

// Globales Middleware: fragt einmal Basic-Auth (PIN) ab, bevor die App lädt
export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const user = env.BASIC_AUTH_USER || 'lernbox';
  const pass = env.BASIC_AUTH_PASS; // gemeinsamer PIN aus Pages-Env

  // Kein PIN gesetzt → nicht blocken
  if (!pass) return next();

  const auth = request.headers.get('Authorization') || '';
  const [scheme, b64] = auth.split(' ');
  if (scheme !== 'Basic' || !b64) return unauthorized();

  let decoded = '';
  try {
    decoded = atob(b64);
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(':');
  const u = idx >= 0 ? decoded.slice(0, idx) : '';
  const p = idx >= 0 ? decoded.slice(idx + 1) : '';

  if (safeEqual(u, user) && safeEqual(p, pass)) return next();
  return unauthorized();

  function unauthorized(): Response {
    return new Response('Authorization required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="LernBox"',
        'Cache-Control': 'no-store',
      },
    });
  }
};

// Zeitkonstantes Vergleichen gegen Timing-Angriffe
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
