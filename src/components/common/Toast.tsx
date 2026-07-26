import { useEffect } from 'react';
import { useDemo } from '../../state/DemoContext';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeConfig = {
  success: { icon: CheckCircle, bg: '#EAF7EE', color: '#2D8A4E', border: '#C6E7D0' },
  info: { icon: Info, bg: '#EAF3FB', color: '#1C6FB8', border: '#C1D9F0' },
  warning: { icon: AlertTriangle, bg: '#FFF4DD', color: '#D4860A', border: '#F5DDA0' },
  error: { icon: AlertCircle, bg: '#FEE2E2', color: '#D93025', border: '#F5A5A5' },
};

export function Toast() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const toast = state.ui.toast;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST' });
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-[420px]"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        animation: 'toast-in 0.22s ease-out',
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon size={18} style={{ color: config.color, flexShrink: 0 }} />
      <p className="text-[14px] font-medium flex-1" style={{ color: config.color }}>
        {toast.message}
      </p>
      {toast.action && (
        <button
          onClick={() => {
            navigate(toast.action!.route);
            dispatch({ type: 'DISMISS_TOAST' });
          }}
          className="text-[13px] font-semibold underline ml-1 shrink-0"
          style={{ color: config.color }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => dispatch({ type: 'DISMISS_TOAST' })}
        className="p-0.5 rounded hover:opacity-70"
        aria-label="閉じる"
      >
        <X size={14} style={{ color: config.color }} />
      </button>
    </div>
  );
}
