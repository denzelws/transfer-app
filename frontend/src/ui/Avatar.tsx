import BoringAvatar from 'boring-avatars';

export function Avatar({
  name,
  className = 'h-10 w-10',
  size = 40,
  variant = 'beam',
}: {
  name: string;
  className?: string;
  size?: number;
  variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
}) {
  // Cores consistentes com tema suave
  const colors = ['#22c55e', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-gray-100 ${className}`}
    >
      <BoringAvatar
        name={name}
        size={size}
        variant={variant}
        colors={colors}
        square
      />
    </div>
  );
}
