import React, { useEffect, useState } from 'react';
import { Card, FieldLabel, TextInput, Button } from '../ui';
import { api } from '../api';

export const SettingsPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [health, setHealth] = useState<string>('…');
  const [admin, setAdmin] = useState<any>(null);
  const [bootstrapEmail, setBootstrapEmail] = useState('');
  const [bootstrapName, setBootstrapName] = useState('');

  useEffect(() => {
    setToken(window.localStorage.getItem('ifairy:adminApiToken') || '');
  }, []);

  const saveToken = () => {
    window.localStorage.setItem('ifairy:adminApiToken', token.trim());
    window.location.reload();
  };

  const check = async () => {
    try {
      await api.health();
      setHealth('API reachable');
    } catch (e: any) {
      setHealth(`API error: ${e?.message || String(e)}`);
    }
    try {
      const a = await api.admin.get();
      setAdmin(a);
    } catch (e: any) {
      setAdmin({ error: e?.message || String(e) });
    }
  };

  useEffect(() => {
    check();
  }, []);

  const bootstrap = async () => {
    await api.admin.bootstrap({ email: bootstrapEmail, full_name: bootstrapName });
    await check();
  };

  return (
    <div className="space-y-10">
      <Card
        title="API connection"
        subtitle="Ustaw token i sprawdź połączenie z serwerem MySQL API (`server/index.ts`)."
        right={
          <>
            <Button onClick={check}>Refresh</Button>
            <Button variant="primary" onClick={saveToken}>
              Save token
            </Button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <FieldLabel title="Admin API token" hint="Wysyłany jako Authorization: Bearer …" />
            <TextInput value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_API_TOKEN" />
          </div>
          <div className="space-y-3">
            <FieldLabel title="Status" />
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white/40">{health}</div>
          </div>
        </div>
      </Card>

      <Card title="Admin account (bootstrap)" subtitle="Jednorazowe utworzenie pierwszego admina w tabeli `admin_user`.">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <FieldLabel title="Email" />
            <TextInput value={bootstrapEmail} onChange={(e) => setBootstrapEmail(e.target.value)} placeholder="founder@domain" />
          </div>
          <div className="space-y-3">
            <FieldLabel title="Full name" />
            <TextInput value={bootstrapName} onChange={(e) => setBootstrapName(e.target.value)} placeholder="Founder Name" />
          </div>
        </div>
        <div className="pt-6">
          <Button variant="primary" onClick={bootstrap} disabled={!bootstrapEmail || !bootstrapName}>
            Bootstrap admin
          </Button>
        </div>
        <div className="pt-8">
          <FieldLabel title="Current admin" />
          <pre className="mt-3 p-6 rounded-2xl bg-[#050508] border border-white/10 overflow-auto text-xs text-white/60">
            {JSON.stringify(admin, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};

