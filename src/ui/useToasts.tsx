import { createContext, useContext, useState, type ReactNode } from 'react';

type Toast = { id: number; message: string };
type Ctx = { toasts: Toast[]; push: (m: string) => void; remove: (id: number) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => remove(id), 3000);
  };
  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return (
    <ToastCtx.Provider value={{ toasts, push, remove }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-900 text-white px-4 py-2 rounded shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToasts() {
  const v = useContext(ToastCtx);
  if (!v) throw new Error('ToastProvider missing');
  return v;
}
