import React, { MutableRefObject, ReactNode, useEffect, useId } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { stickyTranslate } from '../container/geometry';
import { useHeaderContext } from './CollapsibleHeaderContainer';
import { removeEntry, setEntry } from './layoutRegistry';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  stickyRef?: MutableRefObject<any>;
};

export default function StickyView({ children, style, stickyRef }: Props) {
  const key = useId();
  const { stickyHeights, scrolled } = useHeaderContext();
  const top = useSharedValue<number | null>(null);

  useEffect(() => () => removeEntry(stickyHeights, key), [stickyHeights, key]);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    top.value = layout.y;
    setEntry(stickyHeights, key, layout.height);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          top.value === null ? 0 : stickyTranslate(scrolled.value, top.value),
      },
    ],
  }));

  return (
    <Animated.View
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
