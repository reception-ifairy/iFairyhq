import React from 'react';
import { api } from '../api';
import { CrudPage } from './CrudPage';
import { FieldLabel, TextArea, TextInput } from '../ui';

export const CredentialsPage: React.FC = () => (
  <CrudPage
    title="API credentials"
    subtitle="Tabela: `api_credential` (klucze do innych API). Uwaga: backend zapisuje api_key wprost (do zaszyfrowania w kolejnym kroku)."
    columns={[
      { key: 'service', label: 'Service', width: '18%' },
      { key: 'label', label: 'Label', width: '22%' },
      { key: 'is_active', label: 'Active', width: '10%' },
      { key: 'created_at', label: 'Created', width: '18%' },
    ]}
    load={api.credentials.list}
    create={api.credentials.create}
    update={async () => ({ ok: true })}
    remove={api.credentials.remove}
    makeEmpty={() => ({ admin_id: '', service: 'gemini', label: '', api_key: '', metadata: {}, is_active: true })}
    editor={(draft, setDraft) => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <FieldLabel title="Admin ID" hint="UUID z tabeli `admin_user` (najpierw bootstrap w Settings)." />
          <TextInput value={draft.admin_id || ''} onChange={(e) => setDraft({ ...draft, admin_id: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Service" />
          <TextInput value={draft.service || ''} onChange={(e) => setDraft({ ...draft, service: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Label" />
          <TextInput value={draft.label || ''} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="API key (secret)" />
          <TextInput value={draft.api_key || ''} onChange={(e) => setDraft({ ...draft, api_key: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Active" />
          <TextInput
            value={String(Boolean(draft.is_active))}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.value === 'true' })}
          />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Metadata (JSON)" />
          <TextArea
            className="min-h-[180px] font-mono text-xs"
            value={typeof draft.metadata === 'string' ? draft.metadata : JSON.stringify(draft.metadata ?? {}, null, 2)}
            onChange={(e) => setDraft({ ...draft, metadata: e.target.value })}
          />
        </div>
        <div className="md:col-span-2 text-white/30 text-xs">
          Update credential is not implemented yet (create/delete only).
        </div>
      </div>
    )}
  />
);

