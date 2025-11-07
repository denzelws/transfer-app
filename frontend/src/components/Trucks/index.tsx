import React from 'react';

import { api } from '@/api';
import { useList } from '@/hooks/useList';
import type { LicenseType, Truck } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import type { UiTheme } from '../Drivers';
import EntityCard from '../EntityCard';
import EntityModal from '../EntityModal';

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

export default function Trucks({ THEME }: { THEME: UiTheme }) {
  const {
    items: list,
    isLoading: loading,
    error,
    reload,
  } = useList<Truck>('/trucks/');

  // Form de criação
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

  // Modal de edição (sem avatar)
  type TruckEditValues = Pick<
    Truck,
    'plate' | 'model' | 'year' | 'minimum_license_type'
  >;
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Truck | null>(null);
  const [values, setValues] = React.useState<TruckEditValues>({
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    minimum_license_type: 'B',
  });
  const [busy, setBusy] = React.useState(false);
  const [modalError, setModalError] = React.useState('');

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

  function openModal(t: Truck) {
    setCurrent(t);
    setValues({
      plate: t.plate,
      model: t.model,
      year: t.year,
      minimum_license_type: t.minimum_license_type,
    });
    setModalError('');
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    setCurrent(null);
  }

  async function onSave() {
    if (!current) return;
    const plate = values.plate.trim().toUpperCase();
    const model = values.model.trim();
    const year = values.year;

    if (!plate || !model || !year || !values.minimum_license_type) {
      setModalError('Preencha todos os campos');
      return;
    }
    if (year < 1950 || year > currentYear + 1) {
      setModalError(`Ano deve estar entre 1950 e ${currentYear + 1}`);
      return;
    }

    setBusy(true);
    setModalError('');
    try {
      await api.put(`/trucks/${current.id}/`, {
        plate,
        model,
        year,
        minimum_license_type: values.minimum_license_type,
      });
      await reload();
      closeModal();
    } catch (err) {
      handleHttpError(err, setModalError);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!current) return;
    if (!confirm(`Remover caminhão ${current.plate}?`)) return;
    setBusy(true);
    setModalError('');
    try {
      await api.delete(`/trucks/${current.id}/`);
      await reload();
      closeModal();
    } catch (err) {
      handleHttpError(err, setModalError);
    } finally {
      setBusy(false);
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

      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy={loading}
      >
        {(list ?? []).map((t) => (
          <EntityCard
            key={t.id}
            kind="truck"
            title={t.plate}
            badge={`${t.model} • ${t.year}`}
            iconFallback={
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg"
                aria-hidden
                role="img"
              >
                🚚
              </span>
            }
            onClick={() => openModal(t)}
          />
        ))}
      </div>

      <EntityModal
        open={open}
        onClose={closeModal}
        header={{
          title: current ? current.plate : 'Truck',
          badge: current ? `${current.model} • ${current.year}` : undefined,
          subtitle: 'Truck',
          iconFallback: (
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg"
              aria-hidden
              role="img"
            >
              🚚
            </span>
          ),
        }}
        values={values}
        setValues={(updater) => setValues((prev) => updater(prev))}
        renderForm={({ values, setValues }) => (
          <>
            <div>
              <label className="mb-1 block text-xs">Plate</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                style={{ borderColor: 'var(--line)' }}
                value={values.plate}
                onChange={(e) =>
                  setValues((prev: TruckEditValues) => ({
                    ...prev,
                    plate: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="ABC1D23"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs">Model</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                style={{ borderColor: 'var(--line)' }}
                value={values.model}
                onChange={(e) =>
                  setValues((prev: TruckEditValues) => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
                placeholder="Volvo FH"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs">Year</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full rounded-md border px-3 py-2"
                  style={{ borderColor: 'var(--line)' }}
                  value={values.year}
                  min={1950}
                  max={currentYear + 1}
                  onChange={(e) =>
                    setValues((prev: TruckEditValues) => ({
                      ...prev,
                      year: e.currentTarget.valueAsNumber || currentYear,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs">Min License</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  style={{ borderColor: 'var(--line)' }}
                  value={values.minimum_license_type}
                  onChange={(e) =>
                    setValues((prev: TruckEditValues) => ({
                      ...prev,
                      minimum_license_type: e.target.value as LicenseType,
                    }))
                  }
                >
                  {LICENSES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        onSave={onSave}
        onDelete={onDelete}
        busy={busy}
        error={modalError}
        accentColor={THEME.accent}
      />
    </div>
  );
}
