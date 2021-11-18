/* eslint-disable react-hooks/exhaustive-deps */
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  LayoutChangeEvent,
  Platform,
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
  const { scrollY } = useCollapsibleContext();
  const { handleHeaderContainerLayout } = useInternalCollapsibleContext();
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
    [contentKey, handleHeaderContainerLayout]
  );

  const headerTranslate = useDerivedValue(
    () =>
      interpolate(
        scrollY.value,
        // FIXME: can improve by geting maxY value of header and sticky views
        [-250, 0, 100000],
        [250, 0, -100000],
        Animated.Extrapolate.CLAMP
      ),
    []
  );

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslate.value }],
      minHeight: headerHeight.value,
    };
  }, [headerHeight, headerTranslate]);

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key,
    };
  }, []);

  return (
    <Animated.View
      style={[headerStyle, internalStyle]}
      pointerEvents="box-none"
    >
      <View
        key={contentKey}
        onLayout={handleHeaderLayout}
        pointerEvents="box-none"
        style={[styles.container, containerStyle]}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
});
