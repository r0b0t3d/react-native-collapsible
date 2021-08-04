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
  const { containerHeight, handleHeaderContainerLayout, fixedHeaderHeight } =
    useInternalCollapsibleContext();

  const handleHeaderLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      headerHeight.value = withTiming(height, {
        duration:
          fixedHeaderHeight.value === 0 || headerCollapsed.value ? 0 : 200,
      });
      handleHeaderContainerLayout(height);
    },
    [
      headerHeight,
      fixedHeaderHeight,
      headerCollapsed,
      handleHeaderContainerLayout,
    ]
  );

  useDerivedValue(() => {
    if (containerHeight.value === 0 || fixedHeaderHeight.value === 0) {
      return;
    }
    const newContentHeight =
      containerHeight.value +
      fixedHeaderHeight.value -
      persistHeaderHeight.value;
    contentMinHeight.value = newContentHeight;
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    if (fixedHeaderHeight.value === 0) {
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
  }, [headerHeight, fixedHeaderHeight]);

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
