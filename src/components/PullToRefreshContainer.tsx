import { PanGestureHandler } from 'react-native-gesture-handler';
import React, { useMemo, useRef } from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PullToRefreshContext } from '../hooks/usePullToRefreshContext';
import { StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function PullToRefreshContainer({ children }: Props) {
  const y = useSharedValue(0);
  const scrollRef = useRef();
  const panRef = useRef();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      // ctx.startX = y.value;
    },
    onActive: (event, ctx) => {
      y.value = event.translationX;
      console.log(y.value);
    },
    onEnd: (_) => {
      //   x.value = withSpring(0);
    },
  });

  const context = useMemo(() => {
    return {
      translateY: y,
      scrollRef,
      panRef,
    };
  }, [y]);

  return (
    <PullToRefreshContext.Provider value={context}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={gestureHandler}
        waitFor={[scrollRef]}
        activeOffsetY={[0, 1]}q
      >
        <Animated.View style={styles.container}>{children}</Animated.View>
      </PanGestureHandler>
    </PullToRefreshContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
