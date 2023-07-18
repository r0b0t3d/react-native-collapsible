import type React from 'react';
import type { LayoutRectangle, SectionListScrollParams } from 'react-native';
import type Animated from 'react-native-reanimated';

export type ScrollToIndexParams = {
  animated?: boolean | null;
  index: number;
  viewOffset?: number;
  viewPosition?: number;
};

export type CollapsibleHandles = {
  /**
   * Collapse the header by header height
   * @param animated
   * @returns
   */
  collapse: (animated?: boolean) => void;
  /**
   * Expand header
   * @returns
   */
  expand: () => void;
  scrollTo: (offset: number, animate?: boolean) => void;
  scrollToIndex: (params: ScrollToIndexParams) => void;
  scrollToLocation: (params: SectionListScrollParams) => void;
};

export type CollapsibleContextType = CollapsibleHandles & {
  scrollY: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  headerCollapsed: Animated.SharedValue<boolean>;
  /**
   * Scroll to specific view
   * @param ref View that you want to scroll to
   * @param animated
   * @returns
   */
  scrollToView: (ref: React.RefObject<any>, animated?: boolean) => void;
};

export type LayoutParams = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CollapsibleContextInternalType = {
  scrollViewRef: React.RefObject<any>;
  containerRef: React.RefObject<any>;
  contentMinHeight: Animated.SharedValue<number>;
  headerViewPositions: Animated.SharedValue<
    Record<string, { top: number; stickyHeight: number }>
  >;
  fixedHeaderHeight: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
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
