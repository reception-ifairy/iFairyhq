import React from 'react';
import { api } from '../api';
import { CrudPage } from './CrudPage';
import { FieldLabel, TextArea, TextInput } from '../ui';

export const LeadsPage: React.FC = () => (
  <CrudPage
    title="Leads"
    subtitle="Tabela: `lead` (zainteresowani / homeschool rodzice itd.)"
    columns={[
      { key: 'email', label: 'Email', width: '22%' },
      { key: 'full_name', label: 'Name', width: '18%' },
      { key: 'role', label: 'Role', width: '12%' },
      { key: 'source', label: 'Source', width: '12%' },
      { key: 'created_at', label: 'Created', width: '18%' },
    ]}
    load={api.leads.list}
    create={api.leads.create}
    update={async () => ({ ok: true })}
    remove={api.leads.remove}
    makeEmpty={() => ({ email: '', full_name: '', role: 'parent', interest: 'homeschool', message: '', source: 'form' })}
    editor={(draft, setDraft) => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <FieldLabel title="Email" />
          <TextInput value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Full name" />
          <TextInput value={draft.full_name || ''} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Role" />
          <TextInput value={draft.role || ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Source" />
          <TextInput value={draft.source || ''} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Interest" />
          <TextInput value={draft.interest || ''} onChange={(e) => setDraft({ ...draft, interest: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Message" />
          <TextArea value={draft.message || ''} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
        </div>
        <div className="md:col-span-2 text-white/30 text-xs">
          Update lead is not implemented yet (create/delete only).
        </div>
      </div>
    )}
  />
);

