import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warn';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: { children: ReactNode; variant?: Variant; size?: Size } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'touch-target inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-3 text-lg',
  } as const;
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warn: 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400',
  } as const;
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
