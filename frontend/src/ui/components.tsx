import React from 'react';
import { THEME, alpha } from './theme';

export const IconBtn: React.FC<{
  children: React.ReactNode;
  label?: string;
  onClick?: () => void;
}> = ({ children, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex h-12 w-12 items-center justify-center rounded-xl transition"
    style={{
      backgroundColor: THEME.base,
      border: `1px solid ${THEME.line}`,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}
    aria-label={label || 'icon'}
  >
    <span style={{ color: THEME.accent }}>{children}</span>
    {label && (
      <span
        className="pointer-events-none absolute left-14 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition group-hover:opacity-100"
        style={{ backgroundColor: THEME.secondary, color: THEME.base }}
      >
        {label}
      </span>
    )}
  </button>
);

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
    style={{ backgroundColor: alpha(THEME.accent, 0.12), color: THEME.accent }}
  >
    {children}
  </span>
);

export const Card: React.FC<{
  children: React.ReactNode;
  elevated?: boolean;
}> = ({ children, elevated }) => (
  <div
    className={`rounded-2xl ${elevated ? 'shadow-md' : 'shadow-sm'}`}
    style={{ backgroundColor: THEME.base, border: `1px solid ${THEME.line}` }}
  >
    {children}
  </div>
);

export const SectionTitle: React.FC<{
  children: React.ReactNode;
  right?: React.ReactNode;
}> = ({ children, right }) => (
  <div className="flex items-center justify-between px-5 pt-5">
    <h3
      className="text-sm font-semibold"
      style={{ color: 'rgba(32,41,49,0.9)' }}
    >
      {children}
    </h3>
    {right}
  </div>
);
