import React, { FC, ReactNode, useCallback, useMemo, useRef } from 'react';
import type { CollapsibleHandles } from '../types';
import { CollapsibleContext } from '../hooks/useCollapsibleContext';
import { InternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';
import { useSharedValue } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
};

function CollapsibleContainer({ children }: Props) {
  const collapsibleHandlers = useRef<CollapsibleHandles>();
  const headerHeight = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const persistHeaderHeight = useSharedValue(0);
  const headerCollapsed = useSharedValue(false);
  const contentMinHeight = useSharedValue(0);

  const setCollapsibleHandlers = useCallback((handlers) => {
    collapsibleHandlers.current = handlers;
  }, []);

  const context = useMemo(() => {
    return {
      collapse: () => collapsibleHandlers.current?.collapse(),
      expand: () => collapsibleHandlers.current?.expand(),
      headerHeight,
      scrollY,
      persistHeaderHeight,
      headerCollapsed,
      contentMinHeight,
    };
  }, [
    persistHeaderHeight,
    scrollY,
    headerHeight,
    headerCollapsed,
    contentMinHeight,
  ]);

  const internalContext = useMemo(
    () => ({
      setCollapsibleHandlers,
    }),
    [setCollapsibleHandlers]
  );

  return (
    <CollapsibleContext.Provider value={context}>
      <InternalCollapsibleContext.Provider value={internalContext}>
        {children}
      </InternalCollapsibleContext.Provider>
    </CollapsibleContext.Provider>
  );
}

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    return (
      <CollapsibleContainer>
        <Component {...props} />
      </CollapsibleContainer>
    );
  };
}
