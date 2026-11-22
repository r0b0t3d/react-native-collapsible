import type { SharedValue } from 'react-native-reanimated';

export function setEntry<T>(
  registry: SharedValue<Record<string, T>>,
  key: string,
  value: T
) {
  'worklet';
  registry.modify((entries) => {
    'worklet';
    return { ...entries, [key]: value };
  });
}

export function removeEntry<T>(
  registry: SharedValue<Record<string, T>>,
  key: string
) {
  'worklet';
  registry.modify((entries) => {
    'worklet';
    const rest = { ...entries };
    delete rest[key];
    return rest;
  });
}
