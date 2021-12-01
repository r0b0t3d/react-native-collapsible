/* eslint-disable react-hooks/exhaustive-deps */
import AnimatedTopView from '../header/AnimatedTopView';
import useAnimatedScroll from './useAnimatedScroll';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { ScrollViewProps, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';

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
  const { headerHeight } = useCollapsibleContext();

  const scrollTo = useCallback((yValue: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ y: yValue, animated });
  }, []);

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
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
      bounces={false}
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
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
