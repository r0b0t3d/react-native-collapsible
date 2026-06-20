import React, { ReactNode, useEffect, useId, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import useCollapsibleHeaderConsumerContext from '../../hooks/useCollapsibleHeaderConsumerContext';
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
  const { mount, unmount, update } = useCollapsibleHeaderConsumerContext();

  const internalStyle = useMemo(
    () => ({ zIndex: 100000 - instanceZIndex }),
    [instanceZIndex]
  );

  const content = useMemo(() => {
    return (
      <CollapsibleHeaderContainerProvider
        containerStyle={[internalStyle, containerStyle]}
        contentKey={contentKey}
        key={contentKey}
      >
        {children}
      </CollapsibleHeaderContainerProvider>
    );
  }, [children, containerStyle, contentKey, internalStyle]);

  useEffect(() => {
    mount(contentKey, content);

    return () => {
      unmount(contentKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  useEffect(() => {
    update(contentKey, content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return null;
}
