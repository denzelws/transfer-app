import { api } from '@/api';
import type { Assignment, Driver, Truck } from '@/types/types';
import React from 'react';
import type { UiTheme } from '../Drivers';

type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function Assignments({ THEME }: { THEME: UiTheme }) {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [trucks, setTrucks] = React.useState<Truck[]>([]);
  const [items, setItems] = React.useState<Assignment[]>([]);
  const [page, setPage] = React.useState(1);
  const [nextUrl, setNextUrl] = React.useState<string | null>(null);
  const [prevUrl, setPrevUrl] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    driver: string;
    truck: string;
    date: string;
  }>({
    driver: '',
    truck: '',
    date: '',
  });
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      try {
        const [d, t] = await Promise.all([
          api.get('/drivers/'),
          api.get('/trucks/'),
        ]);
        const driversData = Array.isArray(d.data)
          ? d.data
          : (d.data?.results ?? d.data ?? []);
        const trucksData = Array.isArray(t.data)
          ? t.data
          : (t.data?.results ?? t.data ?? []);
        setDrivers(Array.isArray(driversData) ? driversData : []);
        setTrucks(Array.isArray(trucksData) ? trucksData : []);
      } catch {
        setDrivers([]);
        setTrucks([]);
      }
    })();
  }, []);

  const loadAssignments = React.useCallback(
    async (url?: string) => {
      try {
        const path = url
          ? url.replace(`${import.meta.env.VITE_API_BASE}/api`, '')
          : `/assignments/?page=${page}&page_size=5&ordering=-date`;
        const r = await api.get(path);
        const payload = r.data;

        if (Array.isArray(payload)) {
          setItems(payload);
          setNextUrl(null);
          setPrevUrl(null);
        } else if (Array.isArray(payload?.results)) {
          setItems(payload.results);
          setNextUrl(payload.next ?? null);
          setPrevUrl(payload.previous ?? null);
        } else {
          setItems([]);
          setNextUrl(null);
          setPrevUrl(null);
        }
      } catch {
        setItems([]);
        setNextUrl(null);
        setPrevUrl(null);
      }
    },
    [page],
  );

  React.useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/assignments/', {
        driver: Number(form.driver),
        truck: Number(form.truck),
        date: form.date,
      });
      setForm({ driver: '', truck: '', date: '' });
      void loadAssignments();
    } catch (err) {
      const e = err as { response?: { data?: unknown } };
      setError(e?.response?.data ? JSON.stringify(e.response.data) : 'Error');
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs">Driver</label>
          <select
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.driver}
            onChange={(e) => setForm({ ...form, driver: e.target.value })}
          >
            <option value="">Select driver</option>
            {(drivers ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.license_type})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs">Truck</label>
          <select
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.truck}
            onChange={(e) => setForm({ ...form, truck: e.target.value })}
          >
            <option value="">Select truck</option>
            {(trucks ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.plate} — min {t.minimum_license_type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs">Date</label>
          <input
            type="date"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: THEME.line }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="rounded-md px-3 py-2 text-sm font-semibold"
          style={{ backgroundColor: THEME.accent, color: THEME.base }}
        >
          Assign
        </button>
        {error && <div className="text-xs text-red-600">{error}</div>}
      </form>

      <ul className="divide-y" style={{ borderColor: THEME.line }}>
        {(items ?? []).map((a) => (
          <li key={a.id} className="flex items-center justify-between py-2">
            <span>
              #{a.id} — Driver {a.driver} — Truck {a.truck} — {a.date}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <button
          className="rounded-md px-3 py-1 text-sm"
          type="button"
          style={{
            border: `1px solid ${THEME.line}`,
            backgroundColor: 'white',
            opacity: prevUrl ? 1 : 0.5,
          }}
          disabled={!prevUrl}
          onClick={() => {
            setPage((p) => Math.max(1, p - 1));
            if (prevUrl) void loadAssignments(prevUrl);
          }}
        >
          Previous
        </button>
        <button
          className="rounded-md px-3 py-1 text-sm"
          type="button"
          style={{
            border: `1px solid ${THEME.line}`,
            backgroundColor: 'white',
            opacity: nextUrl ? 1 : 0.5,
          }}
          disabled={!nextUrl}
          onClick={() => {
            setPage((p) => p + 1);
            if (nextUrl) void loadAssignments(nextUrl);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
