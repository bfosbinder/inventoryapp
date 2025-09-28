export function StatusDot({ color = 'green', pulse = false }: { color?: 'green' | 'red' | 'yellow' | 'gray'; pulse?: boolean }) {
  const map: Record<string, string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    gray: 'bg-gray-400',
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[color]} ${pulse ? 'animate-pulse' : ''}`} />;
}
