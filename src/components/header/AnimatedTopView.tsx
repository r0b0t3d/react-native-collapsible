import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

type Props = {
  height: Animated.SharedValue<number>;
};

export default function AnimatedTopView({ height }: Props) {
  const contentStyle = useAnimatedStyle(
    () => ({
      paddingTop: height.value,
    }),
    []
  );

  return <Animated.View style={contentStyle} />;
}
