import { api } from '@/api';
import type { Driver, LicenseType } from '@/types/types';
import React from 'react';

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

export type UiTheme = {
  base: string;
  secondary: string;
  accent: string;
  line: string;
  lineSoft: string;
};

export default function Drivers({ THEME }: { THEME: UiTheme }) {
  const [list, setList] = React.useState<Driver[]>([]);
  const [form, setForm] = React.useState<{
    name: string;
    license_type: LicenseType;
  }>({ name: '', license_type: 'B' });
  const [error, setError] = React.useState<string>('');

  async function load() {
    const r = await api.get('/drivers/');
    const data = r.data;
    setList(Array.isArray(data) ? data : data.results);
  }
  React.useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/drivers/', form);
      setForm({ name: '', license_type: 'B' });
      load();
    } catch (err) {
      const e = err as { response?: { data?: unknown } };
      setError(e?.response?.data ? JSON.stringify(e.response.data) : 'Error');
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs">Name</label>
          <input
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Driver name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs">License</label>
          <select
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
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
          type="button"
          className="rounded-md px-3 py-2 text-sm font-semibold"
          style={{ backgroundColor: THEME.accent, color: THEME.base }}
        >
          Create
        </button>
        {error && <div className="text-xs text-red-600">{error}</div>}
      </form>

      <ul className="divide-y" style={{ borderColor: THEME.line }}>
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
