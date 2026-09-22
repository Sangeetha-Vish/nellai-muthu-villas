import { jwtVerify } from 'jose';
import { env } from '../config/env.js';

const key = new TextEncoder().encode(env.jwtSecret);

function readCookie(header, name) {
  const value = header?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

export async function readSession(request) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '') || readCookie(request.headers.cookie, 'session');
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function requireAuth(request, response, next) {
  const session = await readSession(request);
  if (!session?.user?.id) return response.status(401).json({ message: 'Unauthorized' });
  request.session = session;
  next();
}

export async function requireAdmin(request, response, next) {
  const session = await readSession(request);
  if (!session?.user || !['OWNER', 'BRANCH_MANAGER'].includes(session.user.role)) {
    return response.status(401).json({ message: 'Unauthorized' });
  }
  request.session = session;
  next();
}

export function setSessionCookie(response, token, expires) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${secure}`);
}

export function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
}
