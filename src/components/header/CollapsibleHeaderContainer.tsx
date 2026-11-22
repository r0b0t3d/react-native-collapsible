import React, { ReactNode, useId, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import CollapsibleHeaderContainerProvider from './CollapsibleHeaderContainerProvider';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

// Module-scoped monotonic counter used only to assign zIndex to *new* instances
// (see useInstanceZIndex below). Bounded by app lifetime; wraparound after ~100k
// instances may cause one frame of incorrect layering.
let nextZIndex = 0;
function useInstanceZIndex(): number {
  const ref = useRef<number | null>(null);
  if (ref.current === null) {
    ref.current = nextZIndex++;
  }
  return ref.current;
}

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const contentKey = `collapsible-header-${useId()}`;
  const instanceZIndex = useInstanceZIndex();

  const internalStyle = useMemo(
    () => ({ zIndex: 100000 - instanceZIndex }),
    [instanceZIndex]
  );

  return (
    <CollapsibleHeaderContainerProvider
      containerStyle={[internalStyle, containerStyle]}
      contentKey={contentKey}
    >
      {children}
    </CollapsibleHeaderContainerProvider>
  );
}
