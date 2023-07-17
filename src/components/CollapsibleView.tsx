/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  interpolate,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

export type CollapsibleHeaderProps = {
  onToggle: () => void;
  collapsed: Animated.SharedValue<number>;
};

type Props = {
  initialState?: 'collapsed' | 'expanded';
  collapseState?: Animated.SharedValue<number>;
  renderHeader: (props: CollapsibleHeaderProps) => ReactNode;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  collapsedBackgroundColor?: string;
  expandedBackgroundColor?: string;
  useDynamicLayout?: boolean;
  onToggle?: (isExpand: boolean) => void;
};

let key = 0;
export default function CollapsibleView({
  initialState = 'collapsed',
  collapseState = useSharedValue(0),
  renderHeader,
  children,
  containerStyle,
  collapsedBackgroundColor,
  expandedBackgroundColor,
  onToggle,
}: Props) {
  const actualHeight = useSharedValue(11110);
  const contentKey = useMemo(() => `collapsible-view-${key++}`, []);

  useEffect(() => {
    const newValue = initialState === 'collapsed' ? 0 : 1;
    if (newValue === collapseState.value) {
      return;
    }
    collapseState.value = newValue;
  }, [initialState]);

  const handleToggle = useCallback(() => {
    collapseState.value = withSpring(collapseState.value === 0 ? 1 : 0, {
      overshootClamping: true,
    });
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    if (event.nativeEvent.layout.height >= 0) {
      actualHeight.value = event.nativeEvent.layout.height;
    }
  }, []);

  const wrapperStyle = useAnimatedStyle(
    () => ({
      height: withSpring(collapseState.value === 1 ? actualHeight.value : 0, {
        damping: 5,
        stiffness: 130,
        overshootClamping: true,
      }),
    }),
    [actualHeight, contentKey]
  );

  const contentHeight = useAnimatedStyle(
    () => ({
      height: actualHeight.value > 0 ? actualHeight.value : undefined,
    }),
    [actualHeight, contentKey]
  );

  useAnimatedReaction(
    () => (collapseState.value === 0 ? 0 : collapseState.value === 1 ? 1 : 0),
    (result, prev) => {
      if (result === prev) {
        return;
      }
      if (onToggle) {
        runOnJS(onToggle)(result === 1);
      }
    }
  );

  // @ts-ignore
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (collapsedBackgroundColor && expandedBackgroundColor) {
      return {
        backgroundColor: interpolateColor(
          collapseState.value,
          [0, 1],
          [collapsedBackgroundColor, expandedBackgroundColor]
        ),
      };
    }
    return {};
  }, []);

  const headerProps = useMemo(
    () => ({ onToggle: handleToggle, collapsed: collapseState }),
    [handleToggle, collapseState]
  );

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle]}
      pointerEvents="box-none"
    >
      <View pointerEvents="box-none">{renderHeader(headerProps)}</View>
      <Animated.View
        style={[styles.wrapper, wrapperStyle]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[styles.content, contentHeight]}
          pointerEvents="box-none"
        >
          <View
            key={contentKey}
            onLayout={handleLayout}
            pointerEvents="box-none"
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export function CollapsibleHeaderText({
  title,
  collapsed,
  onToggle,
  style,
  titleStyle,
  icon,
  iconInitialAngle = 0,
  children,
}: {
  title: string | Element;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
  iconInitialAngle?: number;
  children?: ReactNode;
} & CollapsibleHeaderProps) {
  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      collapsed.value,
      [0, 1],
      [iconInitialAngle, 180]
    );
    return {
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  }, [iconInitialAngle]);

  return (
    <View style={style} pointerEvents="box-none">
      <View style={styles.headerContainer} pointerEvents="box-none">
        <Pressable onPress={onToggle}>
          <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        </Pressable>
        {icon && (
          <Pressable onPress={onToggle}>
            <Animated.View style={iconStyle}>{icon}</Animated.View>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  content: {},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    // flex: 1,
  },
});
