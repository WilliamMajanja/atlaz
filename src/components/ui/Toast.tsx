"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => removeToast(toast.id), 300);
    }, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  if (!visible) return null;

  const typeStyles: Record<Toast["type"], string> = {
    success: "bg-emerald-600 text-white",
    error: "bg-rose-600 text-white",
    warning: "bg-amber-600 text-white",
    info: "bg-cyan-600 text-white",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-md animate-slide-in ${typeStyles[toast.type]}`}
      role="alert"
      style={{ pointerEvents: "auto" }}
    >
      <span className="flex-1 text-sm">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-white/70 hover:text-white text-lg leading-none p-0.5"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  return {
    success: (message: string, duration?: number) => addToast({ message, type: "success", duration }),
    error: (message: string, duration?: number) => addToast({ message, type: "error", duration }),
    warning: (message: string, duration?: number) => addToast({ message, type: "warning", duration }),
    info: (message: string, duration?: number) => addToast({ message, type: "info", duration }),
  };
}