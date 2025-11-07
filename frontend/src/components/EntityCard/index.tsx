import { Avatar } from '@/ui/Avatar';
import React from 'react';

export type EntityCardProps = {
  kind?: 'driver' | 'truck' | 'dashboard';
  title: string;
  badge?: string;
  avatarSeed?: string;
  iconFallback?: React.ReactNode; // mostra se não tiver avatarSeed
  onClick?: () => void;
};

export default function EntityCard({
  kind = 'dashboard',
  title,
  badge,
  avatarSeed,
  iconFallback,
  onClick,
}: EntityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:shadow-sm"
      style={{ backgroundColor: '#FCFCFF', borderColor: '#E6ECF2' }}
    >
      <div className="relative">
        <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {avatarSeed ? (
            <Avatar
              name={avatarSeed}
              className="h-10 w-10"
              size={40}
              variant="beam"
            />
          ) : (
            (iconFallback ?? <i className="fa-regular fa-square" />)
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-gray-900">
            {title}
          </span>
          {badge && (
            <span
              className="ml-3 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium"
              style={{ borderColor: '#D6DFE8', color: '#475569' }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500 capitalize">{kind}</p>
      </div>
    </button>
  );
}
