import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { DemoState } from '../types';
import type { DemoAction } from './actions';
import { demoReducer } from './demoReducer';
import { initialDemoState } from '../data/initialState';
import { loadState, saveState } from '../lib/localStorage';

type DemoContextType = {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
};

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    demoReducer,
    initialDemoState,
    (initial) => loadState() || initial
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextType {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
