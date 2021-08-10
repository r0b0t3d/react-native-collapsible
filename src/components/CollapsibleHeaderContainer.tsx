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
  const { scrollY, headerCollapsed } = useCollapsibleContext();
  const { handleHeaderContainerLayout, fixedHeaderHeight } =
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

  const headerTranslate = useDerivedValue(
    () =>
      interpolate(
        scrollY.value,
        // FIXME: can improve by geting maxY value of header and persist views
        [-250, 0, 100000],
        [250, 0, -100000],
        Animated.Extrapolate.CLAMP
      ),
    []
  );

  const headerStyle = useAnimatedStyle(() => {
    if (fixedHeaderHeight.value === 0) {
      return {};
    }
    return {
      transform: [{ translateY: headerTranslate.value }],
      minHeight: headerHeight.value,
    };
  }, [headerHeight, fixedHeaderHeight, headerTranslate]);

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key,
    };
  }, []);

  return (
    <Animated.View
      style={[styles.container, headerStyle, internalStyle]}
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
  container: {
    backgroundColor: 'white',
  },
});
