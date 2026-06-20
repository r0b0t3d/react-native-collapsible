import React, { useEffect, useId } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  stickyRef?: React.MutableRefObject<any>;
};

export default function StickyView({ children, style, stickyRef }: Props) {
  const key = `sticky_${useId()}`;
  const { handleStickyViewLayout, animatedY } = useCollapsibleHeaderContext();
  const currentLayout = useSharedValue<LayoutRectangle | undefined>(undefined);

  useEffect(() => {
    return () => handleStickyViewLayout(key, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    currentLayout.set(layout);
    handleStickyViewLayout(key, layout);
  };

  const translateY = useDerivedValue(() => {
    if (!currentLayout.value) {
      return 0;
    }
    const { height: stickyHeight, y: top } = currentLayout.value;
    const topValue = top;

    return interpolate(
      animatedY.value,
      [0, topValue, topValue + stickyHeight + 100000],
      [0, 0, stickyHeight + 100000],
      'clamp'
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
      ref={stickyRef}
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
