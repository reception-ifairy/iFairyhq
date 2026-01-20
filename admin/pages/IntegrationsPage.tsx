import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, FieldLabel } from '../ui';

export const IntegrationsPage: React.FC = () => {
  const [me, setMe] = useState<any>(null);
  const [status, setStatus] = useState<any[]>([]);
  const [error, setError] = useState('');

  const [drive, setDrive] = useState<any[] | null>(null);
  const [channels, setChannels] = useState<any[] | null>(null);
  const [repos, setRepos] = useState<any | null>(null);
  const [codespaces, setCodespaces] = useState<any | null>(null);

  const refresh = async () => {
    setError('');
    try {
      const [m, s] = await Promise.all([api.me(), api.integrations.status()]);
      setMe(m);
      setStatus(s);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const connectGoogle = () => (window.location.href = '/auth/google/start');
  const connectGitHub = () => (window.location.href = '/auth/github/start');

  const loadDrive = async () => {
    setError('');
    try {
      setDrive(await api.integrations.googleDriveFiles());
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const loadYouTube = async () => {
    setError('');
    try {
      setChannels(await api.integrations.youtubeChannels());
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const loadRepos = async () => {
    setError('');
    try {
      setRepos(await api.integrations.githubRepos());
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const loadCodespaces = async () => {
    setError('');
    try {
      setCodespaces(await api.integrations.githubCodespaces());
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const logout = async () => {
    await api.logout();
    await refresh();
  };

  return (
    <div className="space-y-10">
      <Card
        title="Sign-in"
        subtitle="Google Workspace login creates a secure session cookie; you can still use Bearer token if set in Settings."
        right={
          <>
            <Button onClick={refresh}>Refresh</Button>
            <Button onClick={logout}>Logout</Button>
          </>
        }
      >
        {error ? <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">{error}</div> : null}
        <FieldLabel title="Session user (/api/me)" />
        <pre className="mt-3 p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(me, null, 2)}
        </pre>
      </Card>

      <Card
        title="Connect providers"
        subtitle="Connect Google (Drive/YouTube) and GitHub (Repos/Codespaces)."
        right={
          <>
            <Button variant="primary" onClick={connectGoogle}>
              Connect Google
            </Button>
            <Button variant="primary" onClick={connectGitHub}>
              Connect GitHub
            </Button>
          </>
        }
      >
        <FieldLabel title="Current connections (/api/integrations/status)" />
        <pre className="mt-3 p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(status, null, 2)}
        </pre>
      </Card>

      <Card
        title="Google Drive"
        subtitle="Quick test: list last 25 files."
        right={
          <Button onClick={loadDrive} variant="primary">
            Load files
          </Button>
        }
      >
        <pre className="p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(drive, null, 2)}
        </pre>
      </Card>

      <Card
        title="YouTube"
        subtitle="Quick test: list your channels (mine=true)."
        right={
          <Button onClick={loadYouTube} variant="primary">
            Load channels
          </Button>
        }
      >
        <pre className="p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(channels, null, 2)}
        </pre>
      </Card>

      <Card
        title="GitHub Repos"
        subtitle="Quick test: list your repos."
        right={
          <Button onClick={loadRepos} variant="primary">
            Load repos
          </Button>
        }
      >
        <pre className="p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(repos, null, 2)}
        </pre>
      </Card>

      <Card
        title="GitHub Codespaces"
        subtitle="Quick test: list your codespaces."
        right={
          <Button onClick={loadCodespaces} variant="primary">
            Load codespaces
          </Button>
        }
      >
        <pre className="p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
          {JSON.stringify(codespaces, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

