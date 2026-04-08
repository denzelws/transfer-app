import BoringAvatar from 'boring-avatars';

interface AvatarProps {
  name: string;
  className?: string;
  size?: number;
  variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
}

export function Avatar({
  name,
  className = '',
  size = 40,
  variant = 'beam',
}: AvatarProps) {
  const colors = ['#7c3aed', '#4f46e5', '#6366f1', '#0f172a', '#f8fafc'];

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-[1.25rem] ${className}`}
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
