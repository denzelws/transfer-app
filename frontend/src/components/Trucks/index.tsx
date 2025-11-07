import React from 'react';

import { api } from '@/api';

import type { LicenseType, Truck } from '@/types/types';

import { useList } from '@/hooks/useList';
import { handleHttpError } from '@/utils/errors';
import type { UiTheme } from '../Drivers';

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

export default function Trucks({ THEME }: { THEME: UiTheme }) {
  const {
    items: list,
    isLoading: loading,
    error,
    reload,
  } = useList<Truck>('/trucks/');

  const [form, setForm] = React.useState<
    Pick<Truck, 'plate' | 'model' | 'year' | 'minimum_license_type'>
  >({
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    minimum_license_type: 'B',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const currentYear = new Date().getFullYear();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    const plate = form.plate.trim().toUpperCase();
    const model = form.model.trim();
    const year = form.year;

    if (!plate || !model || !year || !form.minimum_license_type) {
      setFormError('Preencha todos os campos');
      return;
    }
    if (year < 1950 || year > currentYear + 1) {
      setFormError(`Ano deve estar entre 1950 e ${currentYear + 1}`);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/trucks/', {
        plate,
        model,
        year,
        minimum_license_type: form.minimum_license_type,
      });
      setForm({
        plate: '',
        model: '',
        year: new Date().getFullYear(),
        minimum_license_type: 'B',
      });
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
          <label htmlFor="plate" className="mb-1 block text-xs">
            Plate
          </label>
          <input
            id="plate"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.plate}
            onChange={(e) => setForm({ ...form, plate: e.target.value })}
            placeholder="ABC1D23"
          />
        </div>
        <div>
          <label htmlFor="model" className="mb-1 block text-xs">
            Model
          </label>
          <input
            id="model"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            placeholder="Volvo FH"
          />
        </div>
        <div>
          <label htmlFor="year" className="mb-1 block text-xs">
            Year
          </label>
          <input
            id="year"
            type="number"
            inputMode="numeric"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.currentTarget.valueAsNumber || currentYear,
              })
            }
            min={1950}
            max={currentYear + 1}
          />
        </div>
        <div>
          <label htmlFor="min-license" className="mb-1 block text-xs">
            Min License
          </label>
          <select
            id="min-license"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
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
          type="submit"
          className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--base)' }}
          disabled={
            submitting || loading || !form.plate || !form.model || !form.year
          }
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
