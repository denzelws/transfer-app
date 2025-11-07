import { api } from '@/api';
import type { LicenseType, Truck } from '@/types/types';
import React from 'react';
import type { UiTheme } from '../Drivers';

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

export default function Trucks({ THEME }: { THEME: UiTheme }) {
  const [list, setList] = React.useState<Truck[]>([]);
  const [form, setForm] = React.useState<
    Pick<Truck, 'plate' | 'model' | 'year' | 'minimum_license_type'>
  >({
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    minimum_license_type: 'B',
  });
  const [error, setError] = React.useState<string>('');

  async function load() {
    const r = await api.get('/trucks/');
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
      await api.post('/trucks/', { ...form, year: Number(form.year) });
      setForm({
        plate: '',
        model: '',
        year: new Date().getFullYear(),
        minimum_license_type: 'B',
      });
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
          <label className="mb-1 block text-xs">Plate</label>
          <input
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.plate}
            onChange={(e) => setForm({ ...form, plate: e.target.value })}
            placeholder="ABC1D23"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs">Model</label>
          <input
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            placeholder="Volvo FH"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs">Year</label>
          <input
            type="number"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs">Min License</label>
          <select
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.minimum_license_type}
            onChange={(e) =>
              setForm({
                ...form,
                minimum_license_type: e.target.value as LicenseType,
              })
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
        {list.map((t) => (
          <li key={t.id} className="flex items-center justify-between py-2">
            <span>
              {t.plate} — {t.model} ({t.year}) — min {t.minimum_license_type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
