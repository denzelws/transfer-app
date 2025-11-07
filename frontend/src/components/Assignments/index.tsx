import React from 'react';

import { useList } from '@/hooks/useList';
import { usePaginatedResource } from '@/hooks/usePaginatedResource';

import { api } from '@/api';
import type { Assignment, Driver, Truck } from '@/types/types';
import type { UiTheme } from '../Drivers';

function toErrorMessage(err: any): string {
  if (err?.response?.data) {
    try {
      return typeof err.response.data === 'string'
        ? err.response.data
        : JSON.stringify(err.response.data);
    } catch {
      return 'Error';
    }
  }
  return err?.message ?? 'Error';
}

export default function Assignments({ THEME }: { THEME: UiTheme }) {
  const { items: drivers } = useList<Driver>('/drivers/');
  const { items: trucks } = useList<Truck>('/trucks/');
  const {
    items: assignments,
    nextUrl,
    prevUrl,
    isLoading: loadingAssignments,
    error: assignmentsError,
    load: loadAssignments,
  } = usePaginatedResource<Assignment>(
    '/assignments/?page_size=5&ordering=-date',
  );

  const [form, setForm] = React.useState({ driver: '', truck: '', date: '' });
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const updateForm = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const driversById = React.useMemo(
    () => new Map(drivers.map((d) => [d.id, d])),
    [drivers],
  );
  const trucksById = React.useMemo(
    () => new Map(trucks.map((t) => [t.id, t])),
    [trucks],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!form.driver || !form.truck || !form.date) {
      setFormError('Preencha todos os campos');
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
      await loadAssignments();
    } catch (err) {
      setFormError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="space-y-4"
      style={{
        ['--line' as any]: THEME.line,
        ['--accent' as any]: THEME.accent,
        ['--base' as any]: THEME.base,
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
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
          className="rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--base)' }}
          disabled={submitting || !form.driver || !form.truck || !form.date}
        >
          {submitting ? 'Assigning...' : 'Assign'}
        </button>
        {(formError || assignmentsError) && (
          <div className="text-xs text-red-600">
            {formError || assignmentsError}
          </div>
        )}
      </form>

      {loadingAssignments && (
        <div className="text-sm text-gray-500">Carregando assignments...</div>
      )}

      <ul
        className="divide-y"
        style={{ borderColor: 'var(--line)' }}
        aria-busy={loadingAssignments}
      >
        {assignments.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-2">
            <span>
              #{a.id} — Driver {driversById.get(a.driver)?.name ?? a.driver} —
              Truck {trucksById.get(a.truck)?.plate ?? a.truck} —{' '}
              {new Date(a.date).toLocaleDateString()}
            </span>
          </li>
        ))}
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
    </div>
  );
}
