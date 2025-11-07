import React from 'react';

import { api } from '@/api';
import { useList } from '@/hooks/useList';
import type { Driver, LicenseType } from '@/types/types';
import { handleHttpError } from '@/utils/errors';

export type UiTheme = {
  base: string;
  secondary: string;
  accent: string;
  line: string;
  lineSoft: string;
};

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

export default function Drivers({ THEME }: { THEME: UiTheme }) {
  const {
    items: list,
    isLoading: loading,
    error,
    reload,
  } = useList<Driver>('/drivers/');

  const [form, setForm] = React.useState<{
    name: string;
    license_type: LicenseType;
  }>({
    name: '',
    license_type: 'B',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    const name = form.name.trim();
    if (!name || !form.license_type) {
      setFormError('Preencha todos os campos');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/drivers/', { name, license_type: form.license_type });
      setForm({ name: '', license_type: 'B' });
      await reload();
    } catch (err) {
      handleHttpError(err, setFormError);
    } finally {
      setSubmitting(false);
    }
  }

  const themeVars: CSSVars = {
    '--line': THEME.line,
    '--accent': THEME.accent,
    '--base': THEME.base,
  };

  return (
    <div className="space-y-4" style={themeVars}>
      <form
        onSubmit={onSubmit}
        className="flex flex-wrap items-end gap-3"
        aria-busy={submitting}
      >
        <div>
          <label htmlFor="driver-name" className="mb-1 block text-xs">
            Name
          </label>
          <input
            id="driver-name"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Driver name"
          />
        </div>
        <div>
          <label htmlFor="driver-license" className="mb-1 block text-xs">
            License
          </label>
          <select
            id="driver-license"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.license_type}
            onChange={(e) =>
              setForm({ ...form, license_type: e.target.value as LicenseType })
            }
          >
            {LICENSES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--base)' }}
          disabled={submitting || loading || !form.name}
        >
          {submitting ? 'Creating...' : 'Create'}
        </button>
        {(formError || error) && (
          <div className="text-xs text-red-600" aria-live="polite">
            {formError || error}
          </div>
        )}
      </form>

      {loading && <div className="text-sm text-gray-500">Carregando...</div>}

      <ul
        className="divide-y"
        style={{ borderColor: 'var(--line)' }}
        aria-busy={loading}
      >
        {list.map((d) => (
          <li key={d.id} className="flex items-center justify-between py-2">
            <span>
              {d.name} — {d.license_type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
