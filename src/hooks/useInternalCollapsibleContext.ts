import { createContext, useContext } from 'react';
import type { CollapsibleContextInternalType } from '../types';

export const InternalCollapsibleContext =
  // @ts-ignore
  createContext<CollapsibleContextInternalType>();

export function useInternalCollapsibleContext() {
  const ctx = useContext(InternalCollapsibleContext);
  if (!ctx) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return ctx;
}
