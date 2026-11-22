/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, FC } from 'react';
import type { CollapsibleHandles, HeaderLayout } from './types';
import { CollapsibleContext } from './hooks/useCollapsibleContext';
import { InternalCollapsibleContext } from './hooks/useInternalCollapsibleContext';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { View } from 'react-native';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>(null);
    const scrollY = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const scrollViewRef = useRef<View>(null);
    const containerRef = useRef<View>(null);
    const headerLayouts = useSharedValue<Record<string, HeaderLayout>>({});

    const setCollapsibleHandlers = useCallback(
      (handlers: CollapsibleHandles) => {
        collapsibleHandlers.current = handlers;
      },
      []
    );

    const headerViewPositions = useDerivedValue(() => {
      const layouts = headerLayouts.value;
      const positions: Record<string, { top: number; stickyHeight: number }> =
        {};
      let top = 0;
      Object.keys(layouts)
        .sort((a, b) => layouts[a]!.y - layouts[b]!.y)
        .forEach((key) => {
          const stickyHeight = layouts[key]!.stickyHeight;
          positions[key] = { top, stickyHeight };
          top += stickyHeight;
        });
      return positions;
    }, []);

    const headerHeight = useDerivedValue(
      () =>
        Object.values(headerLayouts.value).reduce(
          (acc, layout) => Math.max(acc, layout.y + layout.height),
          0
        ),
      []
    );

    const collapsibleDistance = useDerivedValue(() => {
      const stickyHeight = Object.values(headerLayouts.value).reduce(
        (acc, layout) => acc + layout.stickyHeight,
        0
      );
      return Math.max(0, headerHeight.value - stickyHeight);
    }, []);

    const headerCollapsed = useDerivedValue(() => {
      return scrollY.value >= collapsibleDistance.value;
    }, []);

    const contentMinHeight = useDerivedValue(() => {
      return containerHeight.value + collapsibleDistance.value;
    }, []);

    const handleScrollToView = useCallback(
      (ref: React.RefObject<any>, animated?: boolean) => {
        if (!ref.current) {
          return;
        }
        ref.current.measureLayout(
          containerRef.current,
          (_left: number, top: number, _width: number, _height: number) => {
            const stickyHeightAbove = Object.values(headerLayouts.value)
              .filter((layout) => layout.y + layout.height < top)
              .reduce((acc, layout) => acc + layout.stickyHeight, 0);
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
        containerHeight,
        scrollViewRef,
        headerLayouts,
        setCollapsibleHandlers,
        headerHeight,
        collapsibleDistance,
        contentMinHeight,
        headerViewPositions,
      }),
      [
        setCollapsibleHandlers,
        headerLayouts,
        headerHeight,
        collapsibleDistance,
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
