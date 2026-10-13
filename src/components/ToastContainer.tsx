import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-blue-600 text-white';
        let icon = <Info className="w-5 h-5 flex-shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white';
          icon = <CheckCircle2 className="w-5 h-5 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-red-600 text-white';
          icon = <AlertCircle className="w-5 h-5 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-600 text-white';
          icon = <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${bg}`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/90"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
