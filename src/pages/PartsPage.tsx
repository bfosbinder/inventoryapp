import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../state/useStore';

export default function PartsPage() {
  const { parts, tools, assignments, addPart, assign, unassign } = useStore();
  const [partNo, setPartNo] = useState('');
  const [name, setName] = useState('');
  const [selPart, setSelPart] = useState('');
  const [selTool, setSelTool] = useState('');

  const asgByPart = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const a of assignments) {
      (map[a.partNo] ||= []).push(a.toolId);
    }
    return map;
  }, [assignments]);

  const submitPart = () => {
    if (!partNo) return;
    const ok = addPart({ partNo, name });
    if (ok) {
      setPartNo('');
      setName('');
    }
  };

  const submitAssign = () => {
    if (selPart && selTool) assign(selPart, selTool);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="font-semibold">Add Part</CardHeader>
        <CardContent>
          <div className="grid gap-2 lg:grid-cols-3">
            <Input placeholder="Part Number" value={partNo} onChange={(e) => setPartNo(e.target.value)} />
            <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={submitPart}>Add Part</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="font-semibold">Assign Tool → Part</CardHeader>
        <CardContent>
          <div className="grid gap-2 lg:grid-cols-4 items-center">
            <select
              className="touch-target w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selPart}
              onChange={(e) => setSelPart(e.target.value)}
            >
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.partNo} value={p.partNo}>{p.partNo} — {p.name}</option>
              ))}
            </select>
            <select
              className="touch-target w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selTool}
              onChange={(e) => setSelTool(e.target.value)}
            >
              <option value="" disabled>Select Tool</option>
              {tools.filter((t) => !t.isRemoved).map((t) => (
                <option key={t.toolId} value={t.toolId}>{t.toolId} — {t.desc}</option>
              ))}
            </select>
            <div className="lg:col-span-2"><Button onClick={submitAssign}>Assign</Button></div>
          </div>

          <div className="mt-4 hidden lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left"><th>Part</th><th>Tools</th></tr>
              </thead>
              <tbody>
                {parts.map((p) => (
                  <tr key={p.partNo} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2">{p.partNo} — {p.name}</td>
                    <td className="space-x-2">
                      {(asgByPart[p.partNo] || []).map((tid) => (
                        <Button key={tid} size="sm" variant="outline" onClick={() => unassign(p.partNo, tid)}>
                          {tid} ✕
                        </Button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:hidden mt-2">
            {parts.map((p) => (
              <Card key={p.partNo}>
                <CardHeader>{p.partNo} — {p.name}</CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(asgByPart[p.partNo] || []).map((tid) => (
                      <Button key={tid} size="sm" variant="outline" onClick={() => unassign(p.partNo, tid)}>
                        {tid} ✕
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
