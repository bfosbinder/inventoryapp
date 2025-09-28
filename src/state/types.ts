export type Tool = {
  toolId: string;
  desc: string;
  group: 'DRILL' | 'ENDMILL' | 'CHAMFER' | 'TAP' | 'UNKNOWN' | string;
  stickout: number; // inches
  rfid: string; // simulated UID
  currentLocation: string; // e.g. A-01-001, MC-01, UNALLOCATED
  status: 'In Rack' | 'Issued' | 'Calibration' | 'Quarantine' | 'Unallocated' | 'Archived';
  lastSeen: string; // ISO
  isRemoved: boolean; // archived flag
};

export type Part = { partNo: string; name: string };

export type Assignment = { partNo: string; toolId: string };

export type Activity =
  | { ts: string; type: 'MOVE'; rfid: string; toolId: string; location: string; note?: string }
  | { ts: string; type: 'REGISTER'; rfid: string; toolId: string; location: string; note?: string }
  | { ts: string; type: 'BREAKDOWN'; rfid?: string; toolId: string; location: string; note?: string }
  | { ts: string; type: 'REMOVE'; rfid?: string; toolId: string; location?: string; note?: string }
  | { ts: string; type: 'UNREGISTERED'; rfid: string; location: string; note?: string };

export type RouteName = 'scan' | 'inventory' | 'parts' | 'pick';

export const UNALLOC = 'UNALLOCATED';
