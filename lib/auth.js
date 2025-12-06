import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { serialize } from 'cookie';

const TOKEN_NAME = 'gdmc_token';
const MAX_AGE = 60 * 60 * 24 * 30;

export function signUser(user) {
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: MAX_AGE }
  );
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function clearUser() {
  return serialize(TOKEN_NAME, '', { path: '/', maxAge: -1 });
}

export function parseToken(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const tokenCookie = cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${TOKEN_NAME}=`));
  if (!tokenCookie) return null;
  const token = tokenCookie.split('=')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (e) {
    return null;
  }
}

export async function requireUser(req) {
  const payload = parseToken(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { dogs: true, subscription: true } });
  return user;
}

export async function authenticate(email, password) {
  const user = await prisma.user.findUnique({ where: { email }, include: { dogs: true, subscription: true } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}
