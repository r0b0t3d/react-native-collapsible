/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: Element;
};

let stickyKey = 0;

export default function StickyView({ children, style }: Props) {
  const key = useMemo(() => `sticky_${stickyKey++}`, []);
  const viewRef = useRef<View>(null);
  const { handleStickyViewLayout, stickyViewTops, stickyViewPositions } =
    useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();

  useEffect(() => {
    return () => handleStickyViewLayout(key, undefined);
  }, []);

  const handleLayout = useCallback(() => {
    handleStickyViewLayout(key, viewRef);
  }, [key]);

  const translateY = useDerivedValue(() => {
    const top = stickyViewTops.value[key] || 0;
    const layoutValues = stickyViewPositions.value[key] || { top: 0 };
    const inputMid = layoutValues.top - top;
    return interpolate(
      scrollY.value,
      [0, inputMid, inputMid + 100000],
      [0, 0, 100000],
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
    zIndex: 10,
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
});
