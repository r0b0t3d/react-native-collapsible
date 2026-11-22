import { createContext, useContext } from 'react';
import type { CollapsibleContextType } from '../types';

export const CollapsibleContext = createContext<CollapsibleContextType | null>(
  null
);

export default function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return ctx;
}
