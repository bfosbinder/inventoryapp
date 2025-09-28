import type { ReactNode } from 'react';

export function Badge({ children, color = 'gray' }: { children: ReactNode; color?: 'gray' | 'green' | 'red' | 'yellow' | 'blue' }) {
  const map = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
  } as const;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[color]}`}>{children}</span>;
}
