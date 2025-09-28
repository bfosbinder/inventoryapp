import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useStore } from '../state/useStore';
import { useToasts } from '../ui/useToasts';
import { fmtTime } from '../state/useStore';
import { sanitizeBarcode } from '../data/demo';
import { CameraScanner } from '../ui/CameraScanner';

export default function ScanPage() {
  const { findByRFID, registerTool, moveTool, addActivity, breakdownTool, archiveTool, restoreTool } = useStore();
  const { push } = useToasts();
  const rfidRef = useRef<HTMLInputElement>(null);
  const locRef = useRef<HTMLInputElement>(null);
  const [rfid, setRfid] = useState('');
  const [location, setLocation] = useState('');
  const [lastMove, setLastMove] = useState<{ toolId: string; prev: string } | null>(null);
  const [scanTarget, setScanTarget] = useState<null | 'rfid' | 'location'>(null);

  const tool = useMemo(() => (rfid ? findByRFID(rfid) : undefined), [rfid]);

  useEffect(() => {
    rfidRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey) {
        // handled globally by App for route switching
        return;
      }
      if (e.key === 'Enter') {
        onSave();
      } else if (e.key === 'Escape') {
        onClear();
      } else if (e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        setRfid(crypto.randomUUID().slice(0, 8).toUpperCase());
      } else if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        setLocation('A-01-001');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rfid, location]);

  const onSave = () => {
    const r = sanitizeBarcode(rfid);
    const loc = sanitizeBarcode(location);
    if (!r || !loc) return;
    const found = findByRFID(r);
    if (!found) {
      addActivity({ ts: new Date().toISOString(), type: 'UNREGISTERED', rfid: r, location: loc });
      const t = registerTool(r, loc);
      push(`Registered ${t.toolId} at ${loc}`);
    } else {
      setLastMove({ toolId: found.toolId, prev: found.currentLocation });
      moveTool(found.toolId, loc);
      push(`Moved ${found.toolId} to ${loc}`);
    }
  };

  const onClear = () => {
    setRfid('');
    setLocation('');
    rfidRef.current?.focus();
  };

  const onUndo = () => {
    if (!lastMove) return;
    moveTool(lastMove.toolId, lastMove.prev, 'Undo last');
    setLastMove(null);
    push('Undid last move');
  };

  return (
    <>
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">RFID</label>
              <div className="flex gap-2">
                <Input ref={rfidRef} placeholder="Scan RFID (Shift+R to simulate)" value={rfid} onChange={(e) => setRfid(e.target.value)} />
                <Button variant="outline" onClick={() => setScanTarget('rfid')}>Scan</Button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Location</label>
              <div className="flex gap-2">
                <Input ref={locRef} placeholder="Scan Location (Shift+L to simulate)" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Button variant="outline" onClick={() => setScanTarget('location')}>Scan</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave}>Save Move (Enter)</Button>
              <Button variant="outline" onClick={onClear}>Clear (Esc)</Button>
              <Button variant="ghost" onClick={onUndo}>Undo Last</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!tool && rfid ? (
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Unregistered RFID. You can Save to register a tool.</div>
          ) : null}
          {tool ? (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <div className="text-lg font-semibold">{tool.toolId} <Badge>{tool.group}</Badge></div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{tool.desc}</div>
                <div className="text-sm">Location: <span className="font-mono">{tool.currentLocation}</span></div>
                <div className="text-sm">Status: {tool.status}</div>
                <div className="text-xs text-gray-500">Last Seen: {fmtTime(tool.lastSeen)}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => breakdownTool(tool.toolId)}>Break Down → Unallocate</Button>
                {!tool.isRemoved ? (
                  <Button variant="danger" onClick={() => archiveTool(tool.toolId)}>Archive/Remove</Button>
                ) : (
                  <Button variant="success" onClick={() => restoreTool(tool.toolId)}>Restore</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Scan an RFID to preview a tool.</div>
          )}
        </CardContent>
      </Card>
    </div>
    {scanTarget && (
      <CameraScanner
        label={scanTarget === 'rfid' ? 'Scan RFID' : 'Scan Location'}
        onResult={(text) => {
          const val = sanitizeBarcode(text);
          if (scanTarget === 'rfid') setRfid(val);
          else setLocation(val);
        }}
        onClose={() => setScanTarget(null)}
      />
    )}
    </>
  );
}
