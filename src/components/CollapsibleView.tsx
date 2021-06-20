/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
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
}: Props) {
  const actualHeight = useSharedValue(0);
  const contentReady = useSharedValue(0);
  const [contentKey] = useState(key++);

  useEffect(() => {
    const newValue = initialState === 'collapsed' ? 0 : 1;
    if (newValue === collapseState.value) {
      return;
    }
    collapseState.value = newValue;
  }, [initialState]);

  const onToggle = useCallback(() => {
    collapseState.value = collapseState.value === 0 ? 1 : 0;
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    contentReady.value = 1;
    if (event.nativeEvent.layout.height > 0) {
      actualHeight.value = event.nativeEvent.layout.height;
    }
  }, []);

  const wrapperStyle = useAnimatedStyle(
    () => ({
      height:
        contentReady.value === 1
          ? withSpring(collapseState.value === 1 ? actualHeight.value : 0)
          : 0.1,
      opacity: contentReady.value,
    }),
    [actualHeight, contentKey]
  );

  const contentHeight = useAnimatedStyle(
    () => ({
      height: actualHeight.value > 0 ? actualHeight.value : undefined,
    }),
    [actualHeight, contentKey]
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

  return (
    <Animated.View
      style={[containerStyle, containerAnimatedStyle]}
      pointerEvents="box-none"
    >
      <View pointerEvents="box-none">
        {renderHeader({ onToggle, collapsed: collapseState })}
      </View>
      <Animated.View
        style={[styles.wrapper, wrapperStyle]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[styles.content, contentHeight]}
          pointerEvents="box-none"
        >
          <View
            key={`collapse-view-content-${contentKey}`}
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

CollapsibleView.whyDidYouRender = true;

export function CollapsibleHeaderText({
  title,
  onToggle,
  style,
  titleStyle,
  icon,
  children,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
  children?: ReactNode;
} & CollapsibleHeaderProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onToggle} style={[style]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        {icon}
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  content: {
    // flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 1,
  },
});
