import React from 'react';

export default function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
        {title && (
          <div
            className="border-b px-4 py-3 text-sm font-semibold"
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            {title}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
