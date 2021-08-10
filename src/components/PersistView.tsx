/* eslint-disable react-hooks/exhaustive-deps */
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
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
  const { containerRef, handlePersistViewLayout, persitsViewTop } =
    useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const layoutValues = useSharedValue({ top: 0, height: 0 });

  useEffect(() => {
    return () => handlePersistViewLayout(key, undefined);
  }, []);

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

  const animatedStyle = useAnimatedStyle(() => {
    const top = persitsViewTop.value[key] || 0;
    const inputMid = layoutValues.value.top - top;
    const translateY = interpolate(
      scrollY.value,
      [0, inputMid, inputMid + 100000],
      [0, 0, 100000],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  }, [persitsViewTop, layoutValues, scrollY]);

  return (
    <Animated.View
      key={key}
      // @ts-ignore
      ref={viewRef}
      onLayout={handleLayout}
      style={[styles.container, animatedStyle, style]}
      pointerEvents="box-none"
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
