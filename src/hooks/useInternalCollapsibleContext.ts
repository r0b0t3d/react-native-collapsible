import { createContext, useContext } from 'react';
import type { CollapsibleContextInternalType } from '../types';

export const InternalCollapsibleContext =
  createContext<CollapsibleContextInternalType>({
    setCollapsibleHandlers: () => null,
  });

export function useInternalCollapsibleContext() {
  const ctx = useContext(InternalCollapsibleContext);
  if (!ctx) {
    console.log('Component should be rendered inside CarouselContainer');
  }
  return ctx;
}
