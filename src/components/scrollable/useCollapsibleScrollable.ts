import { useEffect, useMemo, useState } from 'react';
import type { SectionListScrollParams } from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import type { ScrollToIndexParams } from '../../types';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';

export type ScrollableMethods = {
  scrollTo: (scrollable: any, offset: number, animated?: boolean) => void;
  scrollToIndex: (scrollable: any, params: ScrollToIndexParams) => void;
  scrollToLocation: (scrollable: any, params: SectionListScrollParams) => void;
};

type ScrollableLayout = {
  progressViewOffset: number;
  contentMinHeight: number;
  collapsibleDistance: number;
};

export function unsupported(component: string, method: string) {
  return () => console.warn(`${component} does not support ${method}`);
}

export default function useCollapsibleScrollable(
  methods: ScrollableMethods,
  headerSnappable: boolean
) {
  const { scrollY } = useCollapsibleContext();
  const {
    scrollViewRef,
    setCollapsibleHandlers,
    fixedHeaderHeight,
    collapsibleDistance,
    contentMinHeight,
  } = useInternalCollapsibleContext();
  const [layout, setLayout] = useState<ScrollableLayout>({
    progressViewOffset: 0,
    contentMinHeight: 0,
    collapsibleDistance: 0,
  });

  useAnimatedReaction(
    () => ({
      progressViewOffset: fixedHeaderHeight.value,
      contentMinHeight: contentMinHeight.value,
      collapsibleDistance: collapsibleDistance.value,
    }),
    (result, previous) => {
      if (
        !previous ||
        result.progressViewOffset !== previous.progressViewOffset ||
        result.contentMinHeight !== previous.contentMinHeight ||
        result.collapsibleDistance !== previous.collapsibleDistance
      ) {
        runOnJS(setLayout)(result);
      }
    }
  );

  useEffect(() => {
    const scrollTo = (offset: number, animated?: boolean) =>
      methods.scrollTo(scrollViewRef.current, offset, animated);
    setCollapsibleHandlers({
      collapse: (animated = true) =>
        scrollTo(collapsibleDistance.value, animated),
      expand: () => scrollTo(0),
      scrollTo,
      scrollToIndex: (params) =>
        methods.scrollToIndex(scrollViewRef.current, params),
      scrollToLocation: (params) =>
        methods.scrollToLocation(scrollViewRef.current, params),
    });
    if (scrollY.value > 0) {
      requestAnimationFrame(() => scrollTo(scrollY.value, false));
    }
  }, [
    methods,
    scrollViewRef,
    setCollapsibleHandlers,
    collapsibleDistance,
    scrollY,
  ]);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      scrollY.value = event.contentOffset.y;
    },
    [scrollY]
  );

  const snapToOffsets = useMemo(
    () =>
      headerSnappable && layout.collapsibleDistance > 0
        ? [0, layout.collapsibleDistance]
        : undefined,
    [headerSnappable, layout.collapsibleDistance]
  );

  return {
    scrollableProps: {
      ref: scrollViewRef,
      keyboardDismissMode: 'on-drag' as const,
      keyboardShouldPersistTaps: 'handled' as const,
      scrollEventThrottle: 1,
      snapToOffsets,
      snapToEnd: false,
    },
    scrollHandler,
    progressViewOffset: layout.progressViewOffset,
    contentMinHeight:
      layout.contentMinHeight > 0 ? layout.contentMinHeight : undefined,
  };
}
