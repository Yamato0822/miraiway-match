import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'black';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  style,
  ...rest
}: Props) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-xl transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]";
  
  const sizeClasses = {
    sm: 'px-4 h-9 text-[14px]',
    md: 'px-5 h-11 text-[15px]',
    lg: 'px-6 h-12 text-[16px]',
  }[size];

  const variantClasses = {
    primary: 'bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow',
    black: 'bg-[#1D1D1F] text-white hover:bg-[#333336] shadow-sm hover:shadow',
    secondary: 'bg-[#E8E8ED] text-[#1D1D1F] hover:bg-[#D2D2D7]',
    tertiary: 'bg-transparent text-[#0071E3] hover:bg-[#0071E3]/10',
    destructive: 'bg-[#FF3B30] text-white hover:bg-[#D70015]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
