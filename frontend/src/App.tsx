import React from 'react';

import Assignments from './components/Assignments';
import Drivers from './components/Drivers';
import Logo from './components/Logo';
import Trucks from './components/Trucks';
import { alpha, Card, IconBtn, SectionTitle, Tag, THEME } from './ui';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [tab, setTab] = React.useState<'assignments' | 'drivers' | 'trucks'>(
    'assignments',
  );

  React.useEffect(() => {
    document.body.style.fontFamily =
      'ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    document.body.style.fontFeatureSettings = '"ss01" on, "cv01" on';
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: THEME.base, color: THEME.secondary }}
    >
      <header
        className="sticky top-0 z-20 backdrop-blur supports-backdrop-blur:bg-white/70"
        style={{
          borderBottom: `1px solid ${THEME.lineSoft}`,
          backgroundColor: 'rgba(252,252,255,0.8)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg px-3 py-1.5 text-sm"
              style={{
                backgroundColor: alpha(THEME.secondary, 0.04),
                border: `1px solid ${THEME.line}`,
              }}
            >
              Menu
            </button>
            <div className="ml-1 flex items-center gap-2">
              <Logo fill="#14D64D" className="h-6" />
            </div>
          </div>
          <div
            className="flex items-center gap-3 text-[13px]"
            style={{ color: 'rgba(32,41,49,0.75)' }}
          >
            <span>{new Date().toLocaleDateString()}</span>
            <Tag>Today’s Dispatch</Tag>
            <button
              type="button"
              className="rounded-lg px-2.5 py-1"
              style={{
                border: `1px solid ${THEME.line}`,
                backgroundColor: alpha(THEME.secondary, 0.04),
              }}
              aria-label="alerts"
            >
              <i className="fa-regular fa-bell" />
            </button>
          </div>
        </div>
      </header>

      <div
        className="py-8"
        style={{
          background: `linear-gradient(90deg, ${alpha(THEME.secondary, 0.035)} 0 360px, transparent 360px, transparent 100%)`,
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4">
          {sidebarOpen && (
            <aside className="col-span-1 hidden md:flex md:flex-col md:items-center md:gap-3">
              <IconBtn label="Dashboard">
                <i className="fa-solid fa-grid-2" />
              </IconBtn>

              <IconBtn label="Trucks" onClick={() => setTab('trucks')}>
                <i className="fa-solid fa-truck" />
              </IconBtn>

              <IconBtn label="Drivers" onClick={() => setTab('drivers')}>
                <i className="fa-solid fa-id-card" />
              </IconBtn>

              <IconBtn label="Search">
                <i className="fa-solid fa-magnifying-glass" />
              </IconBtn>
              <IconBtn label="Settings">
                <i className="fa-solid fa-gear" />
              </IconBtn>
            </aside>
          )}

          <div className="col-span-12 space-y-4 sm:col-span-5 lg:col-span-3">
            <Card>
              <SectionTitle>Available Resources</SectionTitle>
              <div className="space-y-3 px-5 pb-5">
                <div
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    border: `1px solid ${THEME.line}`,
                    backgroundColor: alpha(THEME.secondary, 0.02),
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: alpha(THEME.accent, 0.12),
                      color: THEME.accent,
                    }}
                  >
                    <i className="fa-solid fa-truck" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trucks</p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(32,41,49,0.65)' }}
                    >
                      Manage your fleet
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    border: `1px solid ${THEME.line}`,
                    backgroundColor: alpha(THEME.secondary, 0.02),
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: alpha(THEME.accent, 0.12),
                      color: THEME.accent,
                    }}
                  >
                    <i className="fa-regular fa-id-badge" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Drivers</p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(32,41,49,0.65)' }}
                    >
                      Keep your roster updated
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-12 sm:col-span-7 lg:col-span-8">
            <Card elevated>
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: THEME.lineSoft }}
              >
                <div
                  className="text-sm"
                  style={{ color: 'rgba(32,41,49,0.75)' }}
                >
                  Today’s Dispatch
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Tag>Alerts</Tag>
                  <button
                    type="button"
                    className="rounded-full px-3 py-1"
                    style={{
                      border: `1px solid ${THEME.line}`,
                      backgroundColor: alpha(THEME.secondary, 0.04),
                    }}
                  >
                    <i className="fa-regular fa-circle-question" />{' '}
                    <span className="ml-1">Help</span>
                  </button>
                </div>
              </div>

              <div className="p-4">
                {tab === 'assignments' && <Assignments THEME={THEME} />}
                {tab === 'drivers' && <Drivers THEME={THEME} />}
                {tab === 'trucks' && <Trucks THEME={THEME} />}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
