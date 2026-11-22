import { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListScrollParams,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {
  cancelAnimation,
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
  snapToOffsets?: number[];
  onContentSizeChange?: (width: number, height: number) => void;
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
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
  const {
    registerScrollable,
    collapsibleDistance,
    contentMinHeight,
    containerHeight,
    scrollableRef,
    scrollableContentHeight,
    dragScrollY,
    snapOffsets,
  } = useInternalCollapsibleContext();
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
      scrollableRef(instance);
      assignRef(userRef, instance);
    },
    [userRef, scrollableRef]
  );

  const restore = useRef({ target: 0, contentHeight: 0 });

  const scrollToOffset = useCallback(
    (offset: number, animated = true) => {
      if (adapter.scrollTo) {
        adapter.scrollTo(node.current, offset, animated);
      } else {
        console.warn(`${adapter.name} does not support scrollTo`);
      }
    },
    [adapter]
  );

  const applyRestore = useCallback(() => {
    const { target, contentHeight } = restore.current;
    if (target <= 0 || contentHeight === 0) {
      return;
    }
    const maxOffset = Math.max(0, contentHeight - containerHeight.value);
    scrollToOffset(Math.min(target, maxOffset), false);
    if (maxOffset >= target) {
      restore.current.target = 0;
    }
  }, [containerHeight, scrollToOffset]);

  useEffect(() => {
    const unsupported = (method: string) => () =>
      console.warn(`${adapter.name} does not support ${method}`);
    const { scrollToIndex, scrollToLocation } = adapter;

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
    restore.current.target = scrollY.value;
    applyRestore();
    return unregister;
  }, [
    adapter,
    registerScrollable,
    collapsibleDistance,
    scrollY,
    scrollToOffset,
    applyRestore,
  ]);

  const { onContentSizeChange, onScrollBeginDrag } = props;

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      onContentSizeChange?.(width, height);
      restore.current.contentHeight = height;
      scrollableContentHeight.value = height;
      applyRestore();
    },
    [onContentSizeChange, scrollableContentHeight, applyRestore]
  );

  const handleScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollBeginDrag?.(event);
      restore.current.target = 0;
      cancelAnimation(dragScrollY);
    },
    [onScrollBeginDrag, dragScrollY]
  );

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

  const effectiveSnapOffsets = props.snapToOffsets ?? snapToOffsets;

  useEffect(() => {
    snapOffsets.value = effectiveSnapOffsets;
  }, [snapOffsets, effectiveSnapOffsets]);

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
    onContentSizeChange: handleContentSizeChange,
    onScrollBeginDrag: handleScrollBeginDrag,
    progressViewOffset: layout.progressViewOffset,
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
