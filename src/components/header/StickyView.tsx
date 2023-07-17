/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: Element;
};

let stickyKey = 0;

export default function StickyView({ children, style }: Props) {
  const key = useMemo(() => `sticky_${stickyKey++}`, []);
  const viewRef = useRef<View>(null);
  const { handleStickyViewLayout, animatedY } = useCollapsibleHeaderContext();
  const currentLayout = useSharedValue<LayoutRectangle | undefined>(undefined);

  useEffect(() => {
    return () => handleStickyViewLayout(key, undefined);
  }, [key]);

  const handleLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      currentLayout.value = layout;
      handleStickyViewLayout(key, layout);
    },
    [key, handleStickyViewLayout]
  );

  const translateY = useDerivedValue(() => {
    if (!currentLayout.value) {
      return 0;
    }
    const { height: stickyHeight, y: top } = currentLayout.value;
    const topValue = top;

    return interpolate(
      animatedY.value,
      [0, topValue, topValue + stickyHeight + 100],
      [0, 0, stickyHeight + 100],
      Extrapolate.CLAMP
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      key={key}
      // @ts-ignore
      ref={viewRef}
      onLayout={handleLayout}
      style={[styles.container, style, animatedStyle]}
      pointerEvents="box-none"
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    zIndex: 10,
  },
});
