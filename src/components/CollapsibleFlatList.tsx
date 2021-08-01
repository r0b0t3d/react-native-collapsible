import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatListProps, FlatList, View, StyleSheet } from 'react-native';
import Animated, { runOnJS, useDerivedValue } from 'react-native-reanimated';
import AnimatedTopView from './AnimatedTopView';
import useAnimatedScroll from '../hooks/useAnimatedScroll';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import type { CollapsibleProps } from '../types';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const scrollView = useRef<FlatList>(null);
  const { headerHeight, contentMinHeight } = useCollapsibleContext();
  const [internalContentMinHeight, setInternalContentMinHeight] = useState(
    contentMinHeight.value
  );

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollView.current?.scrollToOffset({
      offset: yValue,
      animated,
    });
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
  });

  useDerivedValue(() => {
    if (contentMinHeight.value !== internalContentMinHeight) {
      runOnJS(setInternalContentMinHeight)(contentMinHeight.value);
    }
  }, [internalContentMinHeight]);

  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      { minHeight: internalContentMinHeight },
      props.contentContainerStyle,
    ],
    [props.contentContainerStyle, internalContentMinHeight]
  );

  const renderListHeader = () => (
    <View>
      <AnimatedTopView height={headerHeight} />
      {props.ListHeaderComponent}
    </View>
  );

  return (
    // @ts-ignore
    <AnimatedFlatList
      ref={scrollView}
      bounces={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      style={styles.container}
      {...props}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
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
