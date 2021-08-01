import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import React, { ReactNode, useCallback, useMemo } from 'react';
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
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useCollapsibleContext from '../hooks/useCollapsibleContext';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const contentKey = useMemo(() => `collapsible-header-${key++}`, []);
  const {
    scrollY,
    headerHeight,
    persistHeaderHeight,
    contentMinHeight,
    headerCollapsed,
  } = useCollapsibleContext();
  const { containerHeight } = useInternalCollapsibleContext();
  const fixedHeaderContentHeight = useSharedValue(0);

  const handleHeaderLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      headerHeight.value = withTiming(height, {
        duration:
          fixedHeaderContentHeight.value === 0 || headerCollapsed.value
            ? 0
            : 200,
      });
      fixedHeaderContentHeight.value = height;
    },
    [headerHeight, fixedHeaderContentHeight, headerCollapsed]
  );

  useDerivedValue(() => {
    if (containerHeight.value === 0 || fixedHeaderContentHeight.value === 0) {
      return;
    }
    const newContentHeight =
      containerHeight.value +
      fixedHeaderContentHeight.value -
      persistHeaderHeight.value;
    contentMinHeight.value = newContentHeight;
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    if (fixedHeaderContentHeight.value === 0) {
      return {};
    }
    const headerTranslate = interpolate(
      scrollY.value,
      // FIXME: can improve by geting maxY value of header and persist views
      [-250, 0, 100000],
      [250, 0, -100000],
      Animated.Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: headerTranslate }],
      minHeight: headerHeight.value,
    };
  }, [persistHeaderHeight, headerHeight, fixedHeaderContentHeight]);

  return (
    <Animated.View
      style={[styles.topView, headerStyle]}
      pointerEvents="box-none"
    >
      <View
        key={contentKey}
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
