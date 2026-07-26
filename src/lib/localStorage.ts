import type { DemoState } from '../types';
import { DEMO_STATE_VERSION } from '../data/initialState';

const STORAGE_KEY = 'miraiway-match-prototype-v5';

export function loadState(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed.version !== DEMO_STATE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: DemoState): void {
  try {
    const toSave = { ...state, ui: { toast: null, modal: null } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportFeedback(state: DemoState): string {
  const data = {
    prototypeVersion: state.version,
    exportedAt: new Date().toISOString(),
    entries: state.feedbackEntries,
  };
  return JSON.stringify(data, null, 2);
}
