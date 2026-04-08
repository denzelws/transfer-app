import { api } from '@/api';
import { useList } from '@/hooks/useList';
import type { LicenseType, Truck } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import React from 'react';
import EntityModal from '../EntityModal';

type TruckEditValues = Pick<
  Truck,
  'plate' | 'model' | 'year' | 'minimum_license_type'
>;

const LICENSES: LicenseType[] = ['A', 'B', 'C', 'D', 'E'];

const inputSx: React.CSSProperties = {
  background: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  height: 36,
  padding: '0 12px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#131b2e',
  width: '100%',
  outline: 'none',
  appearance: 'none' as const,
};

const labelSx: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: '#94a3b8',
  marginBottom: 6,
};

export default function Trucks() {
  const {
    items: list,
    isLoading: loading,
    reload,
  } = useList<Truck>('/trucks/');

  const [form, setForm] = React.useState<TruckEditValues>({
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    minimum_license_type: 'B',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const plate = form.plate.trim().toUpperCase();
    const model = form.model.trim();
    if (!plate || !model || !form.year || !form.minimum_license_type) {
      setFormError('Required fields missing');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/trucks/', {
        plate,
        model,
        year: form.year,
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

  async function onSave() {
    if (!current) return;
    const plate = values.plate.trim().toUpperCase();
    const model = values.model.trim();
    if (!plate || !model || !values.year || !values.minimum_license_type) {
      setModalError('Required fields missing');
      return;
    }
    setBusy(true);
    setModalError('');
    try {
      await api.put(`/trucks/${current.id}/`, {
        plate,
        model,
        year: values.year,
        minimum_license_type: values.minimum_license_type,
      });
      await reload();
      setOpen(false);
      setCurrent(null);
    } catch (err) {
      handleHttpError(err, setModalError);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!current) return;
    if (!confirm(`Remove truck ${current.plate}?`)) return;
    setBusy(true);
    setModalError('');
    try {
      await api.delete(`/trucks/${current.id}/`);
      await reload();
      setOpen(false);
      setCurrent(null);
    } catch (err) {
      handleHttpError(err, setModalError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section
        style={{
          background: '#f2f3ff',
          borderRadius: '0.75rem',
          padding: '1.25rem 1.5rem 1.5rem',
        }}
      >
        <p style={{ ...labelSx, color: '#7c3aed', marginBottom: 16 }}>
          Add Fleet Unit
        </p>

        <form
          onSubmit={onSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 100px 100px auto',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label htmlFor="plate" style={labelSx}>
              Plate ID
            </label>
            <input
              id="plate"
              style={inputSx}
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              placeholder="ABC-1234"
            />
          </div>

          <div>
            <label htmlFor="model" style={labelSx}>
              Vehicle Model
            </label>
            <input
              id="model"
              style={inputSx}
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Volvo FH"
            />
          </div>

          <div>
            <label htmlFor="year" style={labelSx}>
              Year
            </label>
            <input
              id="year"
              type="number"
              style={inputSx}
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label htmlFor="min-license" style={labelSx}>
              Class
            </label>
            <select
              id="min-license"
              style={inputSx}
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
            disabled={submitting || loading || !form.plate || !form.model}
            style={{
              height: 36,
              padding: '0 20px',
              borderRadius: '0.375rem',
              background: 'linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              whiteSpace: 'nowrap' as const,
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              opacity:
                submitting || loading || !form.plate || !form.model ? 0.5 : 1,
            }}
          >
            {submitting ? 'Adding...' : 'Add Unit'}
          </button>
        </form>

        {formError && (
          <p
            style={{
              marginTop: 10,
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#ba1a1a',
            }}
          >
            {formError}
          </p>
        )}
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            padding: '0 4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={labelSx}>Fleet Inventory</span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '1px 8px',
                borderRadius: '0.125rem',
                background: 'rgba(124,58,237,0.1)',
                color: '#7c3aed',
              }}
            >
              {list?.length ?? 0} Units
            </span>
          </div>
          {loading && (
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#7c3aed',
                opacity: 0.7,
              }}
            >
              Scanning...
            </span>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {(list ?? []).map((t) => (
            <div
              key={t.id}
              onClick={() => openModal(t)}
              style={{
                background: '#f2f3ff',
                borderRadius: '0.75rem',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eaedff';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f2f3ff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '0.5rem',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(19,27,46,0.06)',
                    fontSize: 18,
                  }}
                >
                  🚚
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    padding: '2px 6px',
                    borderRadius: '0.125rem',
                    background: '#eaedff',
                    color: '#7c3aed',
                  }}
                >
                  Class {t.minimum_license_type}
                </span>
              </div>

              <h5
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: '#0f172a',
                  margin: 0,
                  textTransform: 'uppercase' as const,
                }}
              >
                {t.plate}
              </h5>
              <p
                style={{
                  marginTop: 4,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  color: '#94a3b8',
                }}
              >
                {t.model} • {t.year}
              </p>
            </div>
          ))}
        </div>
      </section>

      <EntityModal
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrent(null);
        }}
        header={{
          title: current?.plate ?? 'Fleet Unit',
          badge: current ? `${current.model} • ${current.year}` : undefined,
          iconFallback: <span>🚚</span>,
          subtitle: 'Active Resource',
        }}
        values={values}
        setValues={(updater) => setValues((prev) => updater(prev))}
        renderForm={({ values, setValues }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <div>
                <label style={{ ...labelSx, color: '#94a3b8' }}>Plate ID</label>
                <input
                  style={{ ...inputSx, background: '#f2f3ff' }}
                  value={values.plate}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      plate: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div>
                <label style={{ ...labelSx, color: '#94a3b8' }}>Model</label>
                <input
                  style={{ ...inputSx, background: '#f2f3ff' }}
                  value={values.model}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      model: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <div>
                <label style={{ ...labelSx, color: '#94a3b8' }}>Year</label>
                <input
                  type="number"
                  style={{ ...inputSx, background: '#f2f3ff' }}
                  value={values.year}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      year: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label style={{ ...labelSx, color: '#94a3b8' }}>
                  Min. License
                </label>
                <select
                  style={{ ...inputSx, background: '#f2f3ff' }}
                  value={values.minimum_license_type}
                  onChange={(e) =>
                    setValues((prev) => ({
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
          </div>
        )}
        onSave={onSave}
        onDelete={onDelete}
        busy={busy}
        error={modalError}
      />
    </div>
  );
}
