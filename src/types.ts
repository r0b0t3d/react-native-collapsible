import type { RefObject } from 'react';
import type { FlatList, SectionListScrollParams } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type ScrollToIndexParams = Parameters<FlatList['scrollToIndex']>[0];

export type CollapsibleHandles = {
  collapse: (animated?: boolean) => void;
  expand: () => void;
  scrollTo: (offset: number, animated?: boolean) => void;
  scrollToIndex: (params: ScrollToIndexParams) => void;
  scrollToLocation: (params: SectionListScrollParams) => void;
};

export type CollapsibleContextType = CollapsibleHandles & {
  scrollY: SharedValue<number>;
  headerHeight: SharedValue<number>;
  headerCollapsed: SharedValue<boolean>;
  scrollToView: (ref: RefObject<any>, animated?: boolean) => void;
};

export type CollapsibleProps = {
  headerSnappable?: boolean;
};
