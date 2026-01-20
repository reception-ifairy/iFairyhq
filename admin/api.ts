export type ApiError = { error: string };

const getToken = () => window.localStorage.getItem('ifairy:adminApiToken') || '';

const headers = () => {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  const token = getToken().trim();
  if (token) h.authorization = `Bearer ${token}`;
  return h;
};

const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
  const res = await fetch(path, {
    method,
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = (await res.json()) as ApiError;
      if (data?.error) msg = data.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
};

export const api = {
  health: () => request<{ ok: boolean }> ('GET', '/api/health'),
  me: () => request<any>('GET', '/api/me'),
  logout: () => request<{ ok: boolean }>('POST', '/auth/logout', {}),

  products: {
    list: () => request<any[]>('GET', '/api/products'),
    create: (data: any) => request<{ id: string }>('POST', '/api/products', data),
    update: (id: string, data: any) => request<{ ok: boolean }>('PUT', `/api/products/${id}`, data),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/products/${id}`),
  },
  bots: {
    list: () => request<any[]>('GET', '/api/bots'),
    create: (data: any) => request<{ id: string }>('POST', '/api/bots', data),
    update: (id: string, data: any) => request<{ ok: boolean }>('PUT', `/api/bots/${id}`, data),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/bots/${id}`),
  },
  tools: {
    list: () => request<any[]>('GET', '/api/tools'),
    create: (data: any) => request<{ id: string }>('POST', '/api/tools', data),
    update: (id: string, data: any) => request<{ ok: boolean }>('PUT', `/api/tools/${id}`, data),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/tools/${id}`),
  },
  modules: {
    list: () => request<any[]>('GET', '/api/frontpage-modules'),
    create: (data: any) => request<{ id: string }>('POST', '/api/frontpage-modules', data),
    update: (id: string, data: any) => request<{ ok: boolean }>('PUT', `/api/frontpage-modules/${id}`, data),
    reorder: (items: { id: string; sort_order: number }[]) => request<{ ok: boolean }>('PUT', '/api/frontpage-modules/order', items),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/frontpage-modules/${id}`),
  },
  leads: {
    list: () => request<any[]>('GET', '/api/leads'),
    create: (data: any) => request<{ id: string }>('POST', '/api/leads', data),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/leads/${id}`),
  },
  credentials: {
    list: () => request<any[]>('GET', '/api/credentials'),
    create: (data: any) => request<{ id: string }>('POST', '/api/credentials', data),
    remove: (id: string) => request<{ ok: boolean }>('DELETE', `/api/credentials/${id}`),
  },
  admin: {
    get: () => request<any>('GET', '/api/admin'),
    bootstrap: (data: any) => request<{ id: string }>('POST', '/api/admin/bootstrap', data),
  },
  integrations: {
    status: () => request<any[]>('GET', '/api/integrations/status'),
    googleDriveFiles: () => request<any[]>('GET', '/api/google/drive/files'),
    youtubeChannels: () => request<any[]>('GET', '/api/google/youtube/channels'),
    githubRepos: () => request<any>('GET', '/api/github/repos'),
    githubCodespaces: () => request<any>('GET', '/api/github/codespaces'),
  },
};
