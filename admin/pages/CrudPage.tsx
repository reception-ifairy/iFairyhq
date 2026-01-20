import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, FieldLabel, TextArea, TextInput } from '../ui';

type Column<T> = {
  key: keyof T & string;
  label: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends Record<string, any>> = {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  load: () => Promise<T[]>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  remove: (id: string) => Promise<any>;
  makeEmpty: () => any;
  idKey?: string; // default: id
  editor?: (draft: any, setDraft: (next: any) => void) => React.ReactNode;
};

export const CrudPage = <T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  load,
  create,
  update,
  remove,
  makeEmpty,
  idKey = 'id',
  editor,
}: Props<T>) => {
  const [rows, setRows] = useState<T[]>([]);
  const [error, setError] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const [selectedId, setSelectedId] = useState<string>('');
  const selected = useMemo(() => rows.find((r) => String((r as any)[idKey]) === selectedId) || null, [rows, selectedId, idKey]);
  const [draft, setDraft] = useState<any>(makeEmpty());

  const refresh = async () => {
    setError('');
    try {
      const data = await load();
      setRows(data);
      if (selectedId && !data.some((r) => String((r as any)[idKey]) === selectedId)) {
        setSelectedId('');
        setDraft(makeEmpty());
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    setDraft({
      ...makeEmpty(),
      ...selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const onCreate = async () => {
    setBusy(true);
    setError('');
    try {
      await create(draft);
      setDraft(makeEmpty());
      setSelectedId('');
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onUpdate = async () => {
    const id = selectedId;
    if (!id) return;
    setBusy(true);
    setError('');
    try {
      await update(id, draft);
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    const id = selectedId;
    if (!id) return;
    if (!confirm('Delete?')) return;
    setBusy(true);
    setError('');
    try {
      await remove(id);
      setSelectedId('');
      setDraft(makeEmpty());
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-10">
      <Card
        title={title}
        subtitle={subtitle}
        right={
          <>
            <Button onClick={refresh}>Refresh</Button>
            <Button variant="primary" onClick={() => { setSelectedId(''); setDraft(makeEmpty()); }}>
              New
            </Button>
          </>
        }
      >
        {error ? <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">{error}</div> : null}
        <div className="overflow-auto border border-white/5 rounded-2xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-white/40 text-[10px] font-black uppercase tracking-widest">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-4" style={c.width ? { width: c.width } : undefined}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => {
                const id = String((r as any)[idKey]);
                const isSelected = id === selectedId;
                return (
                  <tr
                    key={id}
                    className={`cursor-pointer ${isSelected ? 'bg-purple-500/10' : 'hover:bg-white/[0.02]'}`}
                    onClick={() => setSelectedId(id)}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-5 py-4 text-white/70 align-top">
                        {c.render ? c.render(r) : String((r as any)[c.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-6 text-white/30" colSpan={columns.length}>
                    No rows.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={selectedId ? 'Edit' : 'Create'}
        subtitle={selectedId ? `ID: ${selectedId}` : 'Fill the form and click Create.'}
        right={
          selectedId ? (
            <>
              <Button variant="danger" onClick={onDelete} disabled={busy}>
                Delete
              </Button>
              <Button variant="primary" onClick={onUpdate} disabled={busy}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={onCreate} disabled={busy}>
              Create
            </Button>
          )
        }
      >
        {editor ? (
          editor(draft, setDraft)
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <FieldLabel title="JSON" hint="Fallback editor (raw JSON body)." />
              <TextArea
                value={JSON.stringify(draft, null, 2)}
                onChange={(e) => {
                  try {
                    setDraft(JSON.parse(e.target.value));
                  } catch {
                    // ignore while typing
                  }
                }}
                className="min-h-[280px] font-mono text-xs"
              />
            </div>
            <Divider />
            <div className="space-y-3">
              <FieldLabel title="Quick field" hint="If you paste a full JSON object, it replaces the draft." />
              <TextInput
                placeholder='{"name":"..."}'
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  try {
                    const val = (e.target as HTMLInputElement).value;
                    setDraft(JSON.parse(val));
                    (e.target as HTMLInputElement).value = '';
                  } catch {
                    // ignore
                  }
                }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

