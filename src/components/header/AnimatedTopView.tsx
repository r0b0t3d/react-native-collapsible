import React from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  height: SharedValue<number>;
};

export default function AnimatedTopView({ height }: Props) {
  const contentStyle = useAnimatedStyle(
    () => ({
      height: height.value,
    }),
    []
  );

  return <Animated.View style={contentStyle} />;
}
