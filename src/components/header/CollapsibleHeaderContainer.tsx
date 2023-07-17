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
  runOnJS,
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
};

let key = 0;

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const contentKey = useMemo(() => `collapsible-header-${key++}`, []);
  const { handleHeaderContainerLayout, headerViewPositions } =
    useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const currentLayout = useSharedValue<LayoutRectangle | undefined>(undefined);
  const [stickyLayouts, setStickyLayouts] = useSharedValueRef<
    Record<string, LayoutRectangle | undefined>
  >({});

  useEffect(() => {
    return () => {
      handleHeaderContainerLayout(contentKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  const stickyHeight = useDerivedValue(
    () =>
      Object.values(stickyLayouts.value).reduce(
        (acc, value) => acc + (value?.height ?? 0),
        0
      ),
    []
  );

  useAnimatedReaction(
    () => {
      if (!currentLayout.value) {
        return -1;
      }
      return currentLayout.value.height - stickyHeight.value;
    },
    (result, previous) => {
      if (result !== -1 && result !== previous) {
        runOnJS(handleHeaderContainerLayout)(
          contentKey,
          currentLayout.value,
          stickyHeight.value
        );
      }
    }
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

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key,
    };
  }, []);

  const translateY = useDerivedValue(() => {
    const position = headerViewPositions.value[contentKey];
    if (!currentLayout.value || !position) {
      return scrollY.value;
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
        style={[styles.container, containerStyle, internalStyle, animatedStyle]}
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
