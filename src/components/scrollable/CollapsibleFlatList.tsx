/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatListProps, View, StyleSheet, FlatList } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import useAnimatedScroll from './useAnimatedScroll';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../../types';
import CollapsibleHeaderConsumer from '../header/CollapsibleHeaderConsumer';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { contentMinHeight, scrollViewRef, fixedHeaderHeight } =
    useInternalCollapsibleContext();
  const mounted = useRef(true);
  const contentHeight = useRef(0);
  const [internalContentMinHeight, setInternalContentMinHeight] = useState(
    contentMinHeight.value
  );
  const [internalProgressViewOffset, setInternalProgressViewOffset] =
    useState(0);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollViewRef.current?.scrollToOffset({
      offset: yValue,
      animated,
    });
  }, []);

  const scrollToIndex = useCallback((params) => {
    scrollViewRef.current?.scrollToIndex(params);
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
    scrollToIndex,
  });

  const handleInternalContentHeight = useCallback((value: number) => {
    if (mounted.current) {
      setInternalContentMinHeight(value);
    }
  }, []);

  const handleInternalProgressViewOffset = useCallback((value: number) => {
    if (mounted.current) {
      setInternalProgressViewOffset(value);
    }
  }, []);

  useAnimatedReaction(
    () => {
      return contentMinHeight.value;
    },
    (result, previous) => {
      if (result !== previous) {
        if (
          contentHeight.current < result &&
          internalContentMinHeight !== result
        ) {
          runOnJS(handleInternalContentHeight)(result);
        }
      }
    }
  );

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

  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      { minHeight: internalContentMinHeight },
      props.contentContainerStyle,
    ],
    [props.contentContainerStyle, internalContentMinHeight]
  );

  const handleContentSizeChange = useCallback((_, height) => {
    contentHeight.current = height;
  }, []);

  const handleScrollToIndexFailed = useCallback(() => {}, []);

  function renderListHeader() {
    return (
      <View>
        <CollapsibleHeaderConsumer />
        {props.ListHeaderComponent}
      </View>
    );
  }

  return (
    <AnimatedFlatList
      ref={scrollViewRef}
      // bounces={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={1}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      {...props}
      style={[styles.container, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
      onContentSizeChange={handleContentSizeChange}
      //@ts-ignore
      simultaneousHandlers={[]}
      stickyHeaderIndices={[0]}
      progressViewOffset={internalProgressViewOffset}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
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
