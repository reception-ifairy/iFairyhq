import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, FieldLabel, TextArea, TextInput } from '../ui';

export const ModulesPage: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState<any>({ key: '', title: '', is_enabled: true, sort_order: 0, content: {} });
  const [selectedId, setSelectedId] = useState<string>('');

  const refresh = async () => {
    setError('');
    try {
      const data = await api.modules.list();
      setRows(data);
      if (selectedId && !data.some((r: any) => r.id === selectedId)) setSelectedId('');
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sel = rows.find((r) => r.id === selectedId);
    if (!sel) return;
    setDraft({
      key: sel.key,
      title: sel.title ?? '',
      is_enabled: Boolean(sel.is_enabled),
      sort_order: Number(sel.sort_order ?? 0),
      content: sel.content ?? {},
    });
  }, [selectedId, rows]);

  const create = async () => {
    setBusy(true);
    setError('');
    try {
      let content = draft.content;
      if (typeof content === 'string') content = JSON.parse(content);
      await api.modules.create({ ...draft, content });
      setDraft({ key: '', title: '', is_enabled: true, sort_order: 0, content: {} });
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!selectedId) return;
    setBusy(true);
    setError('');
    try {
      let content = draft.content;
      if (typeof content === 'string') content = JSON.parse(content);
      await api.modules.update(selectedId, { ...draft, content });
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const del = async () => {
    if (!selectedId) return;
    if (!confirm('Delete module?')) return;
    setBusy(true);
    setError('');
    try {
      await api.modules.remove(selectedId);
      setSelectedId('');
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= rows.length) return;
    const next = [...rows];
    const a = next[idx];
    const b = next[swapWith];
    next[idx] = b;
    next[swapWith] = a;
    const payload = next.map((r, i) => ({ id: r.id, sort_order: i }));
    setRows(next);
    try {
      await api.modules.reorder(payload);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  return (
    <div className="space-y-10">
      <Card
        title="Frontpage modules"
        subtitle="Tabela: `frontpage_module` (kolejność = sort_order)"
        right={
          <>
            <Button onClick={refresh}>Refresh</Button>
          </>
        }
      >
        {error ? <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">{error}</div> : null}
        <div className="overflow-auto border border-white/5 rounded-2xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-white/40 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-5 py-4 w-[80px]">Order</th>
                <th className="px-5 py-4 w-[220px]">Key</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4 w-[120px]">Enabled</th>
                <th className="px-5 py-4 w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`cursor-pointer ${r.id === selectedId ? 'bg-purple-500/10' : 'hover:bg-white/[0.02]'}`}
                  onClick={() => setSelectedId(r.id)}
                >
                  <td className="px-5 py-4 text-white/60">{r.sort_order}</td>
                  <td className="px-5 py-4 text-white/80 font-mono text-xs">{r.key}</td>
                  <td className="px-5 py-4 text-white/70">{r.title || ''}</td>
                  <td className="px-5 py-4 text-white/60">{r.is_enabled ? 'yes' : 'no'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button onClick={(e) => { e.stopPropagation(); move(r.id, -1); }} disabled={busy || i === 0}>
                        Up
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); move(r.id, 1); }} disabled={busy || i === rows.length - 1}>
                        Down
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-6 text-white/30" colSpan={5}>
                    No modules.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={selectedId ? 'Edit module' : 'Create module'}
        subtitle={selectedId ? `ID: ${selectedId}` : 'Create a new frontpage module row.'}
        right={
          selectedId ? (
            <>
              <Button variant="danger" onClick={del} disabled={busy}>
                Delete
              </Button>
              <Button variant="primary" onClick={save} disabled={busy}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={create} disabled={busy}>
              Create
            </Button>
          )
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <FieldLabel title="Key" hint="np. intro, purpose, about..." />
            <TextInput value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} />
          </div>
          <div className="space-y-3">
            <FieldLabel title="Title" />
            <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-3">
            <FieldLabel title="Enabled" />
            <TextInput
              value={String(Boolean(draft.is_enabled))}
              onChange={(e) => setDraft({ ...draft, is_enabled: e.target.value === 'true' })}
            />
          </div>
          <div className="space-y-3">
            <FieldLabel title="Sort order" />
            <TextInput
              type="number"
              value={String(draft.sort_order ?? 0)}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-3 md:col-span-2">
            <FieldLabel title="Content (JSON)" hint="Dane modułu. Możesz wkleić JSON." />
            <TextArea
              className="min-h-[260px] font-mono text-xs"
              value={typeof draft.content === 'string' ? draft.content : JSON.stringify(draft.content ?? {}, null, 2)}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

