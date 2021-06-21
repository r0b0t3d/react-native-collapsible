import type Animated from 'react-native-reanimated';

export type CollapsibleHandles = {
  collapse: () => void;
  expand: () => void;
};

export type CollapsibleContextType = CollapsibleHandles & {
  scrollY: Animated.SharedValue<number>;
  headerHeight: Animated.SharedValue<number>;
  headerCollapsed: Animated.SharedValue<boolean>;
  persistHeaderHeight: Animated.SharedValue<number>;
};

export type CollapsibleContextInternalType = {
  setCollapsibleHandlers: (handlers: CollapsibleHandles) => void;
};

export type CollapsibleProps = {
  persistHeaderHeight?: number;
  contentMinHeight?: number;
  headerSnappable?: boolean;
};
