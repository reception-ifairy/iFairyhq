import React from 'react';
import { api } from '../api';
import { CrudPage } from './CrudPage';
import { FieldLabel, TextArea, TextInput } from '../ui';

export const ProductsPage: React.FC = () => (
  <CrudPage
    title="Products"
    subtitle="Tabela: `product`"
    columns={[
      { key: 'name', label: 'Name', width: '28%' },
      { key: 'slug', label: 'Slug', width: '22%' },
      { key: 'status', label: 'Status', width: '12%' },
      { key: 'created_at', label: 'Created', width: '18%' },
    ]}
    load={api.products.list}
    create={api.products.create}
    update={api.products.update}
    remove={api.products.remove}
    makeEmpty={() => ({ name: '', slug: '', description: '', status: 'draft' })}
    editor={(draft, setDraft) => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <FieldLabel title="Name" />
          <TextInput value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Slug" hint="letters/numbers + hyphens" />
          <TextInput value={draft.slug || ''} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <FieldLabel title="Description" />
          <TextArea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <div className="space-y-3">
          <FieldLabel title="Status" />
          <TextInput value={draft.status || 'draft'} onChange={(e) => setDraft({ ...draft, status: e.target.value })} />
        </div>
      </div>
    )}
  />
);

