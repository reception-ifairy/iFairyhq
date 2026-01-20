import React from 'react';
import { api } from '../api';
import { CrudPage } from './CrudPage';
import { FieldLabel, TextArea, TextInput } from '../ui';

export const BotsPage: React.FC = () => (
  <CrudPage
    title="Bots"
    subtitle="Tabela: `bot`"
    columns={[
      { key: 'name', label: 'Name', width: '26%' },
      { key: 'slug', label: 'Slug', width: '20%' },
      { key: 'model', label: 'Model', width: '18%' },
      { key: 'is_active', label: 'Active', width: '10%' },
      { key: 'created_at', label: 'Created', width: '18%' },
    ]}
    load={api.bots.list}
    create={api.bots.create}
    update={api.bots.update}
    remove={api.bots.remove}
    makeEmpty={() => ({ name: '', slug: '', description: '', model: '', prompt: '', temperature: 0.7, is_active: true })}
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
        <div className="space-y-3">
          <FieldLabel title="Model" />
          <TextInput value={draft.model || ''} onChange={(e) => setDraft({ ...draft, model: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Temperature (0–2)" />
          <TextInput
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={String(draft.temperature ?? 0.7)}
            onChange={(e) => setDraft({ ...draft, temperature: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Prompt" />
          <TextArea value={draft.prompt || ''} onChange={(e) => setDraft({ ...draft, prompt: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Description" />
          <TextArea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Active (1/0)" hint="API expects boolean; stored as tinyint." />
          <TextInput
            value={String(Boolean(draft.is_active))}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.value === 'true' })}
          />
        </div>
      </div>
    )}
  />
);

