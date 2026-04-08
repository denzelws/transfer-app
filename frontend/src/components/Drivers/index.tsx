import { api } from '@/api';
import { useList } from '@/hooks/useList';
import type { Driver, LicenseType } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import React from 'react';
import EntityModal from '../EntityModal';

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

export default function Drivers() {
  const {
    items: list,
    isLoading: loading,
    error,
    reload,
  } = useList<Driver>('/drivers/');

  const [form, setForm] = React.useState<{
    name: string;
    license_type: LicenseType;
  }>({ name: '', license_type: 'B' });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Driver | null>(null);
  const [values, setValues] = React.useState<{
    name: string;
    license_type: LicenseType;
  }>({ name: '', license_type: 'B' });
  const [busy, setBusy] = React.useState(false);
  const [modalError, setModalError] = React.useState('');

  function openModal(d: Driver) {
    setCurrent(d);
    setValues({ name: d.name, license_type: d.license_type });
    setModalError('');
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const name = form.name.trim();
    if (!name || !form.license_type) {
      setFormError('Required fields missing');
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
      setModalError('Name cannot be empty');
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
    if (!confirm(`Remove ${current.name}?`)) return;
    setBusy(true);
    setModalError('');
    try {
      await api.delete(`/drivers/${current.id}/`);
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
          Onboard Operator
        </p>

        <form
          onSubmit={onSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 140px auto',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label htmlFor="driver-name" style={labelSx}>
              Full Name
            </label>
            <input
              id="driver-name"
              style={inputSx}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label htmlFor="driver-license" style={labelSx}>
              License Class
            </label>
            <select
              id="driver-license"
              style={inputSx}
              value={form.license_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  license_type: e.target.value as LicenseType,
                })
              }
            >
              {LICENSES.map((l) => (
                <option key={l} value={l}>
                  Class {l}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || loading || !form.name}
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
              opacity: submitting || loading || !form.name ? 0.5 : 1,
            }}
          >
            {submitting ? 'Registering...' : 'Register Driver'}
          </button>
        </form>

        {(formError || error) && (
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
            {formError || (error as string)}
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
            <span style={labelSx}>Certified Operators</span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '1px 8px',
                borderRadius: '0.125rem' /* sm */,
                background: 'rgba(124,58,237,0.1)',
                color: '#7c3aed',
              }}
            >
              {list?.length ?? 0} Total
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
              Syncing...
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
          {(list ?? []).map((d) => (
            <div
              key={d.id}
              onClick={() => openModal(d)}
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
                  }}
                >
                  <i
                    className="fa-regular fa-id-badge"
                    style={{ fontSize: 16, color: '#94a3b8' }}
                  />
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
                  Class {d.license_type}
                </span>
              </div>

              <h5
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {d.name}
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
                Operator ID #{d.id}
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
          title: current?.name ?? 'Driver Profile',
          badge: current ? `Class ${current.license_type}` : undefined,
          iconFallback: <i className="fa-regular fa-id-badge" />,
          subtitle: 'Active Resource',
        }}
        values={values}
        setValues={(updater) => setValues((prev) => updater(prev))}
        renderForm={({ values, setValues }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ ...labelSx, color: '#94a3b8' }}>Legal Name</label>
              <input
                style={{ ...inputSx, background: '#f2f3ff' }}
                value={values.name}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label style={{ ...labelSx, color: '#94a3b8' }}>
                License Certification
              </label>
              <select
                style={{ ...inputSx, background: '#f2f3ff' }}
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
                    Class {l}
                  </option>
                ))}
              </select>
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
