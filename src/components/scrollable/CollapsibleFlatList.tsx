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
import AnimatedTopView from '../header/AnimatedTopView';
import useAnimatedScroll from './useAnimatedScroll';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../../types';
import PullToRefreshContainer from '../pullToRefresh/PullToRefreshContainer';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight, scrollY } = useCollapsibleContext();
  const { contentMinHeight, scrollViewRef } = useInternalCollapsibleContext();
  const mounted = useRef(true);
  const contentHeight = useRef(0);

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

  const handleInternalContentHeight = useCallback((value: number) => {
    if (mounted.current) {
      setInternalContentMinHeight(value);
    }
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
  });

  const [internalContentMinHeight, setInternalContentMinHeight] = useState(
    contentMinHeight.value
  );

  useAnimatedReaction(
    () => {
      return contentMinHeight.value;
    },
    (result, previous) => {
      if (result !== previous) {
        if (
          contentHeight.current < contentMinHeight.value &&
          internalContentMinHeight !== contentMinHeight.value
        ) {
          runOnJS(handleInternalContentHeight)(contentMinHeight.value);
        }
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

  const renderListHeader = () => (
    <View>
      <AnimatedTopView height={headerHeight} />
      {props.ListHeaderComponent}
    </View>
  );

  return (
    <PullToRefreshContainer scrollY={scrollY}>
      {/* @ts-ignore */}
      <AnimatedFlatList
        ref={scrollViewRef}
        bounces={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={1}
        {...props}
        style={[styles.container, props.style]}
        contentContainerStyle={contentContainerStyle}
        onScroll={scrollHandler}
        ListHeaderComponent={renderListHeader()}
        onContentSizeChange={handleContentSizeChange}
      />
    </PullToRefreshContainer>
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
