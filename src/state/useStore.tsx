import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Activity, Assignment, Part, Tool } from './types';
import { UNALLOC } from './types';
import { demoLocations, fmtTime, nowISO, seedAssignments, seedParts, seedTools, trimActivities } from '../data/demo';

type Store = {
  tools: Tool[];
  parts: Part[];
  assignments: Assignment[];
  activities: Activity[];
  showRemoved: boolean;

  addActivity: (a: Activity) => void;
  registerTool: (rfid: string, location: string) => Tool;
  moveTool: (toolId: string, location: string, note?: string) => void;
  breakdownTool: (toolId: string) => void;
  archiveTool: (toolId: string) => void;
  restoreTool: (toolId: string) => void;

  addPart: (part: Part) => boolean;
  assign: (partNo: string, toolId: string) => void;
  unassign: (partNo: string, toolId: string) => void;

  findByRFID: (rfid: string) => Tool | undefined;
  findByToolId: (toolId: string) => Tool | undefined;
  toggleShowRemoved: () => void;
};

function createStore() {
  const seededTools = seedTools();
  const seededParts = seedParts();
  const [tools, setTools] = useState<Tool[]>(seededTools);
  const [parts, setParts] = useState<Part[]>(seededParts);
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments(seededTools, seededParts));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showRemoved, setShowRemoved] = useState(false);

  const findByRFID = (rfid: string) => tools.find((t) => t.rfid === rfid);
  const findByToolId = (toolId: string) => tools.find((t) => t.toolId === toolId);

  const addActivity = (a: Activity) => setActivities((prev) => trimActivities([...prev, a]));

  const upTool = (toolId: string, mutate: (t: Tool) => Tool) =>
    setTools((prev) => prev.map((t) => (t.toolId === toolId ? mutate({ ...t }) : t)));

  const registerTool = (rfid: string, location: string) => {
    const existing = findByRFID(rfid);
    if (existing) return existing;
    const newTool: Tool = {
      toolId: `NEW-${(tools.length + 1).toString().padStart(4, '0')}`,
      desc: 'New Registered Tool',
      group: 'UNKNOWN',
      stickout: 1,
      rfid,
      currentLocation: location,
      status: 'In Rack',
      lastSeen: nowISO(),
      isRemoved: false,
    };
    setTools((prev) => [...prev, newTool]);
    addActivity({ ts: nowISO(), type: 'REGISTER', rfid, toolId: newTool.toolId, location });
    return newTool;
  };

  const moveTool = (toolId: string, location: string, note?: string) => {
    const t = findByToolId(toolId);
    if (!t) return;
    upTool(toolId, (x) => ({ ...x, currentLocation: location, status: location.startsWith('MC-') ? 'Issued' : x.status, lastSeen: nowISO() }));
    addActivity({ ts: nowISO(), type: 'MOVE', rfid: t.rfid, toolId, location, note });
  };

  const breakdownTool = (toolId: string) => {
    const t = findByToolId(toolId);
    if (!t) return;
    upTool(toolId, (x) => ({ ...x, currentLocation: UNALLOC, status: 'Unallocated', lastSeen: nowISO() }));
    addActivity({ ts: nowISO(), type: 'BREAKDOWN', toolId, location: UNALLOC });
  };

  const archiveTool = (toolId: string) => {
    const t = findByToolId(toolId);
    if (!t) return;
    upTool(toolId, (x) => ({ ...x, isRemoved: true, status: 'Archived', lastSeen: nowISO() }));
    addActivity({ ts: nowISO(), type: 'REMOVE', toolId });
  };

  const restoreTool = (toolId: string) => {
    const t = findByToolId(toolId);
    if (!t) return;
    upTool(toolId, (x) => ({ ...x, isRemoved: false, status: x.currentLocation === UNALLOC ? 'Unallocated' : 'In Rack', lastSeen: nowISO() }));
  };

  const addPart = (part: Part) => {
    if (parts.some((p) => p.partNo === part.partNo)) return false;
    setParts((prev) => [...prev, part]);
    return true;
  };

  const assign = (partNo: string, toolId: string) => {
    setAssignments((prev) => (prev.some((a) => a.partNo === partNo && a.toolId === toolId) ? prev : [...prev, { partNo, toolId }]));
  };

  const unassign = (partNo: string, toolId: string) => {
    setAssignments((prev) => prev.filter((a) => !(a.partNo === partNo && a.toolId === toolId)));
  };

  const toggleShowRemoved = () => setShowRemoved((v) => !v);

  return {
    tools,
    parts,
    assignments,
    activities,
    showRemoved,
    addActivity,
    registerTool,
    moveTool,
    breakdownTool,
    archiveTool,
    restoreTool,
    addPart,
    assign,
    unassign,
    findByRFID,
    findByToolId,
    toggleShowRemoved,
  } satisfies Store;
}

const StoreCtx = createContext<ReturnType<typeof createStore> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = createStore();
  return (<StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>);
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('StoreProvider missing');
  return ctx;
}

export { demoLocations, fmtTime };
