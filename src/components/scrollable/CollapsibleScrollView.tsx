/* eslint-disable react-hooks/exhaustive-deps */
import useAnimatedScroll from './useAnimatedScroll';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { ScrollViewProps, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import CollapsibleHeaderConsumer from '../header/CollapsibleHeaderConsumer';

type Props = ScrollViewProps &
  CollapsibleProps & {
    children?: ReactNode;
  };

export default function CollapsibleScrollView({
  headerSnappable = true,
  children,
  ...props
}: Props) {
  const { contentMinHeight, scrollViewRef } = useInternalCollapsibleContext();

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ y: yValue, animated });
  }, []);

  const scrollToIndex = useCallback(() => {
    console.warn("CollapsibleScrollView doesn't support scrollToIndex");
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
    scrollToIndex,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: contentMinHeight.value,
    };
  }, []);

  const contentContainerStyle = useMemo(
    () => [styles.contentContainer, props.contentContainerStyle],
    [props.contentContainerStyle]
  );

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      {...props}
      style={[styles.container, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={1}
      stickyHeaderIndices={[0]}
    >
      <CollapsibleHeaderConsumer />
      <Animated.View style={animatedStyle}>{children}</Animated.View>
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
