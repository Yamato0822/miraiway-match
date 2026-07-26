type Props = {
  className?: string;
  height?: number;
};

export function MiraiWayLogo({ className = '', height = 36 }: Props) {
  return (
    <img
      src="/miraiway-logo.png"
      alt="MiraiWay Logo"
      style={{ height: `${height}px` }}
      className={`w-auto object-contain ${className}`}
    />
  );
}
