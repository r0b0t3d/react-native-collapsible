import React, { FC, useCallback, useMemo, useRef } from 'react';
import type { CollapsibleHandles, LayoutParams } from '../types';
import { CollapsibleContext } from './useCollapsibleContext';
import { InternalCollapsibleContext } from './useInternalCollapsibleContext';
import { useSharedValue } from 'react-native-reanimated';
import type { View } from 'react-native';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>();
    const headerHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const persistHeaderHeight = useSharedValue(0);
    const headerCollapsed = useSharedValue(false);
    const contentMinHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const persistViewPositions = useRef<Record<string, LayoutParams>>({});
    const containerRef = useRef<View>(null);
    const firstPersistViewY = useSharedValue(1000000);

    const setCollapsibleHandlers = useCallback((handlers) => {
      collapsibleHandlers.current = handlers;
    }, []);

    const context = useMemo(() => {
      return {
        collapse: () => collapsibleHandlers.current?.collapse(),
        expand: () => collapsibleHandlers.current?.expand(),
        scrollTo: (offset: number, animate?: boolean) =>
          collapsibleHandlers.current?.scrollTo(offset, animate),
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

    const handlePersistViewLayout = useCallback(
      (viewKey: string, layout: LayoutParams) => {
        'worklet';
        persistViewPositions.current[viewKey] = layout;
        const persistHeader = Object.keys(persistViewPositions.current).reduce(
          (acc, key) => {
            const data = persistViewPositions.current[key];
            if (data.top < firstPersistViewY.value) {
              firstPersistViewY.value = data.top;
            }
            const isInsideHeader = data.top < headerHeight.value;
            if (isInsideHeader) {
              return acc + data.height;
            }
            return acc;
          },
          0
        );
        persistHeaderHeight.value = persistHeader;
      },
      [headerHeight, persistHeaderHeight, firstPersistViewY]
    );

    const internalContext = useMemo(
      () => ({
        containerRef,
        handlePersistViewLayout,
        setCollapsibleHandlers,
        containerHeight,
        firstPersistViewY,
      }),
      [
        setCollapsibleHandlers,
        handlePersistViewLayout,
        containerHeight,
        firstPersistViewY,
      ]
    );

    return (
      <CollapsibleContext.Provider value={context}>
        <InternalCollapsibleContext.Provider value={internalContext}>
          <Component {...props} />
        </InternalCollapsibleContext.Provider>
      </CollapsibleContext.Provider>
    );
  };
}
