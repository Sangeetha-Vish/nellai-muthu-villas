import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { env } from '../config/env.js';
import { prisma } from '../utils/prisma.js';

const key = new TextEncoder().encode(env.jwtSecret);

export async function createSession(user) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ user, expires })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
  return { token, expires };
}

export async function loginUser({ email, password }, adminOnly = false) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || (adminOnly && !['OWNER', 'BRANCH_MANAGER'].includes(user.role))) return null;
  if (!await bcrypt.compare(password, user.password)) return null;
  return { user, session: await createSession({ id: user.id, email: user.email, name: user.name, role: user.role, branchId: user.branchId }) };
}

export async function signupUser({ email, password, name, phone }) {
  if (await prisma.user.findUnique({ where: { email } })) return { exists: true };
  const user = await prisma.user.create({ data: { email, password: await bcrypt.hash(password, 10), name: name || '', phone: phone || '' } });
  return { user, session: await createSession({ id: user.id, email: user.email, name: user.name, role: user.role }) };
}
