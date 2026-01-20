import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const candidates = (() => {
  const explicit = (process.env.DOTENV_PATH || '').trim();
  if (explicit) return [explicit];
  const cwd = process.cwd();
  return [path.join(cwd, 'server', '.env'), path.join(cwd, '.env')];
})();

for (const p of candidates) {
  try {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  } catch {
    // ignore
  }
}

