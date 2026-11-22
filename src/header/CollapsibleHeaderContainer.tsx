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
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useCollapsibleContext,
  useInternalCollapsibleContext,
} from '../container/context';
import {
  HeaderLayout,
  headerScroll,
  headerTranslate,
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
};

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
}: Props) {
  const key = useId();
  const { headerLayouts } = useInternalCollapsibleContext();
  const { scrollY } = useCollapsibleContext();
  const frame = useSharedValue<LayoutRectangle | null>(null);
  const stickyHeights = useSharedValue<Record<string, number>>({});

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
      <Animated.View
        style={[styles.container, containerStyle, animatedStyle]}
        pointerEvents="box-none"
        onLayout={handleLayout}
      >
        {children}
      </Animated.View>
    </HeaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'white',
  },
});
