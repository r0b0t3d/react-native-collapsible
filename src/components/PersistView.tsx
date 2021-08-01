/* eslint-disable react-hooks/exhaustive-deps */
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: Element;
};

let persistKey = 0;

export default function PersistView({ children, style }: Props) {
  const key = useMemo(() => `persist_${persistKey++}`, []);
  const viewRef = useRef<View>(null);
  const { containerRef, handlePersistViewLayout } =
    useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const layoutValues = useSharedValue({ top: 0, height: 0 });

  const handleLayout = useCallback(() => {
    if (viewRef.current && containerRef.current) {
      viewRef.current.measureLayout(
        // @ts-ignore
        containerRef.current,
        (left, top, width, height) => {
          handlePersistViewLayout(key, { left, top, width, height });
          layoutValues.value = { top, height };
        },
        () => {}
      );
    }
  }, [handlePersistViewLayout]);

  const translateY = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, layoutValues.value.top, layoutValues.value.top + 100000],
      [0, 0, 100000],
      Extrapolate.CLAMP
    )
  );

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
      style={[styles.container, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
});
