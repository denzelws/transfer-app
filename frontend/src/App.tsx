import React from 'react';
import Assignments from './components/Assignments';
import Drivers from './components/Drivers';
import Trucks from './components/Trucks';
import './styles/global.css';
import { Avatar } from './ui/Avatar';

type Tab = 'assignments' | 'drivers' | 'trucks';

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'assignments', icon: 'fa-solid fa-house', label: 'Home' },
  { id: 'drivers', icon: 'fa-solid fa-id-badge', label: 'Fleet' },
  { id: 'trucks', icon: 'fa-solid fa-truck', label: 'Shipments' },
];

export default function App() {
  const [tab, setTab] = React.useState<Tab>('assignments');

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        background: '#faf8ff',
        fontFamily: "'Inter', ui-sans-serif, system-ui",
        color: '#131b2e',
      }}
    >
      <aside
        className="sidebar-glass"
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          width: 192,
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0 24px',
        }}
      >
        <div style={{ padding: '24px 20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i
                className="fa-solid fa-angles-right"
                style={{ color: '#fff', fontSize: 14 }}
              />
            </div>
            <div>
              <p
                style={{
                  color: '#f8fafc',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Transfer
              </p>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Global Logistics
              </p>
            </div>
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            padding: '0 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: active ? 'rgba(124,58,237,0.18)' : 'transparent',
                  color: active ? '#a78bfa' : '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <i
                  className={item.icon}
                  style={{ fontSize: 14, width: 16, textAlign: 'center' }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '0 12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Avatar name="marcus-chen" size={32} variant="beam" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p
                style={{
                  color: '#e2e8f0',
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Marcus Chen
              </p>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Ops Director
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main
        style={{
          marginLeft: 192,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <header
          className="glass"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 24,
          }}
        >
          {/* Header vazio - removidos elementos não funcionais */}
        </header>

        <div
          style={{
            flex: 1,
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 32,
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#020617',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {tab === 'assignments'
                  ? 'Fleet Intelligence'
                  : tab === 'drivers'
                    ? 'Driver Roster'
                    : 'Fleet Inventory'}
              </h1>
              <p
                style={{
                  marginTop: 8,
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: 400,
                }}
              >
                {tab === 'assignments'
                  ? 'Real-time capacity and logistics distribution overview.'
                  : tab === 'drivers'
                    ? 'Certified operators ready for dispatch.'
                    : 'Active fleet units and vehicle registry.'}
              </p>
            </div>

            <div>
              {tab === 'assignments' && <Assignments />}
              {tab === 'drivers' && <Drivers />}
              {tab === 'trucks' && <Trucks />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
