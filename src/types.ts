import type React from 'react';
import type { LayoutRectangle } from 'react-native';
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
  contentMinHeight: Animated.SharedValue<number>;
  headerViewPositions: Animated.SharedValue<
    Record<string, { top: number; stickyHeight: number }>
  >;
  fixedHeaderHeight: Animated.SharedValue<number>;
  handleContainerHeight: (height: number) => void;
  handleHeaderContainerLayout: (
    key: string,
    layout?: LayoutRectangle,
    stickyHeight?: number
  ) => void;
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
