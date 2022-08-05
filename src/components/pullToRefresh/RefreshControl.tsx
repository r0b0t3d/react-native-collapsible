/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import usePullToRefreshContext from './usePullToRefreshContext';

type Props = {
  height?: number;
  refreshing: boolean;
  onRefresh: () => void;
  renderAnimation: (animatedProps: any) => React.ReactNode;
};

export default function RefreshControl({
  height = 100,
  refreshing,
  onRefresh,
  renderAnimation,
}: Props) {
  const { refreshValue, internalRefreshing, internalHeight } =
    usePullToRefreshContext();
  const manualTriggered = useRef(false);

  useEffect(() => {
    internalHeight.value = height;
  }, [height]);

  useEffect(() => {
    if (!internalRefreshing.value && refreshing) {
      manualTriggered.current = true;
    }
    internalRefreshing.value = refreshing;
  }, [refreshing]);

  useAnimatedReaction(
    () => {
      return internalRefreshing.value;
    },
    (result, prev) => {
      if (result !== prev) {
        if (result && refreshValue.value === 0) {
          refreshValue.value = height;
        }
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: refreshValue.value,
    };
  }, []);

  const handleRefresh = useCallback(() => {
    if (manualTriggered.current) {
      manualTriggered.current = false;
      return;
    }
    onRefresh();
  }, [onRefresh]);

  useAnimatedReaction(
    () => internalRefreshing.value,
    (result, prev) => {
      if (result !== prev) {
        if (result) {
          runOnJS(handleRefresh)();
        } else {
          refreshValue.value = withTiming(0);
        }
      }
    }
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      progress: internalRefreshing.value
        ? undefined
        : Math.min(refreshValue.value / height, 1),
    };
  }, [height]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderAnimation(animatedProps)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
