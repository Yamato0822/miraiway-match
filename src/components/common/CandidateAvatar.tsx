export function FlagIcon({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <img
      src="https://flagcdn.com/w40/lk.png"
      srcSet="https://flagcdn.com/w80/lk.png 2x"
      alt="スリランカ国旗"
      className={`inline-block object-cover rounded-[2px] shadow-sm ${className}`}
      loading="lazy"
    />
  );
}

const defaultPhotos: Record<string, string> = {
  'c1': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'c2': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'c3': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'c4': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  'c5': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'c6': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'c7': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  'c8': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
};

const defaultFallbackPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

export function CandidateAvatar({
  src,
  name,
  candidateId,
  size = 'md',
  className = '',
}: {
  src?: string;
  name: string;
  candidateId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-11 h-11 text-[15px]',
    lg: 'w-16 h-16 text-[20px]',
    xl: 'w-24 h-24 text-[28px]',
  }[size];

  const photoUrl = src || (candidateId ? defaultPhotos[candidateId] : null) || defaultFallbackPhoto;

  return (
    <img
      src={photoUrl}
      alt={name}
      className={`object-cover rounded-full border border-black/10 shadow-sm shrink-0 ${sizeClasses} ${className}`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = defaultFallbackPhoto;
      }}
    />
  );
}
