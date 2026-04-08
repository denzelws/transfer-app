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

// const KPIS = [
//   {
//     label: 'Active\nTrucks',
//     value: '142',
//     sub: '↑ 12%  vs last month',
//     highlight: false,
//   },
//   { label: 'Pending\nOrders', value: '48', sub: '● Priority', highlight: true },
//   { label: 'In Transit\nValue', value: '$2.4M', sub: '', highlight: false },
// ];

const ALERTS = [
  {
    id: 1,
    title: 'Vehicle Maintenance Due',
    time: '2m ago',
    body: 'Truck Unit #4502 (Denver Hub) requires engine diagnostics. Operation suspended.',
    color: '#ba1a1a',
    bgColor: '#ffd9d9',
    icon: 'fa-solid fa-triangle-exclamation',
  },
  {
    id: 2,
    title: 'Weather Warning: Northeast',
    time: '1h ago',
    body: 'Snowstorm expected in I-95 corridor. 4 active transfers may experience 3-hour delays.',
    color: '#92600a',
    bgColor: '#fff3cd',
    icon: 'fa-solid fa-cloud',
  },
  {
    id: 3,
    title: 'New Driver Onboarding',
    time: '4h ago',
    body: '3 drivers in Houston regional hub have completed certification and are ready for assignment.',
    color: '#1b6b51',
    bgColor: '#a6f2d1',
    icon: 'fa-solid fa-location-dot',
  },
];

