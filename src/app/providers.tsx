import type { ReactNode } from 'react';
import { DemoProvider } from '../state/DemoContext';

export function Providers({ children }: { children: ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>;
}
