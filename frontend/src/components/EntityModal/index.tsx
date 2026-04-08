import { Tag } from '@/ui';
import { Avatar } from '@/ui/Avatar';
import React from 'react';
import Modal from '../Modal';

export type EntityModalProps<TValues> = {
  open: boolean;
  onClose: () => void;
  header: {
    title: string;
    badge?: string;
    subtitle?: string;
    avatarSeed?: string;
    iconFallback?: React.ReactNode;
  };
  values: TValues;
  setValues: (updater: (prev: TValues) => TValues) => void;
  renderForm: (params: {
    values: TValues;
    setValues: (updater: (prev: TValues) => TValues) => void;
  }) => React.ReactNode;
  onSave: () => Promise<void>;
  onDelete?: () => Promise<void>;
  busy?: boolean;
  error?: string;
};

export default function EntityModal<TValues>({
  open,
  onClose,
  header,
  values,
  setValues,
  renderForm,
  onSave,
  onDelete,
  busy = false,
  error,
}: EntityModalProps<TValues>) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={undefined}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Icon / Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '0.75rem',
              background: '#f2f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {header.avatarSeed ? (
              <Avatar name={header.avatarSeed} size={56} variant="beam" />
            ) : (
              <div style={{ fontSize: 22, color: '#94a3b8' }}>
                {header.iconFallback ?? <i className="fa-regular fa-square" />}
              </div>
            )}
          </div>

          {/* Title + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#020617',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {header.title}
              </span>
              {header.badge && (
                <Tag className="shrink-0 rounded-sm border-none bg-violet-600/10 text-violet-600">
                  {header.badge}
                </Tag>
              )}
            </div>
            {header.subtitle && (
              <p
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  marginTop: 4,
                }}
              >
                {header.subtitle}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={busy ? undefined : onClose}
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
              cursor: busy ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: 13 }} />
          </button>
        </div>

        {/* ── Form area — surface-l1 wrap + surface-l3 inner ── */}
        <div
          style={{
            background: '#f2f3ff' /* surface-l1 */,
            borderRadius: '0.75rem',
            padding: 4,
          }}
        >
          <div
            style={{
              background: '#ffffff' /* surface-l3 */,
              borderRadius: '0.625rem',
              padding: '1.25rem',
            }}
          >
            {renderForm({ values, setValues })}
          </div>
        </div>

        {/* ── Error state ── */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#ffd9d9',
              borderRadius: '0.375rem',
              padding: '10px 14px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#ba1a1a',
            }}
          >
            <i
              className="fa-solid fa-circle-exclamation"
              style={{ fontSize: 13 }}
            />
            {error}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', gap: 12 }}>
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
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
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!busy) {
                  e.currentTarget.style.background = '#ffd9d9';
                  e.currentTarget.style.color = '#ba1a1a';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f2f3ff';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              Terminate
            </button>
          ) : (
            <button
              type="button"
              onClick={busy ? undefined : onClose}
              disabled={busy}
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
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={busy}
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
              cursor: busy ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              opacity: busy ? 0.6 : 1,
              transition: 'opacity 0.15s, transform 0.15s',
            }}
          >
            {busy ? 'Processing...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
