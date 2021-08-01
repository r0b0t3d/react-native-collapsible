import type React from 'react';
import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';

export type CollapsibleHandles = {
  collapse: () => void;
  expand: () => void;
  scrollTo: (offset: number, animate?: boolean) => void;
};

export type CollapsibleContextType = CollapsibleHandles & {
  scrollY: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  headerCollapsed: Animated.SharedValue<boolean>;
  persistHeaderHeight: Animated.SharedValue<number>;
  contentMinHeight: Animated.SharedValue<number>;
};

export type LayoutParams = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CollapsibleContextInternalType = {
  containerHeight: Animated.SharedValue<number>;
  containerRef: React.RefObject<View>;
  firstPersistViewY: Animated.SharedValue<number>;
  handlePersistViewLayout: (viewKey: string, layout: LayoutParams) => void;
  setCollapsibleHandlers: (handlers: CollapsibleHandles) => void;
};

export type CollapsibleProps = {
  headerSnappable?: boolean;
};
