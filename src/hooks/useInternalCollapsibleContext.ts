import { createContext, useContext } from 'react';
import type { CollapsibleContextInternalType } from '../types';

export const InternalCollapsibleContext =
  // @ts-ignore
  createContext<CollapsibleContextInternalType>();

export function useInternalCollapsibleContext() {
  const ctx = useContext(InternalCollapsibleContext);
  if (!ctx) {
    console.log('Component should be rendered inside CollapsibleContainer');
  }
  return ctx;
}
