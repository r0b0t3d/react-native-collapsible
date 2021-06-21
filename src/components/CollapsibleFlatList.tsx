/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef } from 'react';
import {
  FlatListProps,
  FlatList,
  View,
  Dimensions,
  StyleSheet,
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
  contentMinHeight = wHeight,
  ...props
}: Props<Data>) {
  const scrollView = useRef<FlatList>();
  const { headerHeight } = useCollapsibleContext();

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
    <AnimatedFlatList
      // @ts-ignore
      ref={scrollView}
      bounces={false}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: contentMinHeight },
      ]}
      onScroll={scrollHandler}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      {...props}
      ListHeaderComponent={renderListHeader()}
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
