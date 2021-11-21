import type { RefObject } from 'react';
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
};

export type LayoutParams = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CollapsibleContextInternalType = {
  containerRef: React.RefObject<View>;
  contentMinHeight: Animated.SharedValue<number>;
  firstStickyViewY: Animated.SharedValue<number>;
  stickyViewPositions: Animated.SharedValue<Record<string, LayoutParams>>;
  stickyViewTops: Animated.SharedValue<Record<string, number>>;
  fixedHeaderHeight: Animated.SharedValue<number>;
  handleContainerHeight: (height: number) => void;
  handleStickyViewLayout: (
    viewKey: string,
    viewRef?: React.RefObject<View>
  ) => void;
  handleHeaderContainerLayout: (viewKey: string, height?: number) => void;
  setCollapsibleHandlers: (handlers: CollapsibleHandles) => void;
};

export type CollapsibleProps = {
  headerSnappable?: boolean;
};

export type PullToRefreshContextType = {
  refreshValue: Animated.SharedValue<number>;
  internalRefreshing: Animated.SharedValue<boolean>;
  internalHeight: Animated.SharedValue<number>;
};
