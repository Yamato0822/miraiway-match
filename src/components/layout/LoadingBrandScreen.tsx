import { useState, useEffect } from 'react';

type Props = {
  duration?: number;
  message?: string;
  onComplete: () => void;
};

export function LoadingBrandScreen({ duration = 1200, message = '候補者のストーリーを準備しています', onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const messages = [
    message,
    'マッチング情報を整理しています',
    'まもなく準備が完了します',
  ];

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const actualDuration = reducedMotion ? 300 : duration;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, actualDuration / 50);

    const phaseTimer = setInterval(() => {
      setPhase((p) => (p + 1) % messages.length);
    }, actualDuration / 3);

    const timer = setTimeout(onComplete, actualDuration);

    return () => {
      clearInterval(interval);
      clearInterval(phaseTimer);
      clearTimeout(timer);
    };
  }, [duration, onComplete, messages.length]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: '#FAFBFC' }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="読み込み中"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-[3px]">
            <div
              className="w-[4px] rounded-full"
              style={{
                backgroundColor: '#1C6FB8',
                height: '20px',
                animation: 'bar-pulse-1 1s ease-in-out infinite',
              }}
            />
            <div
              className="w-[4px] rounded-full"
              style={{
                backgroundColor: '#1A4686',
                height: '26px',
                animation: 'bar-pulse-2 1s ease-in-out 0.15s infinite',
              }}
            />
            <div
              className="w-[4px] rounded-full"
              style={{
                backgroundColor: progress > 80 ? '#F4B01E' : '#10315C',
                height: '16px',
                animation: 'bar-pulse-3 1s ease-in-out 0.3s infinite',
                transition: 'background-color 0.4s ease',
              }}
            />
          </div>
          <h1
            className="text-[28px] font-bold tracking-tight"
            style={{ color: '#10315C' }}
          >
            MiraiWay <span style={{ color: '#1C6FB8' }}>Match</span>
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-[280px] h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: '#E5EAF0' }}>
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: progress > 90 ? '#F4B01E' : '#1C6FB8',
            }}
          />
        </div>

        {/* Status text */}
        <p
          className="text-[13px] transition-opacity duration-300"
          style={{ color: '#5D6B82' }}
        >
          {messages[phase]}
        </p>
      </div>
    </div>
  );
}
