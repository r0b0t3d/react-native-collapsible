import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import React, { useRef } from 'react';
import Animated, {
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';
import usePullToRefreshContext from './usePullToRefreshContext';
import { StyleSheet } from 'react-native';
import { rubberClamp } from './utils';

type Props = {
  children: React.ReactNode;
  scrollY: Animated.SharedValue<number>;
};

export default function PullToRefreshContainer({ children, scrollY }: Props) {
  const scrollRef = useRef();
  const panRef = useRef();
  const { refreshValue, internalRefreshing, internalHeight } =
    usePullToRefreshContext();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = internalRefreshing.value ? refreshValue.value : 0;
    },
    onActive: (event, ctx: any) => {
      if (scrollY.value <= 1) {
        const tranY = event.translationY + ctx.startY;
        const clampedValue = rubberClamp(tranY, 0, internalHeight.value);
        refreshValue.value = clampedValue;
        if (clampedValue > internalHeight.value) {
          internalRefreshing.value = true;
        }
      } else {
        refreshValue.value = 0;
      }
    },
    onEnd: () => {
      if (refreshValue.value > 0) {
        const value = internalRefreshing.value ? internalHeight.value : 0;
        refreshValue.value = withTiming(value);
      }
    },
  });

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={scrollRef}
      onGestureEvent={gestureHandler}
      shouldCancelWhenOutside={false}
      enableTrackpadTwoFingerGesture
      maxPointers={1}
    >
      <Animated.View style={StyleSheet.absoluteFill}>
        <NativeViewGestureHandler ref={scrollRef} simultaneousHandlers={panRef}>
          {children}
        </NativeViewGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}
