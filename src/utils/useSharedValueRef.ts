import { useCallback, useRef } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

function shallowEqualKeys(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  for (const k in a) {
    if (a[k] !== b[k]) return false;
  }
  for (const k in b) {
    if (!(k in a)) return false;
  }
  return true;
}

export default function useSharedValueRef<T>(
  defaultValue: T
): [SharedValue<T>, (value: T) => void] {
  const sharedValue = useSharedValue<T>(defaultValue);
  const savedValue = useRef<T>(defaultValue);

  const appendValue = useCallback(
    (value: T) => {
      const current = savedValue.current as Record<string, unknown>;
      const next = value as Record<string, unknown>;
      // Quick path: same reference means no change.
      if (current === next) {
        return;
      }
      // Build the merged map: take current, overlay next, then drop any
      // resulting `undefined` slots so long-lived consumers don't
      // accumulate stale keys across mount/unmount cycles.
      const merged: Record<string, unknown> = { ...current, ...next };
      for (const k in merged) {
        if (merged[k] === undefined) {
          delete merged[k];
        }
      }
      // Skip the shared-value write if the merged map is shallow-equal to
      // the previous one. This protects readers (useDerivedValue
      // Object.values(...).reduce) from re-running on no-op updates.
      if (shallowEqualKeys(merged, current)) {
        return;
      }
      savedValue.current = merged as T;
      sharedValue.value = savedValue.current;
    },
    [sharedValue]
  );

  return [sharedValue, appendValue];
}
