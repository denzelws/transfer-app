import React from 'react';

import { useList } from '@/hooks/useList';
import { usePaginatedResource } from '@/hooks/usePaginatedResource';

import { api } from '@/api';
import type { Assignment, Driver, Truck } from '@/types/types';
import { handleHttpError } from '@/utils/errors';
import { AssignmentModal } from '../AssignmentModal';
import type { UiTheme } from '../Drivers';

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const INITIAL_URL = '/assignments/?page_size=5&ordering=-date';

export default function Assignments({ THEME }: { THEME: UiTheme }) {
  // Base data
  const { items: drivers } = useList<Driver>('/drivers/');
  const { items: trucks } = useList<Truck>('/trucks/');
  const {
    items: assignments,
    nextUrl,
    prevUrl,
    isLoading: loadingAssignments,
    error: assignmentsError,
    load: loadAssignments,
  } = usePaginatedResource<Assignment>(INITIAL_URL);

  // Form state (create)
  const [form, setForm] = React.useState({ driver: '', truck: '', date: '' });
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  // Modal state (edit/delete)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Assignment | null>(null);
  const [modalBusy, setModalBusy] = React.useState(false);

  // Derived maps for quick lookups
  const driversById = React.useMemo(
    () => new Map(drivers.map((d) => [d.id, d])),
    [drivers],
  );
  const trucksById = React.useMemo(
    () => new Map(trucks.map((t) => [t.id, t])),
    [trucks],
  );

  // Helpers
  const updateForm = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function getDriverName(aDriver: Assignment['driver']) {
    if (typeof aDriver === 'object' && aDriver && 'name' in aDriver) {
      return (aDriver as Driver).name;
    }
    return driversById.get(aDriver as number)?.name ?? `Driver ${aDriver}`;
  }

  function getTruckPlate(aTruck: Assignment['truck']) {
    if (typeof aTruck === 'object' && aTruck && 'plate' in aTruck) {
      return (aTruck as Truck).plate;
    }
    return trucksById.get(aTruck as number)?.plate ?? `Truck ${aTruck}`;
  }

  function formatISODateToUSShort(iso: string) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-'); // YYYY-MM-DD
    const yy = y.slice(-2);
    return `${m}/${d}/${yy}`; // MM/DD/YY
  }

  const orderedAssignments = React.useMemo(() => {
    return [...assignments].sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }, [assignments]);

  // Create
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!form.driver || !form.truck || !form.date) {
      setFormError('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/assignments/', {
        driver: Number(form.driver),
        truck: Number(form.truck),
        date: form.date, // YYYY-MM-DD from <input type="date">
      });
      setForm({ driver: '', truck: '', date: '' });
      await loadAssignments(INITIAL_URL); // back to first page with ordering
    } catch (err) {
      handleHttpError(err, setFormError);
    } finally {
      setSubmitting(false);
    }
  }

  // Modal control
  function openModal(a: Assignment) {
    setCurrent(a);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setCurrent(null);
  }

  // Edit (PATCH)
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
        date: payload.date, // YYYY-MM-DD
      });
      await loadAssignments(INITIAL_URL);
      closeModal();
    } catch (err) {
      // Optional: display inside modal by lifting state up; for now log
      console.error(err);
    } finally {
      setModalBusy(false);
    }
  }

  // Delete
  async function handleModalDelete(id: number) {
    if (!window.confirm('Delete this assignment?')) return;
    setModalBusy(true);
    try {
      await api.delete(`/assignments/${id}/`);
      await loadAssignments(INITIAL_URL);
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setModalBusy(false);
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
          <label htmlFor="driver" className="mb-1 block text-xs">
            Driver
          </label>
          <select
            id="driver"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.driver}
            onChange={(e) => updateForm('driver')(e.target.value)}
          >
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.license_type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="truck" className="mb-1 block text-xs">
            Truck
          </label>
          <select
            id="truck"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.truck}
            onChange={(e) => updateForm('truck')(e.target.value)}
          >
            <option value="">Select truck</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.plate} — min {t.minimum_license_type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-xs">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--line)' }}
            value={form.date}
            onChange={(e) => updateForm('date')(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="h-10 rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--base)' }}
          disabled={submitting || !form.driver || !form.truck || !form.date}
        >
          {submitting ? 'Assigning...' : 'Assign'}
        </button>

        {(formError || assignmentsError) && (
          <div className="text-xs text-red-600" aria-live="polite">
            {formError || assignmentsError}
          </div>
        )}
      </form>

      {loadingAssignments && (
        <div className="text-sm text-gray-500">Loading assignments...</div>
      )}

      <ul
        className="px-1"
        style={{
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}
        aria-busy={loadingAssignments}
      >
        {orderedAssignments.map((a) => {
          const driverName = getDriverName(a.driver);
          const truckPlate = getTruckPlate(a.truck);
          const date = formatISODateToUSShort(a.date);

          return (
            <li key={a.id}>
              <div
                className="flex items-center justify-between py-3 transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium"
                      style={{
                        borderColor: 'var(--line)',
                        color: 'rgba(32,41,49,0.75)',
                      }}
                    >
                      #{a.id}
                    </span>
                    <span className="truncate">
                      {driverName} — {truckPlate}
                    </span>
                  </div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: 'rgba(32,41,49,0.65)' }}
                  >
                    {date}
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs"
                    style={{
                      border: '1px solid var(--line)',
                      backgroundColor: 'white',
                    }}
                    onClick={() => openModal(a)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2">
        <button
          className="rounded-md px-3 py-1 text-sm disabled:opacity-50"
          type="button"
          style={{ border: '1px solid var(--line)', backgroundColor: 'white' }}
          disabled={!prevUrl || loadingAssignments}
          onClick={() => prevUrl && loadAssignments(prevUrl)}
        >
          Previous
        </button>
        <button
          className="rounded-md px-3 py-1 text-sm disabled:opacity-50"
          type="button"
          style={{ border: '1px solid var(--line)', backgroundColor: 'white' }}
          disabled={!nextUrl || loadingAssignments}
          onClick={() => nextUrl && loadAssignments(nextUrl)}
        >
          Next
        </button>
      </div>

      <AssignmentModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        assignment={current}
        drivers={drivers}
        trucks={trucks}
        submitting={modalBusy}
        theme={THEME}
      />
    </div>
  );
}
