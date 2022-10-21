import { createContext, ReactNode, useContext } from 'react';

export type HeaderItem = { key: string; children: ReactNode };

type CollapsibleContextHeaderType = {
  headers: HeaderItem[];
  mount: (key: string, header: ReactNode) => void;
  update: (key: string, header: ReactNode) => void;
  unmount: (key: string) => void;
};

export const CollapsibleHeaderContext =
  // @ts-ignore
  createContext<CollapsibleContextHeaderType>({});

export default function useCollapsibleHeaderContext() {
  const ctx = useContext(CollapsibleHeaderContext);
  if (!ctx) {
    throw new Error('Component should be wrapped CollapsibleHeaderProvider');
  }
  return ctx;
}
