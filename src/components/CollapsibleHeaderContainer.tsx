import React, { ReactNode, useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCollapsibleContext } from '../hooks/useCollapsibleContext';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const [contentKey] = useState(key++);
  const { scrollY, headerHeight, persistHeaderHeight } =
    useCollapsibleContext();
  const headerContentReady = useSharedValue(false);

  const handleHeaderLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      headerHeight.value = withTiming(height, {
        duration: !headerContentReady.value ? 0 : 200,
      });
      headerContentReady.value = true;
    },
    [headerHeight, headerContentReady]
  );

  const headerStyle = useAnimatedStyle(() => {
    if (!headerContentReady.value) {
      return {};
    }
    const headerTranslate = interpolate(
      scrollY.value,
      [0, headerHeight.value - persistHeaderHeight.value],
      [0, -headerHeight.value + persistHeaderHeight.value],
      Animated.Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: headerTranslate }],
      minHeight: headerHeight.value,
    };
  }, [persistHeaderHeight, headerHeight, headerContentReady]);

  return (
    <Animated.View
      style={[styles.topView, headerStyle]}
      pointerEvents="box-none"
    >
      <View
        key={`collapsible-flatlist-${contentKey}`}
        onLayout={handleHeaderLayout}
        pointerEvents="box-none"
        style={containerStyle}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
