import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatListProps, StyleSheet } from 'react-native';
import type { ScrollToIndexParams } from '../../types';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useAnimatedScroll from './useAnimatedScroll';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../../types';
import AnimatedTopView from '../header/AnimatedTopView';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight } = useCollapsibleContext();
  const { contentMinHeight, scrollViewRef, fixedHeaderHeight } =
    useInternalCollapsibleContext();
  const mounted = useRef(true);
  const [internalProgressViewOffset, setInternalProgressViewOffset] =
    useState(0);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollViewRef.current?.scrollToOffset?.({
      offset: yValue,
      animated,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = useCallback((params: ScrollToIndexParams) => {
    scrollViewRef.current?.scrollToIndex?.(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToLocation = useCallback(() => {
    console.warn('CollapsibleFlatList does not support scrollToLocation');
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
    scrollToIndex,
    scrollToLocation,
  });

  const handleInternalProgressViewOffset = useCallback((value: number) => {
    if (mounted.current) {
      setInternalProgressViewOffset(value);
    }
  }, []);

  useAnimatedReaction(
    () => {
      return fixedHeaderHeight.value;
    },
    (result, previous) => {
      if (result !== previous) {
        runOnJS(handleInternalProgressViewOffset)(result);
      }
    }
  );

  // Animate minHeight on the UI thread instead of bouncing through React state.
  // Skip applying minHeight when the value is 0 to avoid forcing a 0-height
  // layout on the first frame before the container has been measured.
  const listHeaderStyle = useAnimatedStyle(
    () => ({
      minHeight:
        contentMinHeight.value > 0 ? contentMinHeight.value : undefined,
    }),
    []
  );

  const contentContainerStyle = useMemo(
    () => [styles.contentContainer, props.contentContainerStyle],
    [props.contentContainerStyle]
  );

  const handleScrollToIndexFailed = useCallback(() => {}, []);

  const ListHeaderComponent = props.ListHeaderComponent;
  function renderListHeader() {
    return (
      <Animated.View style={listHeaderStyle}>
        <AnimatedTopView height={headerHeight} />
        {ListHeaderComponent &&
          (React.isValidElement(ListHeaderComponent)
            ? ListHeaderComponent
            : React.createElement(ListHeaderComponent as React.ComponentType))}
      </Animated.View>
    );
  }

  return (
    <Animated.FlatList
      ref={scrollViewRef}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={1}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      {...props}
      style={[StyleSheet.absoluteFill, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
      //@ts-ignore
      simultaneousHandlers={[]}
      progressViewOffset={internalProgressViewOffset}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
