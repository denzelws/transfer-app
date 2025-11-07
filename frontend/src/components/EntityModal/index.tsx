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
    avatarSeed?: string; // NEW
    iconFallback?: React.ReactNode; // NEW
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
  accentColor?: string;
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
  accentColor = '#14D64D',
}: EntityModalProps<TValues>) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={header.title}>
      <div className="space-y-4">
        {/* Header com Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {header.avatarSeed ? (
              <Avatar
                name={header.avatarSeed}
                className="h-12 w-12"
                size={48}
                variant="beam"
              />
            ) : (
              (header.iconFallback ?? <i className="fa-regular fa-square" />)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="truncate text-sm font-semibold text-gray-900">
                {header.title}
              </span>
              {header.badge && (
                <span
                  className="ml-3 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium"
                  style={{ borderColor: '#D6DFE8', color: '#475569' }}
                >
                  {header.badge}
                </span>
              )}
            </div>
            {header.subtitle && (
              <p className="mt-0.5 text-xs text-gray-500">{header.subtitle}</p>
            )}
          </div>
        </div>

        {/* Form genérico */}
        <div className="space-y-3">{renderForm({ values, setValues })}</div>

        {error && <div className="text-xs text-red-600">{error}</div>}

        {/* Ações */}
        <div className="flex items-center justify-between pt-2">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded-md px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: '#fff',
              }}
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-md px-3 py-2 text-sm disabled:opacity-50"
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: '#fff',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={busy}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {busy ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
