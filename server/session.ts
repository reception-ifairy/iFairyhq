import crypto from 'crypto';
import type { Response, Request } from 'express';

const b64u = (buf: Buffer) =>
  buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const hmac = (secret: string, input: string) =>
  b64u(crypto.createHmac('sha256', secret).update(input).digest());

const getSecretOptional = () => {
  const secret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  return secret || null;
};

export const setAdminSession = (res: Response, adminId: string) => {
  const secret = getSecretOptional();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  const payload = JSON.stringify({ adminId, iat: Date.now() });
  const encoded = b64u(Buffer.from(payload, 'utf8'));
  const sig = hmac(secret, encoded);
  const value = `${encoded}.${sig}`;
  res.cookie('ifairy_admin', value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
};

export const clearAdminSession = (res: Response) => {
  res.clearCookie('ifairy_admin', { path: '/' });
};

export const getAdminIdFromRequest = (req: Request): string | null => {
  const secret = getSecretOptional();
  if (!secret) return null;
  const raw = (req.cookies?.ifairy_admin || '').toString();
  const [encoded, sig] = raw.split('.');
  if (!encoded || !sig) return null;
  const expected = hmac(secret, encoded);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const json = Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    return typeof parsed?.adminId === 'string' ? parsed.adminId : null;
  } catch {
    return null;
  }
};
