import type { Assignment, Driver, Truck } from '@/types/types';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    id: number;
    driver: number;
    truck: number;
    date: string;
  }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  assignment: Assignment | null;
  drivers: Driver[];
  trucks: Truck[];
  submitting: boolean;
  theme: { line: string; accent: string; base: string };
};

export function AssignmentModal({
  open,
  onClose,
  onSave,
  onDelete,
  assignment,
  drivers,
  trucks,
  submitting,
  theme,
}: Props) {
  const [driver, setDriver] = React.useState<string>('');
  const [truck, setTruck] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (!assignment) return;
    const driverId =
      typeof assignment.driver === 'object' && assignment.driver
        ? (assignment.driver as Driver).id
        : (assignment.driver as number);
    const truckId =
      typeof assignment.truck === 'object' && assignment.truck
        ? (assignment.truck as Truck).id
        : (assignment.truck as number);
    setDriver(String(driverId ?? ''));
    setTruck(String(truckId ?? ''));
    setDate(assignment.date ?? '');
    setError('');
  }, [assignment]);

  if (!open || !assignment) return null;

  const a = assignment;

  async function handleSave() {
    setError('');
    if (!driver || !truck || !date) {
      setError('Please fill all fields');
      return;
    }
    await onSave({
      id: a.id,
      driver: Number(driver),
      truck: Number(truck),
      date,
    });
  }

  async function handleDelete() {
    await onDelete(a.id);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg"
        style={{ border: `1px solid ${theme.line}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              🗂️
            </span>
            <h2 className="text-base font-semibold">
              Edit Assignment #{assignment.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm"
            style={{ border: `1px solid ${theme.line}` }}
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="assign-driver" className="mb-1 block text-xs">
              Driver
            </label>
            <select
              id="assign-driver"
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: theme.line }}
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
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
            <label htmlFor="assign-truck" className="mb-1 block text-xs">
              Truck
            </label>
            <select
              id="assign-truck"
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: theme.line }}
              value={truck}
              onChange={(e) => setTruck(e.target.value)}
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
            <label htmlFor="assign-date" className="mb-1 block text-xs">
              Date
            </label>
            <input
              id="assign-date"
              type="date"
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: theme.line }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
            style={{ borderColor: theme.line }}
            disabled={submitting}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: theme.accent, color: theme.base }}
            disabled={submitting}
            onClick={handleSave}
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
