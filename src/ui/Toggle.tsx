import type { ButtonHTMLAttributes } from 'react';

export function Toggle({ checked, ...props }: { checked: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-pressed={checked}
      className={`touch-target inline-flex items-center w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
      {...props}
    >
      <span className={`inline-block h-5 w-5 bg-white rounded-full transform transition-transform ${checked ? 'translate-x-5' : ''}`}></span>
    </button>
  );
}
