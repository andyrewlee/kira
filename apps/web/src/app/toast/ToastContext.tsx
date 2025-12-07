import React, { createContext, useContext, useState, useCallback } from "react";

export interface Toast {
  id: string;
  message: string;
  tone?: "info" | "success" | "warn" | "error";
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, tone?: Toast["tone"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...toneStyle[t.tone || "info"] }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const containerStyle: React.CSSProperties = {
  position: "fixed",
  top: "16px",
  right: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  zIndex: 1000,
};

const toastStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  color: "#0b1220",
  minWidth: "220px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  fontSize: "14px",
};

const toneStyle: Record<string, React.CSSProperties> = {
  info: { background: "#e0f2fe" },
  success: { background: "#dcfce7" },
  warn: { background: "#fef9c3" },
  error: { background: "#fee2e2" },
};
