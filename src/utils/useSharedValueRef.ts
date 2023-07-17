import { useCallback, useRef } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';

export default function useSharedValueRef<T>(
  defaultValue: T
): [Animated.SharedValue<T>, (value: T) => void] {
  const sharedValue = useSharedValue<T>(defaultValue);
  const savedValue = useRef<T>(defaultValue);

  const appendValue = useCallback(
    (value: T) => {
      savedValue.current = {
        ...savedValue.current,
        ...value,
      };
      sharedValue.value = savedValue.current;
    },
    [sharedValue]
  );

  return [sharedValue, appendValue];
}
