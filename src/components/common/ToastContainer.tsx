import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      id="toast-notification-region"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        let borderClass = 'border-blue-500/40';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
          borderClass = 'border-red-500/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-4 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border ${borderClass} shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 text-[var(--color-text-primary)]`}
          >
            {icon}
            <div className="flex-1 text-sm">
              <p className="font-semibold text-xs tracking-wide uppercase text-[var(--color-text-primary)]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Fechar notificação"
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
