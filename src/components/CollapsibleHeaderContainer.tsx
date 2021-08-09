/* eslint-disable react-hooks/exhaustive-deps */
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
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
  const { scrollY, persistHeaderHeight, contentMinHeight, headerCollapsed } =
    useCollapsibleContext();
  const { containerHeight, handleHeaderContainerLayout, fixedHeaderHeight } =
    useInternalCollapsibleContext();
  const headerHeight = useSharedValue(0);

  useEffect(() => {
    return () => handleHeaderContainerLayout(contentKey, undefined);
  }, []);

  const handleHeaderLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      headerHeight.value = withTiming(height, {
        duration: 200,
      });
      handleHeaderContainerLayout(contentKey, height);
    },
    [contentKey, handleHeaderContainerLayout, headerCollapsed]
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
      style={[styles.topView, headerStyle, { zIndex: 100000 - key }]}
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
  topView: {},
});
