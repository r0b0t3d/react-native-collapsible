import AnimatedTopView from './AnimatedTopView';
import useAnimatedScroll from '../hooks/useAnimatedScroll';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { ScrollViewProps, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { CollapsibleProps } from '../types';
import { useCollapsibleContext } from '../hooks/useCollapsibleContext';

type Props = ScrollViewProps &
  CollapsibleProps & {
    children?: ReactNode;
  };

export default function CollapsibleScrollView({
  persistHeaderHeight = 0,
  headerSnappable = true,
  children,
  ...props
}: Props) {
  const scrollView = useRef<Animated.ScrollView>(null);
  const { headerHeight, contentMinHeight } = useCollapsibleContext();

  const scrollTo = useCallback((yValue: number, animated = true) => {
    // @ts-ignore
    scrollView.current?.scrollTo({ y: yValue, animated });
  }, []);

  const { scrollHandler, handleContainerLayout } = useAnimatedScroll({
    persistHeaderHeight,
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
      ref={scrollView}
      bounces={false}
      {...props}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onLayout={handleContainerLayout}
    >
      <Animated.View style={animatedStyle}>
        <AnimatedTopView height={headerHeight} />
        {children}
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
