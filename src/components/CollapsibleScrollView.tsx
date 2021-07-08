/* eslint-disable react-hooks/exhaustive-deps */
import AnimatedTopView from './AnimatedTopView';
import useAnimatedScroll from '../hooks/useAnimatedScroll';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../types';
import { useCollapsibleContext } from '../hooks/useCollapsibleContext';

const { height: wHeight } = Dimensions.get('window');

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
  const { headerHeight } = useCollapsibleContext();
  const [internalContentMinHeight, setInternalContentMinHeight] =
    useState(wHeight);

  const scrollTo = useCallback(
    (yValue: number, animated = true) => {
      // @ts-ignore
      scrollView.current?.scrollTo({ y: yValue, animated });
    },
    [scrollView]
  );

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

  return (
    <Animated.ScrollView
      ref={scrollView}
      bounces={false}
      {...props}
      contentContainerStyle={[
        styles.contentContainer,
        props.contentContainerStyle,
      ]}
      onScroll={scrollHandler}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onLayout={handleLayout}
    >
      <View style={{ minHeight: internalContentMinHeight }}>
        <AnimatedTopView height={headerHeight} />
        {children}
      </View>
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
