/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, FC } from 'react';
import type { CollapsibleHandles } from './types';
import { CollapsibleContext } from './hooks/useCollapsibleContext';
import { InternalCollapsibleContext } from './hooks/useInternalCollapsibleContext';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { LayoutRectangle, View } from 'react-native';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>();
    const headerHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const fixedHeaderHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const scrollViewRef = useRef<View>(null);
    const containerRef = useRef<View>(null);
    const headerContainerLayouts = useRef<
      Record<string, (LayoutRectangle & { stickyHeight?: number }) | undefined>
    >({});
    const headerViewPositions = useSharedValue({});

    const setCollapsibleHandlers = useCallback((handlers) => {
      collapsibleHandlers.current = handlers;
    }, []);

    const headerCollapsed = useDerivedValue(() => {
      const maxY = fixedHeaderHeight.value;
      return scrollY.value >= maxY;
    }, []);

    const contentMinHeight = useDerivedValue(() => {
      return containerHeight.value + fixedHeaderHeight.value;
    }, []);

    const handleHeaderContainerLayout = useCallback(
      (key: string, layout?: LayoutRectangle, stickyHeight?: number) => {
        headerContainerLayouts.current[key] = layout
          ? {
              ...layout,
              stickyHeight,
            }
          : undefined;
        const headerContainers = Object.keys(
          headerContainerLayouts.current
        ).filter((k: string) => !!headerContainerLayouts.current[k]);
        // Calculate header positions
        const sortedHeaders = headerContainers.sort((a, b) => {
          return (
            (headerContainerLayouts.current[a]?.y || 0) -
            (headerContainerLayouts.current[b]?.y || 0)
          );
        });
        const values: any = {};
        let aStickyHeight = 0;
        for (let index = 0; index < sortedHeaders.length; index++) {
          const headerKey = sortedHeaders[index];
          const sHeight =
            headerContainerLayouts.current[headerKey]?.stickyHeight ?? 0;
          values[headerKey] = {
            top: aStickyHeight,
            stickyHeight: sHeight,
          };
          aStickyHeight += sHeight;
        }
        headerViewPositions.value = values;
      },
      []
    );

    const handleContainerHeight = useCallback((height: number) => {
      containerHeight.value = height;
    }, []);

    const handleScrollToView = useCallback(
      (ref: React.RefObject<any>, animated?: boolean) => {
        if (!ref.current) {
          return;
        }
        ref.current.measureLayout(
          containerRef.current,
          (_left: number, top: number, _width: number, _height: number) => {
            const headerContainers = Object.keys(
              headerContainerLayouts.current
            ).filter((k: string) => {
              const layout = headerContainerLayouts.current[k];
              if (layout) {
                return layout.y + layout.height < top;
              }
              return false;
            });
            const stickyHeightAbove = headerContainers.reduce((acc, key) => {
              const layout = headerContainerLayouts.current[key];
              acc += layout?.stickyHeight ?? 0;
              return acc;
            }, 0);
            collapsibleHandlers.current?.scrollTo(
              top - stickyHeightAbove,
              animated
            );
          },
          () => {}
        );
      },
      []
    );

    const context = useMemo(() => {
      return {
        collapse: (animated?: boolean) =>
          collapsibleHandlers.current?.collapse(animated),
        expand: () => collapsibleHandlers.current?.expand(),
        scrollTo: (offset: number, animate?: boolean) =>
          collapsibleHandlers.current?.scrollTo(offset, animate),
        scrollToIndex: (params: any) =>
          collapsibleHandlers.current?.scrollToIndex(params),
        scrollToLocation: (params: any) =>
          collapsibleHandlers.current?.scrollToLocation(params),
        headerHeight,
        scrollY,
        headerCollapsed,
        scrollToView: handleScrollToView,
      };
    }, [scrollY, headerHeight, headerCollapsed, handleScrollToView]);

    const internalContext = useMemo(
      () => ({
        containerRef,
        scrollViewRef,
        handleHeaderContainerLayout,
        setCollapsibleHandlers,
        handleContainerHeight,
        headerHeight,
        fixedHeaderHeight,
        contentMinHeight,
        headerViewPositions,
      }),
      [
        setCollapsibleHandlers,
        handleHeaderContainerLayout,
        handleContainerHeight,
        headerHeight,
        fixedHeaderHeight,
        contentMinHeight,
        headerViewPositions,
      ]
    );

    return (
      <CollapsibleContext.Provider value={context}>
        <InternalCollapsibleContext.Provider value={internalContext}>
          {/** @ts-ignore */}
          <Component {...props} />
        </InternalCollapsibleContext.Provider>
      </CollapsibleContext.Provider>
    );
  };
}
