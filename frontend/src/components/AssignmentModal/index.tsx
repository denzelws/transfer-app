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

  async function handleSave() {
    setError('');
    if (!driver || !truck || !date) {
      setError('Required fields missing');
      return;
    }
    await onSave({
      id: assignment!.id,
      driver: Number(driver),
      truck: Number(truck),
      date,
    });
  }

  const inputStyle: React.CSSProperties = {
    background: '#f2f3ff',
    border: 'none',
    borderRadius: '0.375rem',
    height: 36,
    padding: '0 12px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#131b2e',
    width: '100%',
    outline: 'none',
    transition: 'background 0.15s, box-shadow 0.15s',
    appearance: 'none' as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: '#94a3b8',
    display: 'block',
    marginBottom: 6,
    marginLeft: 2,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(19, 27, 46, 0.45)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: 480,
          boxShadow:
            '0 16px 32px -8px rgba(19, 27, 46, 0.12), 0 4px 8px rgba(19, 27, 46, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            marginBottom: 32,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ ...labelStyle, color: '#7c3aed', marginBottom: 4 }}>
              Manifest Management
            </span>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#020617',
                margin: 0,
              }}
            >
              Edit Entry #TR-{assignment.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f2f3ff',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: 13 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label htmlFor="assign-driver" style={labelStyle}>
              Designated Operator
            </label>
            <select
              id="assign-driver"
              style={inputStyle}
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            >
              <option value="">Select Operator</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} • Class {d.license_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assign-truck" style={labelStyle}>
              Assigned Fleet Unit
            </label>
            <select
              id="assign-truck"
              style={inputStyle}
              value={truck}
              onChange={(e) => setTruck(e.target.value)}
            >
              <option value="">Select Unit</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.plate} • Min. Req {t.minimum_license_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assign-date" style={labelStyle}>
              Operation Date
            </label>
            <input
              id="assign-date"
              type="date"
              style={inputStyle}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#ba1a1a',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onDelete(assignment.id)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: '0.375rem',
              background: '#f2f3ff',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffd9d9';
              e.currentTarget.style.color = '#ba1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f2f3ff';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            Terminate
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            style={{
              flex: 2,
              height: 44,
              borderRadius: '0.375rem',
              background: 'linear-gradient(135deg, #630ed4 0%, #7c3aed 100%)',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              opacity: submitting ? 0.6 : 1,
              transition: 'opacity 0.15s, transform 0.15s',
            }}
          >
            {submitting ? 'Updating...' : 'Commit Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
