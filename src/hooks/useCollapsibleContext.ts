import { createContext, useContext } from 'react';
import type { CollapsibleContextType } from '../types';

// @ts-ignore
export const CollapsibleContext = createContext<CollapsibleContextType>({});

export function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    console.log('Component should be wrapped by withCollapsibleContext');
  }
  return ctx;
}
