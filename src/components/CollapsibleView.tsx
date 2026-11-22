import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  SharedValue,
} from 'react-native-reanimated';

export type CollapsibleHeaderProps = {
  onToggle: () => void;
  collapsed: SharedValue<number>;
};

type Props = {
  initialState?: 'collapsed' | 'expanded';
  collapseState?: SharedValue<number>;
  renderHeader: (props: CollapsibleHeaderProps) => ReactNode;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  collapsedBackgroundColor?: string;
  expandedBackgroundColor?: string;
  onToggle?: (isExpand: boolean) => void;
};

function initialValue(initialState: Props['initialState']) {
  return initialState === 'expanded' ? 1 : 0;
}

export default function CollapsibleView({
  initialState = 'collapsed',
  collapseState: collapseStateProp,
  renderHeader,
  children,
  containerStyle,
  collapsedBackgroundColor,
  expandedBackgroundColor,
  onToggle,
}: Props) {
  const collapseStateInternal = useSharedValue(initialValue(initialState));
  const collapseState = collapseStateProp ?? collapseStateInternal;
  const actualHeight = useSharedValue(0);

  useEffect(() => {
    if (!collapseStateProp) {
      collapseStateInternal.value = initialValue(initialState);
    }
  }, [initialState, collapseStateProp, collapseStateInternal]);

  const handleToggle = useCallback(() => {
    collapseState.value = withSpring(collapseState.value === 0 ? 1 : 0, {
      overshootClamping: true,
    });
  }, [collapseState]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      actualHeight.value = event.nativeEvent.layout.height;
    },
    [actualHeight]
  );

  const wrapperStyle = useAnimatedStyle(() => {
    if (actualHeight.value === 0) {
      return collapseState.value === 0 ? { height: 0 } : {};
    }
    return {
      height: interpolate(collapseState.value, [0, 1], [0, actualHeight.value]),
    };
  }, [actualHeight, collapseState]);

  useAnimatedReaction(
    () => (collapseState.value === 1 ? 1 : 0),
    (result, prev) => {
      if (prev === null || result === prev) {
        return;
      }
      if (onToggle) {
        runOnJS(onToggle)(result === 1);
      }
    },
    [onToggle]
  );

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
  }, [collapseState, collapsedBackgroundColor, expandedBackgroundColor]);

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
        <View onLayout={handleLayout} pointerEvents="box-none">
          {children}
        </View>
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
  title: string | ReactNode;
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

  const [expanded, setExpanded] = useState(false);
  useAnimatedReaction(
    () => collapsed.value >= 0.5,
    (result, prev) => {
      if (result !== prev) {
        runOnJS(setExpanded)(result);
      }
    }
  );

  return (
    <View style={style} pointerEvents="box-none">
      <View style={styles.headerContainer} pointerEvents="box-none">
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
        >
          <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        </Pressable>
        {icon && (
          <Pressable onPress={onToggle} accessible={false}>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    // flex: 1,
  },
});
