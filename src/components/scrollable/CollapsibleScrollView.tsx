/* eslint-disable react-hooks/exhaustive-deps */
import AnimatedTopView from '../header/AnimatedTopView';
import useAnimatedScroll from './useAnimatedScroll';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RefreshControl, ScrollViewProps, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';

type Props = ScrollViewProps &
  CollapsibleProps & {
    children?: ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
  };

export default function CollapsibleScrollView({
  headerSnappable = true,
  children,
  refreshing = false,
  onRefresh,
  ...props
}: Props) {
  const { contentMinHeight, scrollViewRef, fixedHeaderHeight } =
    useInternalCollapsibleContext();
  const { headerHeight } = useCollapsibleContext();
  const [internalProgressViewOffset, setInternalProgressViewOffset] =
    useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ y: yValue, animated });
  }, []);

  const scrollToIndex = useCallback(() => {
    console.warn("CollapsibleScrollView doesn't support scrollToIndex");
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: contentMinHeight.value,
    };
  }, []);

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

  const contentContainerStyle = useMemo(
    () => [styles.contentContainer, props.contentContainerStyle],
    [props.contentContainerStyle]
  );

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            progressViewOffset={internalProgressViewOffset}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      {...props}
      style={[styles.container, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={1}
    >
      <Animated.View style={animatedStyle}>
        <AnimatedTopView height={headerHeight} />
        {children}
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
