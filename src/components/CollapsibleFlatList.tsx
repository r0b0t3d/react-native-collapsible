import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatListProps, View, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import AnimatedTopView from './AnimatedTopView';
import useAnimatedScroll from '../hooks/useAnimatedScroll';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import type { CollapsibleProps } from '../types';
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import usePullToRefreshContext from '../hooks/usePullToRefreshContext';
import { FlatList } from 'react-native-gesture-handler';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleFlatList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight } = useCollapsibleContext();
  const { contentMinHeight } = useInternalCollapsibleContext();
  const { scrollRef, panRef } = usePullToRefreshContext();
  const mounted = useRef(true);
  const contentHeight = useRef(0);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTo = useCallback(
    (yValue: number, animated = true) => {
      scrollRef.current?.scrollToOffset({
        offset: yValue,
        animated,
      });
    },
    [scrollRef]
  );

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
    // @ts-ignore
    <AnimatedFlatList
      ref={scrollRef}
      bounces={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      {...props}
      style={[styles.container, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
      onContentSizeChange={handleContentSizeChange}
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
