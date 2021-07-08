/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef, useState } from 'react';
import {
  FlatListProps,
  FlatList,
  View,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import AnimatedTopView from './AnimatedTopView';
import useAnimatedScroll from '../hooks/useAnimatedScroll';
import { useCollapsibleContext } from '../hooks/useCollapsibleContext';
import type { CollapsibleProps } from '../types';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height: wHeight } = Dimensions.get('window');

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  persistHeaderHeight = 0,
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const scrollView = useRef<FlatList>(null);
  const { headerHeight } = useCollapsibleContext();
  const [internalContentMinHeight, setInternalContentMinHeight] =
    useState(wHeight);

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollView.current?.scrollToOffset({
      offset: yValue,
      animated,
    });
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    persistHeaderHeight,
    headerSnappable,
    scrollTo,
  });

  const handleLayout = useCallback((layout: LayoutChangeEvent) => {
    const height = layout.nativeEvent.layout.height;
    setInternalContentMinHeight(
      height + headerHeight.value - persistHeaderHeight
    );
  }, []);

  const renderListHeader = useCallback(
    () => (
      <View>
        <AnimatedTopView height={headerHeight} />
        {props.ListHeaderComponent}
      </View>
    ),
    [props.ListHeaderComponent]
  );

  return (
    // @ts-ignore
    <AnimatedFlatList
      ref={scrollView}
      bounces={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      {...props}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: internalContentMinHeight },
        props.contentContainerStyle,
      ]}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
      onLayout={handleLayout}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    overflow: 'hidden',
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
