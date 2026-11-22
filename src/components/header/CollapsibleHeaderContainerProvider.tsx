import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
} from 'react-native';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {
  CollapsibleContextHeaderType,
  CollapsibleHeaderContext,
} from '../../hooks/useCollapsibleHeaderContext';
import useSharedValueRef from '../../utils/useSharedValueRef';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentKey: string;
};

export default function CollapsibleHeaderContainerProvider({
  children,
  containerStyle,
  contentKey,
}: Props) {
  const { headerLayouts, headerViewPositions } =
    useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const currentLayout = useSharedValue<LayoutRectangle | undefined>(undefined);
  const [stickyLayouts, setStickyLayouts] = useSharedValueRef<
    Record<string, LayoutRectangle | undefined>
  >({});

  useEffect(() => {
    return () => {
      const layouts = { ...headerLayouts.value };
      delete layouts[contentKey];
      headerLayouts.value = layouts;
    };
  }, [contentKey, headerLayouts]);

  const stickyHeight = useDerivedValue(
    () =>
      Object.values(stickyLayouts.value).reduce(
        (acc, value) => acc + (value?.height ?? 0),
        0
      ),
    []
  );

  useAnimatedReaction(
    () =>
      currentLayout.value
        ? {
            y: currentLayout.value.y,
            height: currentLayout.value.height,
            stickyHeight: stickyHeight.value,
          }
        : undefined,
    (layout, previous) => {
      if (
        layout &&
        (!previous ||
          layout.y !== previous.y ||
          layout.height !== previous.height ||
          layout.stickyHeight !== previous.stickyHeight)
      ) {
        headerLayouts.value = { ...headerLayouts.value, [contentKey]: layout };
      }
    },
    [contentKey]
  );

  const handleLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      currentLayout.value = layout;
    },
    [currentLayout]
  );

  const handleStickyViewLayout = useCallback(
    (stickyKey: string, layout?: LayoutRectangle) => {
      setStickyLayouts({
        [stickyKey]: layout,
      });
    },
    [setStickyLayouts]
  );

  const translateY = useDerivedValue(() => {
    const position = headerViewPositions.value[contentKey];
    if (!currentLayout.value || !position) {
      return 0;
    }
    const topPosition =
      currentLayout.value.height +
      currentLayout.value.y -
      position.top -
      position.stickyHeight;

    return interpolate(
      scrollY.value,
      [0, topPosition, 10000],
      [0, -topPosition, -topPosition],
      Extrapolate.CLAMP
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const animatedY = useDerivedValue(() => {
    const position = headerViewPositions.value[contentKey];
    if (!currentLayout.value || !position) {
      return 0;
    }
    const value = scrollY.value - currentLayout.value.y + position.top;
    const maxV = currentLayout.value.height - stickyHeight.value;

    return Math.max(0, Math.min(value, maxV));
  });

  const value: CollapsibleContextHeaderType = useMemo(
    () => ({
      handleStickyViewLayout,
      animatedY,
    }),
    [handleStickyViewLayout, animatedY]
  );

  return (
    <CollapsibleHeaderContext.Provider value={value}>
      <Animated.View
        key={contentKey}
        style={[styles.container, containerStyle, animatedStyle]}
        pointerEvents="box-none"
        onLayout={handleLayout}
      >
        {children}
      </Animated.View>
    </CollapsibleHeaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'white',
  },
});
