/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useMemo, useRef } from 'react';
import type { CollapsibleHandles, LayoutParams } from '../types';
import { CollapsibleContext } from './useCollapsibleContext';
import { InternalCollapsibleContext } from './useInternalCollapsibleContext';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import type { View } from 'react-native';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>();
    const headerHeight = useSharedValue(0);
    const fixedHeaderHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const persistHeaderHeight = useSharedValue(0);
    const headerCollapsed = useSharedValue(false);
    const contentMinHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const firstPersistViewY = useSharedValue(1000000);
    const headerContainersHeight = useRef<Record<string, number>>({});
    const persitsViewTop = useSharedValue<Record<string, number>>({});
    const persistViewPositions = useRef<Record<string, LayoutParams>>({});
    const containerRef = useRef<View>(null);

    const setCollapsibleHandlers = useCallback((handlers) => {
      collapsibleHandlers.current = handlers;
    }, []);

    const populateData = useCallback(
      (viewPositions: any, headerHeight: number) => {
        const sortedKeys = Object.keys(viewPositions).sort(
          (a, b) => viewPositions[a].top - viewPositions[b].top
        );
        let totalTop = 0;
        const values: any = {};
        for (let i = 0; i < sortedKeys.length; i++) {
          values[sortedKeys[i]] = totalTop;
          // Try minus 1 make it filled when scrolling up.
          // Otherwise, we can see a small space between the persits views
          totalTop += viewPositions[sortedKeys[i]].height - 1;
        }
        persitsViewTop.value = values;
        firstPersistViewY.value = viewPositions[sortedKeys[0]]?.top || 0;
        const persistHeader = sortedKeys.reduce((acc, key) => {
          const data = viewPositions[key];
          const isInsideHeader = data.top < headerHeight;
          if (isInsideHeader) {
            return acc + data.height;
          }
          return acc;
        }, 0);
        persistHeaderHeight.value = persistHeader;
      },
      []
    );

    const handlePersistViewLayout = useCallback(
      (viewKey: string, layout?: LayoutParams) => {
        if (!layout) {
          delete persistViewPositions.current[viewKey];
        } else {
          persistViewPositions.current = {
            ...persistViewPositions.current,
            [viewKey]: layout,
          };
        }
        populateData(persistViewPositions.current, fixedHeaderHeight.value);
      },
      [populateData, fixedHeaderHeight]
    );

    const handleHeaderContainerLayout = useCallback(
      (viewKey: string, height?: number) => {
        if (!height) {
          delete headerContainersHeight.current[viewKey];
        } else {
          headerContainersHeight.current[viewKey] = height;
        }
        const totalHeight = Object.keys(headerContainersHeight.current).reduce(
          (acc, key) => headerContainersHeight.current[key] + acc,
          0
        );
        headerHeight.value = withTiming(totalHeight, {
          duration:
            fixedHeaderHeight.value === 0 || headerCollapsed.value ? 0 : 200,
        });
        fixedHeaderHeight.value = totalHeight;
        populateData(persistViewPositions.current, totalHeight);
      },
      [populateData, fixedHeaderHeight, headerCollapsed]
    );

    const context = useMemo(() => {
      return {
        collapse: () => collapsibleHandlers.current?.collapse(),
        expand: () => collapsibleHandlers.current?.expand(),
        scrollTo: (offset: number, animate?: boolean) =>
          collapsibleHandlers.current?.scrollTo(offset, animate),
        headerHeight,
        scrollY,
        headerCollapsed,
      };
    }, [scrollY, headerHeight, headerCollapsed]);

    const internalContext = useMemo(
      () => ({
        containerRef,
        handlePersistViewLayout,
        handleHeaderContainerLayout,
        setCollapsibleHandlers,
        containerHeight,
        firstPersistViewY,
        persitsViewTop,
        fixedHeaderHeight,
        persistHeaderHeight,
        contentMinHeight,
      }),
      [
        setCollapsibleHandlers,
        handlePersistViewLayout,
        handleHeaderContainerLayout,
        containerHeight,
        firstPersistViewY,
        persitsViewTop,
        fixedHeaderHeight,
        persistHeaderHeight,
        contentMinHeight,
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
