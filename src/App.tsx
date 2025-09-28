import { useEffect, useMemo, useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import ScanPage from './pages/ScanPage';
import InventoryPage from './pages/InventoryPage';
import PartsPage from './pages/PartsPage';
import PickPage from './pages/PickPage';
import { StatusDot } from './ui/StatusDot';
import { Toggle } from './ui/Toggle';
import { ToastProvider } from './ui/useToasts';
import { StoreProvider } from './state/useStore';

const tabs: { key: 'scan' | 'inventory' | 'parts' | 'pick'; label: string }[] = [
  { key: 'scan', label: 'Scan' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'parts', label: 'Parts' },
  { key: 'pick', label: 'Pick List' },
];

export default function App() {
  const { route, navigate } = useHashRoute();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') navigate('scan');
        else if (e.key === '2') navigate('inventory');
        else if (e.key === '3') navigate('parts');
        else if (e.key === '4') navigate('pick');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const Page = useMemo(() => {
    if (route === 'inventory') return <InventoryPage />;
    if (route === 'parts') return <PartsPage />;
    if (route === 'pick') return <PickPage />;
    return <ScanPage />;
  }, [route]);

  return (
    <StoreProvider>
      <ToastProvider>
        <div className="min-h-full flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold">CNC Tool Storage — Demo</span>
              <span className="hidden lg:inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">Scanner <StatusDot color="green" pulse /></span>
              <span className="hidden lg:inline"><span className="ml-2 text-xs"><span className="px-1.5 py-0.5 rounded border">Alt+1..4</span> switch pages</span></span>
              <span className="ml-2"><span className="text-xs"><span className="px-1 py-0.5 rounded bg-purple-600 text-white">Demo Mode</span></span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Dark</span>
              <Toggle checked={dark} onClick={() => setDark((v) => !v)} />
            </div>
          </div>

        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-4">{Page}</main>

        <nav className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-4">
            {tabs.map((t) => (
              <button key={t.key} className={`touch-target py-2 ${route === t.key ? 'text-blue-600 font-medium' : ''}`} onClick={() => navigate(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </nav>
        </div>
      </ToastProvider>
    </StoreProvider>
  );
}

