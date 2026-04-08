import React from 'react';

/* ─────────────────────────────────────────────────────────────────
   IconBtn — sidebar navigation button
───────────────────────────────────────────────────────────────── */
interface IconBtnProps {
  children: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const IconBtn: React.FC<IconBtnProps> = ({
  children,
  label,
  onClick,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 ${className}`}
    aria-label={label || 'icon'}
  >
    {children}
    {label && (
      <span className="pointer-events-none absolute left-full z-50 ml-4 rounded-md bg-slate-950 px-2 py-1 text-[10px] font-bold tracking-widest whitespace-nowrap text-white uppercase opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    )}
  </button>
);

/* ─────────────────────────────────────────────────────────────────
   Tag — generic pill. Kept round for non-status labels.
   For status chips use the .chip-* CSS classes from global.css.
───────────────────────────────────────────────────────────────── */
interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${className}`}
  >
    {children}
  </span>
);

type ChipVariant = 'success' | 'error' | 'info' | 'warn' | 'neutral';

interface StatusChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => <span className={`chip chip-${variant} ${className}`}>{children}</span>;

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`overflow-hidden ${className}`}>{children}</div>
);

interface SectionTitleProps {
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  right,
  className = '',
}) => (
  <div className={`flex items-center justify-between ${className}`}>
    <h3 className="label-sm text-slate-400">{children}</h3>
    {right}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   PrecisionInput — compact 36px input aligned to design tokens
───────────────────────────────────────────────────────────────── */
interface PrecisionInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PrecisionInput: React.FC<PrecisionInputProps> = ({
  label,
  id,
  className = '',
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="label-sm ml-1 text-slate-500">
        {label}
      </label>
    )}
    <input id={id} className={`input-precision ${className}`} {...props} />
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   PrecisionSelect — compact 36px select
───────────────────────────────────────────────────────────────── */
interface PrecisionSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const PrecisionSelect: React.FC<PrecisionSelectProps> = ({
  label,
  id,
  className = '',
  children,
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="label-sm ml-1 text-slate-500">
        {label}
      </label>
    )}
    <select
      id={id}
      className={`input-precision cursor-pointer appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);
