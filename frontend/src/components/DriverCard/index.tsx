import type { Driver } from '@/types/types';
import { Avatar } from '@/ui/Avatar';

function licenseEmoji(license: Driver['license_type']) {
  switch (license) {
    case 'E':
      return '🅴';
    case 'D':
      return '🅳';
    case 'C':
      return '🅲';
    case 'B':
      return '🅱️';
    case 'A':
      return '🅰️';
    default:
      return '🚚';
  }
}

export function DriverCard({
  name,
  license,
  onClick,
}: {
  name: string;
  license: Driver['license_type'];
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:shadow-sm"
      style={{ backgroundColor: '#FCFCFF', borderColor: '#E6ECF2' }}
    >
      <div className="relative">
        <Avatar name={name} className="h-10 w-10" size={40} variant="beam" />
        <span className="absolute -right-1 -bottom-1 rounded-full bg-white px-1 text-xs shadow">
          {licenseEmoji(license)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-gray-900">
            {name}
          </span>
          <span
            className="ml-3 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{ borderColor: '#D6DFE8', color: '#475569' }}
          >
            License {license}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">Driver</p>
      </div>
    </button>
  );
}

export default DriverCard;
