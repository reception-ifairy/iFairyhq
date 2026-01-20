import crypto from 'crypto';

const b64u = (buf: Buffer) =>
  buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const unb64u = (s: string) => {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64');
};

const getKey = () => {
  const raw = (process.env.ENCRYPTION_KEY || '').trim();
  if (!raw) throw new Error('ENCRYPTION_KEY is not set');
  const buf = Buffer.from(raw, raw.length === 64 && /^[0-9a-f]+$/i.test(raw) ? 'hex' : 'utf8');
  if (buf.length < 32) throw new Error('ENCRYPTION_KEY must be at least 32 bytes');
  return crypto.createHash('sha256').update(buf).digest(); // 32 bytes
};

export const encrypt = (plaintext: string) => {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${b64u(iv)}.${b64u(tag)}.${b64u(enc)}`;
};

export const decrypt = (ciphertext: string) => {
  if (!ciphertext) return '';
  if (!ciphertext.startsWith('v1.')) return ciphertext; // backward compatibility
  const parts = ciphertext.split('.');
  if (parts.length !== 4) throw new Error('invalid ciphertext');
  const [, ivB64, tagB64, dataB64] = parts;
  const key = getKey();
  const iv = unb64u(ivB64);
  const tag = unb64u(tagB64);
  const data = unb64u(dataB64);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(data), decipher.final()]);
  return out.toString('utf8');
};

