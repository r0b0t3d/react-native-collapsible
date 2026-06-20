/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatListProps } from 'react-native';
import {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import useAnimatedScroll from '../components/scrollable/useAnimatedScroll';
import useInternalCollapsibleContext from '../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../types';
import AnimatedTopView from '../components/header/AnimatedTopView';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import type { ScrollToIndexParams } from '../types';

type Props<Data> = FlatListProps<Data> & CollapsibleProps;

export default function CollapsibleLegendList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight } = useCollapsibleContext();
  const { scrollViewRef, fixedHeaderHeight } = useInternalCollapsibleContext();
  const mounted = useRef(true);
  const internalProgressViewOffset = useSharedValue(0);

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
  }, []);

  const scrollToIndex = useCallback((params: ScrollToIndexParams) => {
    scrollViewRef.current?.scrollToIndex?.(params);
  }, []);

  const scrollToLocation = useCallback(() => {
    console.warn('CollapsibleLegendList does not support scrollToLocation');
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
    scrollToIndex,
    scrollToLocation,
  });

  const handleInternalProgressViewOffset = useCallback((value: number) => {
    if (mounted.current) {
      internalProgressViewOffset.value = value;
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

  const handleScrollToIndexFailed = useCallback(() => {}, []);

  const ListHeaderComponent = props.ListHeaderComponent;
  function renderListHeader() {
    return (
      <View>
        <AnimatedTopView height={headerHeight} />
        {ListHeaderComponent &&
          (typeof ListHeaderComponent === 'function'
            ? React.createElement(ListHeaderComponent)
            : ListHeaderComponent)}
      </View>
    );
  }

  const animatedProps = useAnimatedProps(() => {
    return {
      progressViewOffset: internalProgressViewOffset.value,
    };
  });

  return (
    <View style={[StyleSheet.absoluteFill, props.style]}>
      {/* @ts-ignore */}
      <AnimatedLegendList
        ref={scrollViewRef}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={1}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        {...props}
        onScroll={scrollHandler}
        ListHeaderComponent={renderListHeader()}
        //@ts-ignore
        simultaneousHandlers={[]}
        // @ts-ignore
        animatedProps={animatedProps}
      />
    </View>
  );
}
