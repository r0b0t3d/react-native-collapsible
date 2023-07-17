import { createContext, useContext } from 'react';
import { LayoutRectangle } from 'react-native';
import Animated from 'react-native-reanimated';

export type CollapsibleContextHeaderType = {
  handleStickyViewLayout: (key: string, layout?: LayoutRectangle) => void;
  animatedY: Animated.SharedValue<number>;
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
