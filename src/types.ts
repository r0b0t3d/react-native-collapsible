import type React from 'react';
import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';

export type ScrollToIndexParams = {
  animated?: boolean | null;
  index: number;
  viewOffset?: number;
  viewPosition?: number;
};

export type CollapsibleHandles = {
  collapse: (animated?: boolean) => void;
  expand: () => void;
  scrollTo: (offset: number, animate?: boolean) => void;
  scrollToIndex: (params: ScrollToIndexParams) => void;
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
  scrollViewRef: React.RefObject<any>;
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
  handleHeaderContainerLayout: (height: number) => void;
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
