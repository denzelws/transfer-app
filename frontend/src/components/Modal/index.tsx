import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-in fade-in absolute inset-0 duration-300"
        style={{
          background: 'rgba(19, 27, 46, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="animate-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-xl duration-300"
        style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow:
            '0 16px 32px -8px rgba(19, 27, 46, 0.12), 0 4px 8px rgba(19, 27, 46, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-8 flex items-center justify-between">
            <h2
              className="text-slate-950"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h2>
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
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#eaedff')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#f2f3ff')
              }
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 14 }} />
            </button>
          </div>
        )}

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
