export function TruckCard({
  plate,
  model,
  year,
  minLicense,
  onClick,
}: {
  plate: string;
  model: string;
  year: number;
  minLicense: string;
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
        {/* Ícone/emoji de caminhão */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
          <span className="text-lg">🚚</span>
        </div>
        <span className="absolute -right-1 -bottom-1 rounded-full bg-white px-1 text-xs shadow">
          {minLicense}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-gray-900">
            {plate}
          </span>
          <span
            className="ml-3 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{ borderColor: '#D6DFE8', color: '#475569' }}
          >
            min {minLicense}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          {model} ({year})
        </p>
      </div>
    </button>
  );
}

export default TruckCard;
