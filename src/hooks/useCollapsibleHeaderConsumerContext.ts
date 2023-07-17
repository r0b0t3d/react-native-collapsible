import { createContext, ReactNode, useContext } from 'react';

export type HeaderItem = { key: string; children: ReactNode };

type CollapsibleContextHeaderConsumerType = {
  headers: HeaderItem[];
  mount: (key: string, header: ReactNode) => void;
  update: (key: string, header: ReactNode) => void;
  unmount: (key: string) => void;
};

export const CollapsibleHeaderConsumerContext =
  // @ts-ignore
  createContext<CollapsibleContextHeaderConsumerType>({});

export default function useCollapsibleHeaderConsumerContext() {
  const ctx = useContext(CollapsibleHeaderConsumerContext);
  if (!ctx) {
    throw new Error('Component should be wrapped CollapsibleHeaderProvider');
  }
  return ctx;
}