export default function App() {
  const [tab, setTab] = React.useState<Tab>('assignments');
  const [search, setSearch] = React.useState('');

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
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = '#64748b';
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

          <div
            style={{
              height: 1,
              background: 'rgba(255,255,255,0.06)',
              margin: '12px 0',
            }}
          />

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <i
              className="fa-solid fa-gear"
              style={{ fontSize: 14, width: 16, textAlign: 'center' }}
            />
            Settings
          </button>
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
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 13,
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search shipments, drivers, or routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: 40,
                background: '#f2f3ff',
                border: 'none',
                borderRadius: 8,
                padding: '0 12px 0 36px',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: '#131b2e',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#7c3aed',
                }}
              >
                Transit Status
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: '0.125rem',
                  background: '#a6f2d1',
                  color: '#237157',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1b6b51',
                    display: 'inline-block',
                  }}
                />
                Operational
              </span>
            </div>

            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#f2f3ff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <i className="fa-regular fa-bell" style={{ fontSize: 15 }} />
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#ba1a1a',
                  border: '1.5px solid #faf8ff',
                }}
              />
            </button>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
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

            {tab === 'assignments' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 0,
                  marginBottom: 32,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {/* {KPIS.map((kpi, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px 24px',
                      background: kpi.highlight
                        ? 'linear-gradient(135deg, #630ed4, #7c3aed)'
                        : i % 2 === 0
                          ? '#f2f3ff'
                          : '#faf8ff',
                      borderRight:
                        i < 2 ? '1px solid rgba(204,195,216,0.15)' : 'none',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: kpi.highlight
                          ? 'rgba(255,255,255,0.7)'
                          : '#94a3b8',
                        margin: 0,
                        whiteSpace: 'pre-line',
                        lineHeight: 1.4,
                      }}
                    >
                      {kpi.label}
                    </p>
                    <p
                      style={{
                        fontSize: '2.75rem',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        color: kpi.highlight ? '#ffffff' : '#020617',
                        margin: '6px 0 4px',
                        lineHeight: 1,
                      }}
                    >
                      {kpi.value}
                    </p>
                    {kpi.sub && (
                      <p
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: kpi.highlight
                            ? 'rgba(255,255,255,0.65)'
                            : '#64748b',
                          margin: 0,
                        }}
                      >
                        {kpi.sub}
                      </p>
                    )}
                  </div>
                ))} */}
              </div>
            )}

            {tab === 'assignments' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: '#131b2e',
                    margin: 0,
                  }}
                >
                  Active Transfers
                </h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                  >
                    <i className="fa-solid fa-sliders" />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                  >
                    <i className="fa-solid fa-ellipsis-vertical" />
                  </button>
                </div>
              </div>
            )}

            <div>
              {tab === 'assignments' && <Assignments />}
              {tab === 'drivers' && <Drivers />}
              {tab === 'trucks' && <Trucks />}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: '20px 20px 24px',
                boxShadow: '0 4px 16px rgba(19,27,46,0.06)',
              }}
            >
              <h3
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: '#131b2e',
                  margin: '0 0 16px',
                }}
              >
                Quick Dispatch
              </h3>

              <div style={{ marginBottom: 12 }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    margin: '0 0 6px 2px',
                  }}
                >
                  Pickup Location
                </p>
                <div style={{ position: 'relative' }}>
                  <i
                    className="fa-regular fa-circle-dot"
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 12,
                      color: '#7c3aed',
                    }}
                  />
                  <input
                    placeholder="Entry City or Zip"
                    style={{
                      width: '100%',
                      height: 36,
                      background: '#f2f3ff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0 10px 0 30px',
                      fontSize: '0.875rem',
                      color: '#131b2e',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    margin: '0 0 6px 2px',
                  }}
                >
                  Delivery Node
                </p>
                <div style={{ position: 'relative' }}>
                  <i
                    className="fa-solid fa-location-pin"
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 12,
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    placeholder="Entry Terminal"
                    style={{
                      width: '100%',
                      height: 36,
                      background: '#f2f3ff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0 10px 0 30px',
                      fontSize: '0.875rem',
                      color: '#131b2e',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      margin: '0 0 6px 2px',
                    }}
                  >
                    Freight Type
                  </p>
                  <select
                    style={{
                      width: '100%',
                      height: 36,
                      background: '#f2f3ff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0 10px',
                      fontSize: '0.875rem',
                      color: '#131b2e',
                      outline: 'none',
                      appearance: 'none',
                    }}
                  >
                    <option>Dry Van</option>
                    <option>Refrigerated</option>
                    <option>Flatbed</option>
                  </select>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      margin: '0 0 6px 2px',
                    }}
                  >
                    Weight (T)
                  </p>
                  <input
                    type="number"
                    defaultValue="0.00"
                    step="0.01"
                    style={{
                      width: '100%',
                      height: 36,
                      background: '#f2f3ff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0 10px',
                      fontSize: '0.875rem',
                      color: '#131b2e',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                }}
              >
                Generate Route &amp; Ship
              </button>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                  }}
                >
                  Resource Alerts
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#7c3aed',
                  }}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {ALERTS.map((alert, idx) => (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '14px 0',
                      borderBottom:
                        idx < ALERTS.length - 1
                          ? '1px solid rgba(204,195,216,0.15)'
                          : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: alert.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className={alert.icon}
                        style={{ fontSize: 13, color: alert.color }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            color: '#131b2e',
                          }}
                        >
                          {alert.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            color: '#94a3b8',
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {alert.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {alert.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)',
                borderRadius: 12,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    width: i % 3 === 0 ? 3 : 2,
                    height: i % 3 === 0 ? 3 : 2,
                    borderRadius: '50%',
                    background: 'rgba(167,139,250,0.4)',
                    top: `${15 + i * 11}%`,
                    left: `${10 + ((i * 13) % 80)}%`,
                  }}
                />
              ))}

              <div>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'rgba(167,139,250,0.7)',
                    margin: '0 0 4px',
                  }}
                >
                  Network Visualization
                </p>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#f8fafc',
                    margin: '0 0 12px',
                  }}
                >
                  Real-Time Transit Map
                </h4>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'rgba(167,139,250,0.8)',
                  }}
                >
                  Open Interactive Atlas
                  <i
                    className="fa-solid fa-arrow-right"
                    style={{ fontSize: 11 }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
