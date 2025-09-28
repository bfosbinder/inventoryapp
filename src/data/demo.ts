import type { Tool, Part, Assignment, Activity } from '../state/types';

export const demoLocations = [
  'A-01-001', 'A-01-002', 'A-01-003',
  'A-02-001', 'A-02-002', 'A-02-003',
  'B-01-001', 'B-01-002', 'B-01-003',
  'QUAR-AREA', 'TOOLROOM-RET', 'CAL-QUEUE',
  'MC-01', 'MC-02', 'CART-01', 'CART-02',
] as const;

export const nowISO = () => new Date().toISOString();
export const fmtTime = (iso: string) => new Date(iso).toLocaleString();
export const sanitizeBarcode = (s: string) => s.trim().toUpperCase();

export const uid = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const statusPool: Tool['status'][] = ['In Rack', 'Issued', 'Calibration', 'Quarantine', 'Unallocated'];
const groups = ['DRILL', 'ENDMILL', 'CHAMFER', 'TAP'] as const;

export function seedTools(): Tool[] {
  const tools: Tool[] = [];
  for (let i = 0; i < 6; i++) {
    const toolId = `EM-${(300 + i * 25).toString().padStart(4, '0')}B`;
    tools.push({
      toolId,
      desc: `Demo Tool ${i + 1}`,
      group: groups[i % groups.length],
      stickout: Math.round((1.0 + i * 0.125) * 1000) / 1000,
      rfid: uid(),
      currentLocation: demoLocations[(i * 3) % demoLocations.length],
      status: statusPool[(i * 2) % statusPool.length],
      lastSeen: nowISO(),
      isRemoved: false,
    });
  }
  return tools;
}

export function seedParts(): Part[] {
  return [
    { partNo: 'PN-1001', name: 'Housing' },
    { partNo: 'PN-1002', name: 'Bracket' },
  ];
}

export function seedAssignments(tools: Tool[], parts: Part[]): Assignment[] {
  const asg: Assignment[] = [];
  if (tools[0]) asg.push({ partNo: parts[0].partNo, toolId: tools[0].toolId });
  if (tools[1]) asg.push({ partNo: parts[0].partNo, toolId: tools[1].toolId });
  if (tools[2]) asg.push({ partNo: parts[1].partNo, toolId: tools[2].toolId });
  return asg;
}

export function trimActivities(acts: Activity[], max = 50) {
  return acts.slice(-max);
}
