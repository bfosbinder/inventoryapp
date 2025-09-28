import { useMemo } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { useStore } from '../state/useStore';
import { useHashRoute } from '../hooks/useHashRoute';

export default function InventoryPage() {
  const { tools, showRemoved, toggleShowRemoved, breakdownTool, archiveTool, restoreTool } = useStore();
  const { params } = useHashRoute();

  const view = useMemo(() => tools.filter((t) => (showRemoved ? true : !t.isRemoved)), [tools, showRemoved]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="font-semibold">Inventory</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Show removed</span>
              <Toggle checked={showRemoved} onClick={toggleShowRemoved} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {params.tool ? (
            <div className="mb-3 text-xs text-blue-700 dark:text-blue-300">Deep link: tool={params.tool}. Go to Scan to preview by RFID.</div>
          ) : null}
          <div className="grid grid-cols-1 gap-3">
            {view.map((t) => (
              <Card key={t.toolId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.toolId}</div>
                    <div className="text-xs">{t.group}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{t.desc}</div>
                  <div className="text-sm">Loc: <span className="font-mono">{t.currentLocation}</span></div>
                  <div className="text-sm">Status: {t.status}</div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => breakdownTool(t.toolId)}>Break Down</Button>
                    {!t.isRemoved ? (
                      <Button variant="danger" size="sm" onClick={() => archiveTool(t.toolId)}>Archive</Button>
                    ) : (
                      <Button variant="success" size="sm" onClick={() => restoreTool(t.toolId)}>Restore</Button>
                    )}
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
