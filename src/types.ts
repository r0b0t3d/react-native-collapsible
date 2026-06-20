import type React from 'react';
import type { LayoutRectangle, SectionListScrollParams } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

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
  scrollY: SharedValue<number>;
  headerHeight: SharedValue<number>;
  headerCollapsed: SharedValue<boolean>;
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
  containerHeight: SharedValue<number>;
  contentMinHeight: SharedValue<number>;
  headerViewPositions: SharedValue<
    Record<string, { top: number; stickyHeight: number }>
  >;
  fixedHeaderHeight: SharedValue<number>;
  headerHeight: SharedValue<number>;
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
  refreshValue: SharedValue<number>;
  internalRefreshing: SharedValue<boolean>;
  internalHeight: SharedValue<number>;
};
