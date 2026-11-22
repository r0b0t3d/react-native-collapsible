import { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SectionListScrollParams,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import type { CollapsibleProps, ScrollToIndexParams } from '../types';
import {
  useCollapsibleContext,
  useInternalCollapsibleContext,
} from '../container/context';

export type ScrollableAdapter = {
  name: string;
  scrollTo?: (node: any, offset: number, animated: boolean) => void;
  scrollToIndex?: (node: any, params: ScrollToIndexParams) => void;
  scrollToLocation?: (node: any, params: SectionListScrollParams) => void;
};

type ScrollableProps = CollapsibleProps & {
  ref?: Ref<any>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type ScrollableLayout = {
  progressViewOffset: number;
  contentMinHeight: number;
  collapsibleDistance: number;
};

function assignRef(ref: Ref<any> | undefined, instance: any) {
  if (typeof ref === 'function') {
    ref(instance);
  } else if (ref) {
    ref.current = instance;
  }
}

export default function useCollapsibleScrollable<P extends ScrollableProps>(
  adapter: ScrollableAdapter,
  { headerSnappable = true, ref: userRef, ...props }: P
) {
  const { scrollY, headerHeight } = useCollapsibleContext();
  const { registerScrollable, collapsibleDistance, contentMinHeight } =
    useInternalCollapsibleContext();
  const node = useRef<any>(null);
  const [layout, setLayout] = useState<ScrollableLayout>({
    progressViewOffset: 0,
    contentMinHeight: 0,
    collapsibleDistance: 0,
  });

  useAnimatedReaction(
    () => ({
      progressViewOffset: headerHeight.value,
      contentMinHeight: contentMinHeight.value,
      collapsibleDistance: collapsibleDistance.value,
    }),
    (next, previous) => {
      if (
        !previous ||
        next.progressViewOffset !== previous.progressViewOffset ||
        next.contentMinHeight !== previous.contentMinHeight ||
        next.collapsibleDistance !== previous.collapsibleDistance
      ) {
        runOnJS(setLayout)(next);
      }
    }
  );

  const ref = useCallback(
    (instance: any) => {
      node.current = instance;
      assignRef(userRef, instance);
    },
    [userRef]
  );

  useEffect(() => {
    const unsupported = (method: string) => () =>
      console.warn(`${adapter.name} does not support ${method}`);
    const { scrollTo, scrollToIndex, scrollToLocation } = adapter;
    const scrollToOffset = scrollTo
      ? (offset: number, animated = true) =>
          scrollTo(node.current, offset, animated)
      : unsupported('scrollTo');

    const unregister = registerScrollable({
      collapse: (animated = true) =>
        scrollToOffset(collapsibleDistance.value, animated),
      expand: () => scrollToOffset(0),
      scrollTo: scrollToOffset,
      scrollToIndex: scrollToIndex
        ? (params) => scrollToIndex(node.current, params)
        : unsupported('scrollToIndex'),
      scrollToLocation: scrollToLocation
        ? (params) => scrollToLocation(node.current, params)
        : unsupported('scrollToLocation'),
    });
    if (scrollY.value > 0) {
      requestAnimationFrame(() => scrollToOffset(scrollY.value, false));
    }
    return unregister;
  }, [adapter, registerScrollable, collapsibleDistance, scrollY]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const snapToOffsets = useMemo(
    () =>
      headerSnappable && layout.collapsibleDistance > 0
        ? [0, layout.collapsibleDistance]
        : undefined,
    [headerSnappable, layout.collapsibleDistance]
  );

  return {
    keyboardDismissMode: 'on-drag' as const,
    keyboardShouldPersistTaps: 'handled' as const,
    scrollEventThrottle: 1,
    snapToOffsets,
    snapToEnd: false,
    ...props,
    ref,
    style: [StyleSheet.absoluteFill, props.style],
    contentContainerStyle: [
      styles.contentContainer,
      {
        minHeight:
          layout.contentMinHeight > 0 ? layout.contentMinHeight : undefined,
      },
      props.contentContainerStyle,
    ],
    onScroll,
    progressViewOffset: layout.progressViewOffset,
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
