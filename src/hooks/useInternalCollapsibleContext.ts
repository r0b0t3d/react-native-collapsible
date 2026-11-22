import { createContext, useContext } from 'react';
import type { CollapsibleContextInternalType } from '../types';

export const InternalCollapsibleContext =
  createContext<CollapsibleContextInternalType | null>(null);

export default function useInternalCollapsibleContext() {
  const ctx = useContext(InternalCollapsibleContext);
  if (!ctx) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return ctx;
}
