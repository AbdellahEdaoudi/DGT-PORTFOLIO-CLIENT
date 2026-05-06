"use client";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const TOAST_DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION);
  }, [removeToast]);

  const toast = {
    success: (m) => addToast(m, 'success'),
    error: (m) => addToast(m, 'error'),
    info: (m) => addToast(m, 'info'),
    warning: (m) => addToast(m, 'warning'),
  };

  const icons = {
    success: (
      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((t, index) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
              className="pointer-events-auto"
            >
              <div className="relative group overflow-hidden rounded-2xl">
                {/* Glass Background */}
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50
                dark:border-zinc-800/50 
                shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                 py-4 pl-5 pr-6 flex items-center gap-4 min-w-[340px] max-w-md transition-all duration-300">

                  {/* Animated Glow behind icon */}
                  <div className={`absolute -left-4 -top-4 w-16 h-16 blur-2xl opacity-20 rounded-full ${t.type === 'success' ? 'bg-emerald-500' :
                      t.type === 'error' ? 'bg-rose-500' :
                        t.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />

                  {/* Icon Container */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner 
                  ${t.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                      t.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10' :
                        t.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10' :
                          'bg-blue-50 dark:bg-blue-500/10'
                    }`}>
                    {icons[t.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {t.message}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => removeToast(t.id)}
                    className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Modern Progress Line */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
                    className={`absolute bottom-0 left-0 h-[3px] ${t.type === 'success' ? 'bg-emerald-500' :
                        t.type === 'error' ? 'bg-rose-500' :
                          t.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
