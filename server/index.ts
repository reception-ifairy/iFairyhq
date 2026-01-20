import './env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import cookieParser from 'cookie-parser';
import { requireAdminToken } from './auth';
import { query } from './db';
import { uuid } from './ids';
import { clearAdminSession, getAdminIdFromRequest, setAdminSession } from './session';
import { decrypt, encrypt } from './crypto';
import { google } from 'googleapis';
import {
  zUuid,
  zProductUpsert,
  zBotUpsert,
  zToolUpsert,
  zFrontpageModuleUpsert,
  zLeadCreate,
  zCredentialUpsert,
} from './validate';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: false }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const db = await query<any>('SELECT 1 AS ok');
    res.json({ ok: true, dbOk: true, db: (db as any)[0]?.ok ?? 1 });
  } catch (e: any) {
    res.json({ ok: true, dbOk: false, dbError: e?.message || String(e) });
  }
});

// Session check endpoint (no auth required)
app.get('/api/me', async (req, res) => {
  const adminId = getAdminIdFromRequest(req);
  if (!adminId) return res.json({ loggedIn: false });
  const rows = await query<any[]>('SELECT id, email, full_name, role FROM `admin_user` WHERE id=:id LIMIT 1', { id: adminId });
  if (!rows.length) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, user: rows[0] });
});

// Logout endpoint (no auth required)
app.post('/api/logout', (_req, res) => {
  clearAdminSession(res);
  res.json({ ok: true });
});

app.use('/api', requireAdminToken);

const parseBody = <T extends z.ZodTypeAny>(schema: T, body: unknown) => schema.parse(body) as z.infer<T>;

// --- PRODUCTS
app.get('/api/products', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, name, slug, description, status, created_at FROM `product` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.post('/api/products', async (req, res) => {
  const data = parseBody(zProductUpsert, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `product` (id, name, slug, description, status) VALUES (:id, :name, :slug, :description, :status)',
    { id, ...data }
  );
  res.json({ id });
});

app.put('/api/products/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  const data = parseBody(zProductUpsert, req.body);
  await query(
    'UPDATE `product` SET name=:name, slug=:slug, description=:description, status=:status WHERE id=:id',
    { id, ...data }
  );
  res.json({ ok: true });
});

app.delete('/api/products/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `product` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- BOTS
app.get('/api/bots', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, name, slug, description, model, prompt, temperature, is_active, created_at FROM `bot` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.post('/api/bots', async (req, res) => {
  const data = parseBody(zBotUpsert, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `bot` (id, name, slug, description, model, prompt, temperature, is_active) VALUES (:id,:name,:slug,:description,:model,:prompt,:temperature,:is_active)',
    { id, ...data, is_active: data.is_active ? 1 : 0 }
  );
  res.json({ id });
});

app.put('/api/bots/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  const data = parseBody(zBotUpsert, req.body);
  await query(
    'UPDATE `bot` SET name=:name, slug=:slug, description=:description, model=:model, prompt=:prompt, temperature=:temperature, is_active=:is_active WHERE id=:id',
    { id, ...data, is_active: data.is_active ? 1 : 0 }
  );
  res.json({ ok: true });
});

app.delete('/api/bots/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `bot` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- TOOLS
app.get('/api/tools', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, name, slug, description, endpoint, created_at FROM `tool` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.post('/api/tools', async (req, res) => {
  const data = parseBody(zToolUpsert, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `tool` (id, name, slug, description, endpoint) VALUES (:id,:name,:slug,:description,:endpoint)',
    { id, ...data }
  );
  res.json({ id });
});

app.put('/api/tools/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  const data = parseBody(zToolUpsert, req.body);
  await query(
    'UPDATE `tool` SET name=:name, slug=:slug, description=:description, endpoint=:endpoint WHERE id=:id',
    { id, ...data }
  );
  res.json({ ok: true });
});

app.delete('/api/tools/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `tool` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- FRONTPAGE MODULES (sortable)
app.get('/api/frontpage-modules', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, `key`, title, is_enabled, sort_order, content, updated_at FROM `frontpage_module` ORDER BY sort_order ASC, updated_at DESC'
  );
  res.json(rows);
});

app.post('/api/frontpage-modules', async (req, res) => {
  const data = parseBody(zFrontpageModuleUpsert, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `frontpage_module` (id, `key`, title, is_enabled, sort_order, content) VALUES (:id,:key,:title,:is_enabled,:sort_order,:content)',
    {
      id,
      key: data.key,
      title: data.title,
      is_enabled: data.is_enabled ? 1 : 0,
      sort_order: data.sort_order,
      content: JSON.stringify(data.content ?? {}),
    }
  );
  res.json({ id });
});

app.put('/api/frontpage-modules/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  const data = parseBody(zFrontpageModuleUpsert.partial(), req.body);
  const patch: Record<string, any> = { id };
  const sets: string[] = [];
  if (typeof data.key === 'string') {
    sets.push('`key`=:key');
    patch.key = data.key;
  }
  if ('title' in data) {
    sets.push('title=:title');
    patch.title = data.title ?? null;
  }
  if (typeof data.is_enabled === 'boolean') {
    sets.push('is_enabled=:is_enabled');
    patch.is_enabled = data.is_enabled ? 1 : 0;
  }
  if (typeof data.sort_order === 'number') {
    sets.push('sort_order=:sort_order');
    patch.sort_order = data.sort_order;
  }
  if ('content' in data) {
    sets.push('content=:content');
    patch.content = JSON.stringify((data as any).content ?? {});
  }
  if (!sets.length) return res.json({ ok: true });
  await query(`UPDATE \`frontpage_module\` SET ${sets.join(', ')} WHERE id=:id`, patch);
  res.json({ ok: true });
});

