import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useStore } from '../state/useStore';
import { UNALLOC } from '../state/types';
import { useHashRoute } from '../hooks/useHashRoute';

export default function PickPage() {
  const { parts, tools, assignments, moveTool } = useStore();
  const { params } = useHashRoute();
  const initialPart = params.part || parts[0]?.partNo || '';
  const [partNo, setPartNo] = useState(initialPart);
  const [dest, setDest] = useState('MC-01');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    const asg = assignments.filter((a) => a.partNo === partNo);
    return asg.map((a) => tools.find((t) => t.toolId === a.toolId)).filter(Boolean) as typeof tools;
  }, [assignments, tools, partNo]);

  const stateOf = (t: typeof tools[number]) => {
    if (!t || t.isRemoved) return { label: 'Archived/Missing', color: 'red' as const, ok: false };
    if (t.currentLocation === UNALLOC) return { label: 'Unallocated', color: 'yellow' as const, ok: false };
    return { label: 'Ready', color: 'green' as const, ok: true };
  };

  const readyIds = rows.filter((t) => stateOf(t).ok && selected[t.toolId]).map((t) => t.toolId);
  const blockedCount = Object.values(selected).filter(Boolean).length - readyIds.length;

  const bulkMove = () => {
    readyIds.forEach((id) => moveTool(id, dest, `Bulk move to ${dest} (Pick List)`));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="font-semibold">Pick List</CardHeader>
        <CardContent>
          <div className="grid gap-2 lg:grid-cols-4 items-center">
            <select
              className="touch-target w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
            >
              {parts.map((p) => (
                <option key={p.partNo} value={p.partNo}>{p.partNo} — {p.name}</option>
              ))}
            </select>
            <div className="lg:col-span-3 flex items-center gap-2">
              <span>Move picked to:</span>
              <select
                className="touch-target w-full max-w-40 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
              >
                {['MC-01', 'MC-02'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Button onClick={bulkMove}>Move to Machine</Button>
              <span className="text-sm text-gray-600">Ready selected: {readyIds.length} • Blocked: {Math.max(blockedCount, 0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-2">
            {rows.map((t) => {
              const st = stateOf(t);
              return (
                <Card key={t.toolId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!selected[t.toolId]} onChange={(e) => setSelected((s) => ({ ...s, [t.toolId]: e.target.checked }))} />
                        <span className="font-semibold">{t.toolId}</span>
                      </label>
                      <Badge color={st.color as any}>{st.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">{t.desc}</div>
                    <div className="text-sm">Loc: <span className="font-mono">{t.currentLocation}</span></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
