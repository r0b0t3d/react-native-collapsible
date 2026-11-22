import { Context, createContext, RefObject, useContext } from 'react';
import type { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { CollapsibleContextType, CollapsibleHandles } from '../types';
import type { HeaderLayouts } from './geometry';

export type InternalCollapsibleContextType = {
  containerRef: RefObject<View | null>;
  containerHeight: SharedValue<number>;
  contentMinHeight: SharedValue<number>;
  collapsibleDistance: SharedValue<number>;
  headerLayouts: SharedValue<HeaderLayouts>;
  measureInContainer: (
    ref: RefObject<any>,
    onMeasure: (top: number, height: number) => void
  ) => void;
  registerScrollable: (handles: CollapsibleHandles) => () => void;
};

export const CollapsibleContext = createContext<CollapsibleContextType | null>(
  null
);

export const InternalCollapsibleContext =
  createContext<InternalCollapsibleContextType | null>(null);

function useRequiredContext<T>(context: Context<T | null>) {
  const value = useContext(context);
  if (!value) {
    throw new Error('Component should be wrapped with withCollapsibleContext');
  }
  return value;
}

export function useCollapsibleContext() {
  return useRequiredContext(CollapsibleContext);
}

export function useInternalCollapsibleContext() {
  return useRequiredContext(InternalCollapsibleContext);
}
