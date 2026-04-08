import { Tag } from '@/ui';
import { Avatar } from '@/ui/Avatar';
import React from 'react';

export type EntityCardProps = {
  kind?: 'driver' | 'truck' | 'dashboard';
  title: string;
  badge?: string;
  avatarSeed?: string;
  iconFallback?: React.ReactNode;
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
      className="group bg-surface-l0/50 hover:bg-surface-l1 hover:shadow-primary/5 flex w-full flex-col gap-6 rounded-[2rem] p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="flex w-full items-start justify-between">
        <div className="group-hover:ring-primary/20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all">
          {avatarSeed ? (
            <Avatar name={avatarSeed} size={48} variant="beam" />
          ) : (
            <div className="group-hover:text-primary text-xl text-slate-400 transition-colors">
              {iconFallback ?? <i className="fa-regular fa-square" />}
            </div>
          )}
        </div>

        {badge && (
          <Tag className="group-hover:bg-primary/10 group-hover:text-primary bg-slate-100 text-slate-500 transition-colors">
            {badge}
          </Tag>
        )}
      </div>

      <div className="space-y-1">
        <h5 className="text-base leading-tight font-black tracking-tight text-slate-900">
          {title}
        </h5>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {kind}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-primary text-[10px] font-bold tracking-tighter uppercase opacity-60">
            System Verified
          </span>
        </div>
      </div>
    </button>
  );
}
