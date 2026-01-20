import React from 'react';
import { api } from '../api';
import { CrudPage } from './CrudPage';
import { FieldLabel, TextArea, TextInput } from '../ui';

export const ToolsPage: React.FC = () => (
  <CrudPage
    title="Tools"
    subtitle="Tabela: `tool`"
    columns={[
      { key: 'name', label: 'Name', width: '30%' },
      { key: 'slug', label: 'Slug', width: '22%' },
      { key: 'endpoint', label: 'Endpoint', width: '30%' },
      { key: 'created_at', label: 'Created', width: '18%' },
    ]}
    load={api.tools.list}
    create={api.tools.create}
    update={api.tools.update}
    remove={api.tools.remove}
    makeEmpty={() => ({ name: '', slug: '', description: '', endpoint: '' })}
    editor={(draft, setDraft) => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <FieldLabel title="Name" />
          <TextInput value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Slug" />
          <TextInput value={draft.slug || ''} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Endpoint" hint="Optional URL / internal route for tool integration." />
          <TextInput value={draft.endpoint || ''} onChange={(e) => setDraft({ ...draft, endpoint: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Description" />
          <TextArea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
      </div>
    )}
  />
);