app.put('/api/frontpage-modules/order', async (req, res) => {
  const body = z.array(z.object({ id: zUuid, sort_order: z.number().int() })).parse(req.body);
  for (const row of body) {
    await query('UPDATE `frontpage_module` SET sort_order=:sort_order WHERE id=:id', row);
  }
  res.json({ ok: true });
});

app.delete('/api/frontpage-modules/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `frontpage_module` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- LEADS
app.get('/api/leads', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, email, full_name, role, interest, message, source, created_at FROM `lead` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.post('/api/leads', async (req, res) => {
  const data = parseBody(zLeadCreate, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `lead` (id, email, full_name, role, interest, message, source) VALUES (:id,:email,:full_name,:role,:interest,:message,:source)',
    { id, ...data }
  );
  res.json({ id });
});

app.delete('/api/leads/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `lead` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- API CREDENTIALS (for admin)
app.get('/api/credentials', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT id, admin_id, service, label, metadata, is_active, created_at FROM `api_credential` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.post('/api/credentials', async (req, res) => {
  const data = parseBody(zCredentialUpsert, req.body);
  const id = uuid();
  await query(
    'INSERT INTO `api_credential` (id, admin_id, service, label, api_key, metadata, is_active) VALUES (:id,:admin_id,:service,:label,:api_key,:metadata,:is_active)',
    {
      id,
      admin_id: data.admin_id,
      service: data.service,
      label: data.label ?? null,
      api_key: data.api_key,
      metadata: JSON.stringify(data.metadata ?? {}),
      is_active: data.is_active ? 1 : 0,
    }
  );
  res.json({ id });
});

app.delete('/api/credentials/:id', async (req, res) => {
  const id = zUuid.parse(req.params.id);
  await query('DELETE FROM `api_credential` WHERE id=:id', { id });
  res.json({ ok: true });
});

// --- ADMIN USER (single-admin helper)
app.get('/api/admin', async (_req, res) => {
  const rows = await query<any[]>('SELECT id, email, full_name, role, is_active, created_at FROM `admin_user` LIMIT 1');
  res.json(rows[0] || null);
});

app.post('/api/admin/bootstrap', async (req, res) => {
  const body = z.object({ email: z.string().email(), full_name: z.string().min(1).max(255) }).parse(req.body);
  const existing = await query<any[]>('SELECT id FROM `admin_user` LIMIT 1');
  if (existing.length) return res.status(409).json({ error: 'admin already exists' });
  const id = uuid();
  await query('INSERT INTO `admin_user` (id, email, full_name) VALUES (:id,:email,:full_name)', { id, ...body });
  res.json({ id });
});

// --- AUTH: Google OAuth (Workspace) + GitHub OAuth
const baseUrl = (process.env.BASE_URL || '').trim() || 'https://ifairy.co.uk';

const googleClientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const googleRedirectUri = (process.env.GOOGLE_REDIRECT_URI || '').trim() || `${baseUrl}/auth/google/callback`;

const getGoogleOAuth = () => {
  if (!googleClientId || !googleClientSecret) throw new Error('GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET are not set');
  return new google.auth.OAuth2(googleClientId, googleClientSecret, googleRedirectUri);
};

const setOauthStateCookie = (res: any, provider: 'google' | 'github', state: string) => {
  res.cookie(`ifairy_oauth_${provider}_state`, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: `/auth/${provider}`,
    maxAge: 1000 * 60 * 10,
  });
};

const verifyOauthStateCookie = (req: any, res: any, provider: 'google' | 'github') => {
  const expected = String(req.cookies?.[`ifairy_oauth_${provider}_state`] || '');
  const got = String(req.query.state || '');
  res.clearCookie(`ifairy_oauth_${provider}_state`, { path: `/auth/${provider}` });
  if (!expected || !got || expected !== got) throw new Error('OAuth state mismatch');
};

const allowedGoogleDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || '').trim().toLowerCase();
const allowedAdminEmails = (process.env.ALLOWED_ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const canLoginAsAdmin = async (email: string) => {
  const e = email.toLowerCase();
  if (allowedAdminEmails.length) return allowedAdminEmails.includes(e);
  if (allowedGoogleDomain) return e.endsWith(`@${allowedGoogleDomain}`);
  const existing = await query<any[]>('SELECT email FROM `admin_user` LIMIT 1');
  if (!existing.length) return true; // first admin bootstrap via Google allowed
  return existing.some((r) => String(r.email || '').toLowerCase() === e);
};

app.get('/auth/google/start', async (_req, res) => {
  const oauth2 = getGoogleOAuth();
  const state = uuid();
  setOauthStateCookie(res, 'google', state);
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    state,
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res, next) => {
  try {
    verifyOauthStateCookie(req, res, 'google');
    const code = String(req.query.code || '');
    if (!code) return res.status(400).send('Missing code');
    const oauth2 = getGoogleOAuth();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
    const me = await oauth2Api.userinfo.get();
    const email = me.data.email || '';
    const providerUserId = me.data.id || email;
    const fullName = me.data.name || email;

    if (!email) return res.status(400).send('Google account has no email');
    if (!(await canLoginAsAdmin(email))) return res.status(403).send('Not allowed');

    const existing = await query<any[]>('SELECT id FROM `admin_user` WHERE email=:email LIMIT 1', { email });
    const adminId = existing[0]?.id || uuid();
    if (!existing.length) {
      await query('INSERT INTO `admin_user` (id, email, full_name) VALUES (:id,:email,:full_name)', {
        id: adminId,
        email,
        full_name: fullName,
      });
    }

    const accessToken = tokens.access_token ? encrypt(tokens.access_token) : null;
    const refreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;
    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
    const scopes = tokens.scope ? JSON.stringify(tokens.scope.split(' ')) : null;

    const prov = await query<any[]>(
      'SELECT id FROM `admin_auth_provider` WHERE provider=:provider AND provider_user_id=:provider_user_id LIMIT 1',
      { provider: 'google_workspace', provider_user_id: providerUserId }
    );
    if (!prov.length) {
      await query(
        'INSERT INTO `admin_auth_provider` (id, admin_id, provider, provider_user_id, provider_email, access_token, refresh_token, expires_at, scopes) VALUES (:id,:admin_id,:provider,:provider_user_id,:provider_email,:access_token,:refresh_token,:expires_at,:scopes)',
        {
          id: uuid(),
          admin_id: adminId,
          provider: 'google_workspace',
          provider_user_id: providerUserId,
          provider_email: email,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          scopes,
        }
      );
    } else {
      await query(
        'UPDATE `admin_auth_provider` SET admin_id=:admin_id, provider_email=:provider_email, access_token=COALESCE(:access_token, access_token), refresh_token=COALESCE(:refresh_token, refresh_token), expires_at=:expires_at, scopes=COALESCE(:scopes, scopes) WHERE id=:id',
        {
          id: prov[0].id,
          admin_id: adminId,
          provider_email: email,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          scopes,
        }
      );
    }

    setAdminSession(res, adminId);
    res.redirect('/admin/integrations');
  } catch (e) {
    next(e);
  }
});

const githubClientId = (process.env.GITHUB_CLIENT_ID || '').trim();
const githubClientSecret = (process.env.GITHUB_CLIENT_SECRET || '').trim();
const githubRedirectUri = (process.env.GITHUB_REDIRECT_URI || '').trim() || `${baseUrl}/auth/github/callback`;

app.get('/auth/github/start', async (_req, res) => {
  if (!githubClientId) return res.status(500).send('GITHUB_CLIENT_ID is not set');
  const state = uuid();
  setOauthStateCookie(res, 'github', state);
  const url =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(githubClientId)}` +
    `&redirect_uri=${encodeURIComponent(githubRedirectUri)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${encodeURIComponent('read:user user:email repo codespace')}`;
  res.redirect(url);
});

app.get('/auth/github/callback', async (req, res, next) => {
  try {
    verifyOauthStateCookie(req, res, 'github');
    const code = String(req.query.code || '');
    if (!code) return res.status(400).send('Missing code');
    if (!githubClientId || !githubClientSecret) return res.status(500).send('GitHub OAuth env missing');

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
        redirect_uri: githubRedirectUri,
      }),
    });
    const tokenJson: any = await tokenRes.json();
    const accessTokenPlain = tokenJson.access_token as string | undefined;
    if (!accessTokenPlain) return res.status(400).send('No access_token from GitHub');

    const meRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessTokenPlain}`, Accept: 'application/vnd.github+json' },
    });
    const me: any = await meRes.json();
    const providerUserId = String(me.id || me.login || '');
    const name = String(me.name || me.login || 'GitHub user');

    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessTokenPlain}`, Accept: 'application/vnd.github+json' },
    });
    const emails: any[] = (await emailRes.json()) || [];
    const primary = emails.find((e) => e.primary) || emails[0];
    const email = String(primary?.email || '');
    if (!email) return res.status(400).send('GitHub account has no email');
    if (!(await canLoginAsAdmin(email))) return res.status(403).send('Not allowed');

    const existing = await query<any[]>('SELECT id FROM `admin_user` WHERE email=:email LIMIT 1', { email });
    const adminId = existing[0]?.id || uuid();
    if (!existing.length) {
      await query('INSERT INTO `admin_user` (id, email, full_name) VALUES (:id,:email,:full_name)', {
        id: adminId,
        email,
        full_name: name,
      });
    }

    const prov = await query<any[]>(
      'SELECT id FROM `admin_auth_provider` WHERE provider=:provider AND provider_user_id=:provider_user_id LIMIT 1',
      { provider: 'github', provider_user_id: providerUserId }
    );
    const accessToken = encrypt(accessTokenPlain);
    if (!prov.length) {
      await query(
        'INSERT INTO `admin_auth_provider` (id, admin_id, provider, provider_user_id, provider_email, access_token, scopes) VALUES (:id,:admin_id,:provider,:provider_user_id,:provider_email,:access_token,:scopes)',
        {
          id: uuid(),
          admin_id: adminId,
          provider: 'github',
          provider_user_id: providerUserId,
          provider_email: email,
          access_token: accessToken,
          scopes: JSON.stringify(['read:user', 'user:email', 'repo', 'codespace']),
        }
      );
    } else {
      await query(
        'UPDATE `admin_auth_provider` SET admin_id=:admin_id, provider_email=:provider_email, access_token=:access_token, scopes=:scopes WHERE id=:id',
        {
          id: prov[0].id,
          admin_id: adminId,
          provider_email: email,
          access_token: accessToken,
          scopes: JSON.stringify(['read:user', 'user:email', 'repo', 'codespace']),
        }
      );
    }

    setAdminSession(res, adminId);
    res.redirect('/admin/integrations');
  } catch (e) {
    next(e);
  }
});

app.post('/auth/logout', (_req, res) => {
  clearAdminSession(res);
  res.json({ ok: true });
});

// --- Integrations: status + sample API calls
app.get('/api/integrations/status', async (_req, res) => {
  const rows = await query<any[]>(
    'SELECT provider, provider_email, expires_at, created_at FROM `admin_auth_provider` ORDER BY created_at DESC'
  );
  res.json(rows);
});

app.get('/api/me', async (req, res) => {
  const adminId = getAdminIdFromRequest(req);
  if (!adminId) return res.json(null);
  const rows = await query<any[]>(
    'SELECT id, email, full_name, role, is_active, created_at FROM `admin_user` WHERE id=:id LIMIT 1',
    { id: adminId }
  );
  res.json(rows[0] || null);
});

const getEffectiveAdminId = async (req: any) => {
  const fromSession = getAdminIdFromRequest(req);
  if (fromSession) return fromSession;
  const rows = await query<any[]>('SELECT id FROM `admin_user` LIMIT 1');
  return rows[0]?.id || '';
};

const getGoogleAuthForAdmin = async (adminId: string) => {
  const rows = await query<any[]>(
    'SELECT access_token, refresh_token, expires_at FROM `admin_auth_provider` WHERE admin_id=:admin_id AND provider=:provider ORDER BY created_at DESC LIMIT 1',
    { admin_id: adminId, provider: 'google_workspace' }
  );
  if (!rows.length) throw new Error('google not connected');
  const oauth2 = getGoogleOAuth();
  const access_token = rows[0].access_token ? decrypt(rows[0].access_token) : undefined;
  const refresh_token = rows[0].refresh_token ? decrypt(rows[0].refresh_token) : undefined;
  const expiry_date = rows[0].expires_at ? new Date(rows[0].expires_at).getTime() : undefined;
  oauth2.setCredentials({ access_token, refresh_token, expiry_date });
  return oauth2;
};

app.get('/api/google/drive/files', async (req, res, next) => {
  try {
    const effectiveAdminId = await getEffectiveAdminId(req);
    if (!effectiveAdminId) throw new Error('no admin');
    const auth = await getGoogleAuthForAdmin(effectiveAdminId);
    const drive = google.drive({ version: 'v3', auth });
    const out = await drive.files.list({ pageSize: 25, fields: 'files(id,name,mimeType,modifiedTime,webViewLink)' });
    res.json(out.data.files || []);
  } catch (e) {
    next(e);
  }
});

app.get('/api/google/youtube/channels', async (req, res, next) => {
  try {
    const adminId = await getEffectiveAdminId(req);
    if (!adminId) throw new Error('no admin');
    const auth = await getGoogleAuthForAdmin(adminId);
    const yt = google.youtube({ version: 'v3', auth });
    const out = await yt.channels.list({ mine: true, part: ['snippet', 'statistics'] });
    res.json(out.data.items || []);
  } catch (e) {
    next(e);
  }
});

const getGitHubTokenForAdmin = async (adminId: string) => {
  const rows = await query<any[]>(
    'SELECT access_token FROM `admin_auth_provider` WHERE admin_id=:admin_id AND provider=:provider ORDER BY created_at DESC LIMIT 1',
    { admin_id: adminId, provider: 'github' }
  );
  if (!rows.length) throw new Error('github not connected');
  return decrypt(rows[0].access_token);
};

app.get('/api/github/repos', async (req, res, next) => {
  try {
    const adminId = await getEffectiveAdminId(req);
    if (!adminId) throw new Error('no admin');
    const token = await getGitHubTokenForAdmin(adminId);
    const out = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    const json = await out.json();
    res.json(json);
  } catch (e) {
    next(e);
  }
});

app.get('/api/github/codespaces', async (req, res, next) => {
  try {
    const adminId = await getEffectiveAdminId(req);
    if (!adminId) throw new Error('no admin');
    const token = await getGitHubTokenForAdmin(adminId);
    const out = await fetch('https://api.github.com/user/codespaces', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    const json = await out.json();
    res.json(json);
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: any, res: any, _next: any) => {
  const message = err?.message || 'server error';
  res.status(500).json({ error: message });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on :${port}`);
});
