import { api } from '@/api';
import { useList } from '@/hooks/useList';
import { usePaginatedResource } from '@/hooks/usePaginatedResource';
import type { Assignment, Driver, Truck } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import React from 'react';
import { AssignmentModal } from '../AssignmentModal';

const INITIAL_URL = '/assignments/?page_size=5&ordering=-date';

type ShiftLabel =
  | 'Morning Shift'
  | 'Late Shift'
  | 'Completed'
  | 'In Transit'
  | 'Loading'
  | 'Delayed';

function deriveStatus(date: string): { label: ShiftLabel; chipClass: string } {
  const today = new Date().toISOString().split('T')[0];
  if (date > today) return { label: 'Loading', chipClass: 'chip chip-info' };
  if (date === today)
    return { label: 'In Transit', chipClass: 'chip chip-success' };
  return { label: 'Completed', chipClass: 'chip chip-neutral' };
}

function formatISODateToUSShort(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y.slice(-2)}`;
}

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
  transition: 'box-shadow 0.15s',
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

export default function Assignments() {
  const { items: drivers } = useList<Driver>('/drivers/');
  const { items: trucks } = useList<Truck>('/trucks/');
  const {
    items: assignments,
    nextUrl,
    prevUrl,
    isLoading: loadingAssignments,
    load: loadAssignments,
  } = usePaginatedResource<Assignment>(INITIAL_URL);

  const [form, setForm] = React.useState({ driver: '', truck: '', date: '' });
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Assignment | null>(null);
  const [modalBusy, setModalBusy] = React.useState(false);

  const driversById = React.useMemo(
    () => new Map(drivers.map((d) => [d.id, d])),
    [drivers],
  );
  const trucksById = React.useMemo(
    () => new Map(trucks.map((t) => [t.id, t])),
    [trucks],
  );

  function getDriverName(aDriver: Assignment['driver']) {
    if (typeof aDriver === 'object' && aDriver && 'name' in aDriver)
      return (aDriver as Driver).name;
    return driversById.get(aDriver as number)?.name ?? `Driver ${aDriver}`;
  }
  function getTruckPlate(aTruck: Assignment['truck']) {
    if (typeof aTruck === 'object' && aTruck && 'plate' in aTruck)
      return (aTruck as Truck).plate;
    return trucksById.get(aTruck as number)?.plate ?? `Truck ${aTruck}`;
  }

  const orderedAssignments = React.useMemo(
    () =>
      [...assignments].sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return (b.id ?? 0) - (a.id ?? 0);
      }),
    [assignments],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!form.driver || !form.truck || !form.date) {
      setFormError('Required fields missing');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/assignments/', {
        driver: Number(form.driver),
        truck: Number(form.truck),
        date: form.date,
      });
      setForm({ driver: '', truck: '', date: '' });
      await loadAssignments(INITIAL_URL);
    } catch (err) {
      handleHttpError(err, setFormError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleModalSave(payload: {
    id: number;
    driver: number;
    truck: number;
    date: string;
  }) {
    setModalBusy(true);
    try {
      await api.patch(`/assignments/${payload.id}/`, {
        driver: payload.driver,
        truck: payload.truck,
        date: payload.date,
      });
      await loadAssignments(INITIAL_URL);
      setModalOpen(false);
      setCurrent(null);
    } catch (err) {
      console.error(err);
    } finally {
      setModalBusy(false);
    }
  }

  async function handleModalDelete(id: number) {
    if (!window.confirm('Delete this assignment?')) return;
    setModalBusy(true);
    try {
      await api.delete(`/assignments/${id}/`);
      await loadAssignments(INITIAL_URL);
      setModalOpen(false);
      setCurrent(null);
    } catch (err) {
      console.error(err);
    } finally {
      setModalBusy(false);
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
          Quick Dispatch
        </p>

        <form
          onSubmit={onSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label htmlFor="driver" style={labelSx}>
              Select Driver
            </label>
            <select
              id="driver"
              style={inputSx}
              value={form.driver}
              onChange={(e) =>
                setForm((f) => ({ ...f, driver: e.target.value }))
              }
            >
              <option value="">— Driver —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="truck" style={labelSx}>
              Select Truck
            </label>
            <select
              id="truck"
              style={inputSx}
              value={form.truck}
              onChange={(e) =>
                setForm((f) => ({ ...f, truck: e.target.value }))
              }
            >
              <option value="">— Unit —</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.plate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" style={labelSx}>
              Date
            </label>
            <input
              id="date"
              type="date"
              style={inputSx}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.driver || !form.truck || !form.date}
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
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity:
                submitting || !form.driver || !form.truck || !form.date
                  ? 0.5
                  : 1,
              whiteSpace: 'nowrap' as const,
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              transition: 'opacity 0.15s',
            }}
          >
            {submitting ? 'Dispatching...' : 'Assign Dispatch'}
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
            display: 'grid',
            gridTemplateColumns: '120px 1fr 110px 90px 60px',
            gap: 8,
            padding: '0 12px 10px',
            borderBottom: '1px solid rgba(204,195,216,0.15)',
          }}
        >
          {['Shipment ID', 'Driver — Truck', 'Status', 'Date', 'Action'].map(
            (col) => (
              <span key={col} style={labelSx}>
                {col}
              </span>
            ),
          )}
        </div>

        {loadingAssignments && (
          <div
            style={{
              padding: '12px 12px 0',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              opacity: 0.7,
            }}
          >
            Syncing...
          </div>
        )}

        <div>
          {orderedAssignments.map((a, idx) => {
            const { label, chipClass } = deriveStatus(a.date);
            const isOdd = idx % 2 === 0;
            return (
              <div
                key={a.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 110px 90px 60px',
                  gap: 8,
                  alignItems: 'center',
                  padding: '12px',
                  background: isOdd ? '#ffffff' : '#f2f3ff',
                  borderRadius: '0.375rem',
                  transition: 'background 0.15s',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: '#020617',
                    }}
                  >
                    #TR-{a.id}
                  </span>
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {getDriverName(a.driver)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#64748b',
                    }}
                  >
                    {getTruckPlate(a.truck)}
                  </span>
                </div>

                <div>
                  <span className={chipClass}>{label}</span>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#64748b',
                  }}
                >
                  {formatISODateToUSShort(a.date)}
                </span>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setCurrent(a);
                      setModalOpen(true);
                    }}
                    style={{
                      padding: '4px 12px',
                      height: 28,
                      borderRadius: '0.125rem',
                      background: '#eaedff',
                      border: 'none',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                      color: '#7c3aed',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      whiteSpace: 'nowrap' as const,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#dde3ff')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#eaedff')
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            marginTop: 20,
          }}
        >
          <button
            disabled={!prevUrl || loadingAssignments}
            onClick={() => prevUrl && loadAssignments(prevUrl)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: '0.375rem',
              background: 'transparent',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: !prevUrl || loadingAssignments ? '#cbd5e1' : '#7c3aed',
              cursor:
                !prevUrl || loadingAssignments ? 'not-allowed' : 'pointer',
            }}
          >
            <i className="fa-solid fa-chevron-left" style={{ fontSize: 10 }} />
            Previous
          </button>
          <button
            disabled={!nextUrl || loadingAssignments}
            onClick={() => nextUrl && loadAssignments(nextUrl)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: '0.375rem',
              background: 'transparent',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: !nextUrl || loadingAssignments ? '#cbd5e1' : '#7c3aed',
              cursor:
                !nextUrl || loadingAssignments ? 'not-allowed' : 'pointer',
            }}
          >
            Next
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} />
          </button>
        </div>
      </section>

      <AssignmentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrent(null);
        }}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        assignment={current}
        drivers={drivers}
        trucks={trucks}
        submitting={modalBusy}
      />
    </div>
  );
}
