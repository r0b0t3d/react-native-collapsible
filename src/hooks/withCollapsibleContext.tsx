/* eslint-disable react-hooks/exhaustive-deps */
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
    const fixedHeaderHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const persistHeaderHeight = useSharedValue(0);
    const headerCollapsed = useSharedValue(false);
    const contentMinHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const firstPersistViewY = useSharedValue(1000000);
    const persitsViewTop = useSharedValue<Record<string, number>>({});

    const persistViewPositions = useRef<Record<string, LayoutParams>>({});
    const containerRef = useRef<View>(null);

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

    const populateData = useCallback(
      (viewPositions: any, headerHeight: number) => {
        const sortedKeys = Object.keys(viewPositions).sort(
          (a, b) => viewPositions[a].top - viewPositions[b].top
        );
        let totalTop = 0;
        const values: any = {};
        for (let i = 0; i < sortedKeys.length; i++) {
          values[sortedKeys[i]] = totalTop;
          totalTop += viewPositions[sortedKeys[i]].height;
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
        console.log(viewKey, layout);

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
      (headerHeight: number) => {
        fixedHeaderHeight.value = headerHeight;
        populateData(persistViewPositions.current, headerHeight);
      },
      [populateData, fixedHeaderHeight]
    );

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
      }),
      [
        setCollapsibleHandlers,
        handlePersistViewLayout,
        containerHeight,
        firstPersistViewY,
        persitsViewTop,
        handleHeaderContainerLayout,
        fixedHeaderHeight,
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
