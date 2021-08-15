import { createContext, useContext } from 'react';
import type { CollapsibleContextType } from '../types';

// @ts-ignore
export const CollapsibleContext = createContext<CollapsibleContextType>({});

export default function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return ctx;
}
