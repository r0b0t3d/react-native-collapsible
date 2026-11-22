import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
} from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {
  useCollapsibleContext,
  useInternalCollapsibleContext,
} from '../container/context';
import {
  clamp,
  HeaderLayout,
  headerScroll,
  headerTranslate,
  snapOffsetFor,
  stackPosition,
} from '../container/geometry';
import { removeEntry, setEntry } from './layoutRegistry';

type HeaderContextType = {
  stickyHeights: SharedValue<Record<string, number>>;
  scrolled: SharedValue<number>;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('StickyView should be inside CollapsibleHeaderContainer');
  }
  return context;
}

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  scrollOnDrag?: boolean;
};

const DRAG_ACTIVATION_OFFSET = 10;
const DRAG_DECELERATION = 0.998;

function isSameLayout(a: HeaderLayout, b: HeaderLayout | null) {
  'worklet';
  return (
    b !== null &&
    a.y === b.y &&
    a.height === b.height &&
    a.stickyHeight === b.stickyHeight
  );
}

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
  scrollOnDrag = true,
}: Props) {
  const key = useId();
  const {
    headerLayouts,
    containerHeight,
    scrollableContentHeight,
    dragScrollY,
    snapOffsets,
  } = useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const frame = useSharedValue<LayoutRectangle | null>(null);
  const stickyHeights = useSharedValue<Record<string, number>>({});
  const dragStartY = useSharedValue(0);

  const dragGesture = useMemo(() => {
    const maxScroll = () => {
      'worklet';
      return Math.max(0, scrollableContentHeight.value - containerHeight.value);
    };
    return Gesture.Pan()
      .enabled(scrollOnDrag)
      .activeOffsetY([-DRAG_ACTIVATION_OFFSET, DRAG_ACTIVATION_OFFSET])
      .failOffsetX([-DRAG_ACTIVATION_OFFSET, DRAG_ACTIVATION_OFFSET])
      .onStart(() => {
        cancelAnimation(dragScrollY);
        dragStartY.value = scrollY.value;
      })
      .onUpdate(({ translationY }) => {
        dragScrollY.value = clamp(
          dragStartY.value - translationY,
          0,
          maxScroll()
        );
      })
      .onEnd(({ velocityY }) => {
        const velocity = -velocityY;
        const projected =
          dragScrollY.value +
          (velocity * DRAG_DECELERATION) / ((1 - DRAG_DECELERATION) * 1000);
        const snapOffset = snapOffsetFor(
          snapOffsets.value,
          projected,
          Math.sign(velocity)
        );
        dragScrollY.value =
          snapOffset === undefined
            ? withDecay({
                velocity,
                deceleration: DRAG_DECELERATION,
                clamp: [0, maxScroll()],
              })
            : withTiming(Math.min(snapOffset, maxScroll()));
      });
  }, [
    scrollOnDrag,
    scrollableContentHeight,
    containerHeight,
    dragScrollY,
    dragStartY,
    snapOffsets,
    scrollY,
  ]);

  useEffect(() => () => removeEntry(headerLayouts, key), [headerLayouts, key]);

  useAnimatedReaction(
    () => {
      if (!frame.value) {
        return null;
      }
      let stickyHeight = 0;
      for (const stickyKey in stickyHeights.value) {
        stickyHeight += stickyHeights.value[stickyKey]!;
      }
      return { y: frame.value.y, height: frame.value.height, stickyHeight };
    },
    (layout, previous) => {
      if (layout && !isSameLayout(layout, previous)) {
        setEntry(headerLayouts, key, layout);
      }
    }
  );

  const position = useDerivedValue(() =>
    stackPosition(headerLayouts.value, key)
  );

  const scrolled = useDerivedValue(() => {
    const layout = headerLayouts.value[key];
    return layout && position.value
      ? headerScroll(layout, position.value.top, scrollY.value)
      : 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const layout = headerLayouts.value[key];
    if (!layout || !position.value) {
      return { zIndex: 1, transform: [{ translateY: 0 }] };
    }
    return {
      zIndex: Object.keys(headerLayouts.value).length - position.value.index,
      transform: [
        {
          translateY: headerTranslate(
            layout,
            position.value.top,
            scrollY.value
          ),
        },
      ],
    };
  });

  const handleLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      frame.value = layout;
    },
    [frame]
  );

  const context = useMemo(
    () => ({ stickyHeights, scrolled }),
    [stickyHeights, scrolled]
  );

  return (
    <HeaderContext.Provider value={context}>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[styles.container, containerStyle, animatedStyle]}
          pointerEvents="box-none"
          onLayout={handleLayout}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </HeaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'white',
  },
});
