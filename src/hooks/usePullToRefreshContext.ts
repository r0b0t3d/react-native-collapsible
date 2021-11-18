import { createContext, useContext } from 'react';
import type { PullToRefreshContextType } from '../types';

// @ts-ignore
export const PullToRefreshContext = createContext<PullToRefreshContextType>({});

export default function usePullToRefreshContext() {
  const ctx = useContext(PullToRefreshContext);
  if (!ctx) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return ctx;
}
