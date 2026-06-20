/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import useAnimatedScroll from '../components/scrollable/useAnimatedScroll';
import useInternalCollapsibleContext from '../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../types';
import AnimatedTopView from '../components/header/AnimatedTopView';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import { AnimatedFlashList, FlashListProps } from '@shopify/flash-list';
import type { ScrollToIndexParams } from '../types';

type Props<Data> = FlashListProps<Data> & CollapsibleProps;

export default function CollapsibleFlashList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight } = useCollapsibleContext();
  const { scrollViewRef, fixedHeaderHeight } = useInternalCollapsibleContext();
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
  }, []);

  const scrollToIndex = useCallback((params: ScrollToIndexParams) => {
    scrollViewRef.current?.scrollToIndex?.(params);
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

  return (
    <View style={[StyleSheet.absoluteFill, props.style]}>
      <AnimatedFlashList
        ref={scrollViewRef}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={1}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        {...props}
        // @ts-ignore
        onScroll={scrollHandler}
        ListHeaderComponent={renderListHeader()}
        //@ts-ignore
        simultaneousHandlers={[]}
        progressViewOffset={internalProgressViewOffset}
      />
    </View>
  );
}
