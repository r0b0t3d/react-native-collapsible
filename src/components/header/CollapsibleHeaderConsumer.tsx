import React, { useCallback } from 'react';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import { LayoutChangeEvent, StyleSheet } from 'react-native';

export default function CollapsibleHeaderConsumer() {
  const { headers } = useCollapsibleHeaderContext();
  const { handleHeaderContainerLayout } = useInternalCollapsibleContext();
  const { scrollY, headerHeight } = useCollapsibleContext();

  const headerTranslate = useDerivedValue(
    () =>
      interpolate(
        scrollY.value,
        // FIXME: can improve by geting maxY value of header and sticky views
        [-1000, 0, 100000],
        [0, 0, -100000],
        Animated.Extrapolate.CLAMP
      ),
    []
  );

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslate.value }],
    };
  }, [headerHeight, headerTranslate]);

  const handleHeaderLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      handleHeaderContainerLayout(height);
    },
    [handleHeaderContainerLayout]
  );

  return (
    <Animated.View
      onLayout={handleHeaderLayout}
      style={[styles.container, headerStyle]}
      pointerEvents="box-none"
    >
      {headers.map((item) => item.children)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
});
