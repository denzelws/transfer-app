import React from 'react';

import { api } from '@/api';
import { useList } from '@/hooks/useList';
import type { Driver, LicenseType } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import EntityCard from '../EntityCard';
import EntityModal from '../EntityModal';

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

  // Estado do modal genérico
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Driver | null>(null);
  const [values, setValues] = React.useState<{
    name: string;
    license_type: LicenseType;
  }>({
    name: '',
    license_type: 'B',
  });
  const [busy, setBusy] = React.useState(false);
  const [modalError, setModalError] = React.useState('');

  function openModal(d: Driver) {
    setCurrent(d);
    setValues({ name: d.name, license_type: d.license_type });
    setModalError('');
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setCurrent(null);
  }

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

  async function onSave() {
    if (!current) return;
    const name = values.name.trim();
    if (!name) {
      setModalError('Nome não pode ser vazio.');
      return;
    }
    setBusy(true);
    setModalError('');
    try {
      await api.put(`/drivers/${current.id}/`, {
        name,
        license_type: values.license_type,
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
    if (!confirm(`Remover ${current.name}?`)) return;
    setBusy(true);
    setModalError('');
    try {
      await api.delete(`/drivers/${current.id}/`);
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
      {/* Formulário de criação */}
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
          className="h-10 rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
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

      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy={loading}
      >
        {(list ?? []).map((d) => (
          <EntityCard
            key={d.id}
            kind="driver"
            title={d.name}
            badge={`License ${d.license_type}`}
            avatarSeed={d.name}
            iconFallback={<i className="fa-regular fa-id-badge" />}
            onClick={() => openModal(d)}
          />
        ))}
      </div>

      <EntityModal
        open={open}
        onClose={closeModal}
        header={{
          title: current?.name ?? 'Driver',
          badge: current ? `License ${current.license_type}` : undefined,
          avatarSeed: current?.name,
          iconFallback: <i className="fa-regular fa-id-badge" />,
          subtitle: 'Driver',
        }}
        values={values}
        setValues={(updater) => setValues((prev) => updater(prev))}
        renderForm={({ values, setValues }) => (
          <>
            <div>
              <label className="mb-1 block text-xs">Name</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                style={{ borderColor: 'var(--line)' }}
                value={values.name}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs">License</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                style={{ borderColor: 'var(--line)' }}
                value={values.license_type}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    license_type: e.target.value as LicenseType,
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
