/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, FC } from 'react';
import type { CollapsibleHandles, LayoutParams } from './types';
import { CollapsibleContext } from './hooks/useCollapsibleContext';
import { InternalCollapsibleContext } from './hooks/useInternalCollapsibleContext';
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { View } from 'react-native';
import { debounce } from './utils/debounce';
import CollapsibleHeaderProvider from './components/header/CollapsibleHeaderProvider';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>();
    const headerHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const stickyViewRefs = useRef<
      Record<string, React.RefObject<View> | undefined>
    >({});
    const stickyViewTops = useSharedValue<Record<string, number>>({});
    const stickyViewPositionsRef = useRef<
      Record<string, LayoutParams | undefined>
    >({});
    const stickyViewPositions = useSharedValue<Record<string, LayoutParams>>(
      {}
    );
    const fixedHeaderHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const firstStickyViewY = useSharedValue(1000000);
    const containerRef = useRef<View>(null);
    const scrollViewRef = useRef<View>(null);

    const setCollapsibleHandlers = useCallback((handlers) => {
      collapsibleHandlers.current = handlers;
    }, []);

    const headerCollapsed = useDerivedValue(() => {
      const maxY = fixedHeaderHeight.value - firstStickyViewY.value;
      return scrollY.value >= maxY;
    }, []);

    const contentMinHeight = useDerivedValue(() => {
      return containerHeight.value + fixedHeaderHeight.value;
    }, []);

    useAnimatedReaction(
      () => {
        const totalHeight = Object.keys(stickyViewPositions.value).reduce(
          (acc, item) => {
            const value = stickyViewPositions.value[item];
            if (value) {
              return acc + value.top;
            }
            return acc;
          },
          0
        );
        return totalHeight - fixedHeaderHeight.value;
      },
      (result, previous) => {
        if (result !== previous) {
          const viewPositions = stickyViewPositions.value;
          const sortedKeys = Object.keys(viewPositions)
            .filter((v) => !!viewPositions[v])
            // @ts-ignore
            .sort((a, b) => viewPositions[a].top - viewPositions[b].top);
          let totalTop = 0;
          const values: any = {};
          for (let i = 0; i < sortedKeys.length; i++) {
            // @ts-ignore
            values[sortedKeys[i]] = totalTop;
            // Try minus 1 make it filled when scrolling up.
            // Otherwise, we can see a small space between the persits views
            // @ts-ignore
            totalTop += viewPositions[sortedKeys[i]].height - 1;
          }
          stickyViewTops.value = values;
          // @ts-ignore
          firstStickyViewY.value = viewPositions[sortedKeys[0]]?.top || 0;
        }
      }
    );

    const handleStickyViewLayout = useCallback(
      (viewKey: string, viewRef?: React.RefObject<View>) => {
        if (viewRef && viewRef.current && containerRef.current) {
          stickyViewRefs.current[viewKey] = viewRef;
          viewRef.current.measureLayout(
            // @ts-ignore
            containerRef.current,
            (left, top, width, height) => {
              stickyViewPositionsRef.current = {
                ...stickyViewPositionsRef.current,
                [viewKey]: { left, top, width, height },
              };
              // @ts-ignore
              stickyViewPositions.value = stickyViewPositionsRef.current;
            },
            () => {}
          );
        } else {
          stickyViewRefs.current = {
            ...stickyViewRefs.current,
            [viewKey]: undefined,
          };
          stickyViewPositionsRef.current = {
            ...stickyViewPositionsRef.current,
            [viewKey]: undefined,
          };
          // @ts-ignore
          stickyViewPositions.value = stickyViewPositionsRef.current;
        }
      },
      []
    );

    const debounceRefreshStickyPositions = useMemo(() => {
      return debounce(() => {
        Object.keys(stickyViewRefs.current).forEach((key) => {
          const viewRef = stickyViewRefs.current[key];
          if (viewRef) {
            handleStickyViewLayout(key, viewRef);
          }
        });
      }, 200);
    }, []);

    const handleHeaderContainerLayout = useCallback((height: number) => {
      headerHeight.value = withTiming(height, {
        duration: fixedHeaderHeight.value === 0 ? 0 : 10,
      });
      fixedHeaderHeight.value = height;
      // Try refresh sticky positions
      debounceRefreshStickyPositions();
    }, []);

    const handleContainerHeight = useCallback((height: number) => {
      containerHeight.value = height;
    }, []);

    const context = useMemo(() => {
      return {
        collapse: (animated?: boolean) =>
          collapsibleHandlers.current?.collapse(animated),
        expand: () => collapsibleHandlers.current?.expand(),
        scrollTo: (offset: number, animate?: boolean) =>
          collapsibleHandlers.current?.scrollTo(offset, animate),
        scrollToIndex: (params: any) =>
          collapsibleHandlers.current?.scrollToIndex(params),
        headerHeight,
        scrollY,
        headerCollapsed,
      };
    }, [scrollY, headerHeight, headerCollapsed]);

    const internalContext = useMemo(
      () => ({
        scrollViewRef,
        containerRef,
        handleStickyViewLayout,
        handleHeaderContainerLayout,
        setCollapsibleHandlers,
        handleContainerHeight,
        firstStickyViewY,
        stickyViewTops,
        stickyViewPositions,
        fixedHeaderHeight,
        contentMinHeight,
      }),
      [
        setCollapsibleHandlers,
        handleStickyViewLayout,
        handleHeaderContainerLayout,
        handleContainerHeight,
        firstStickyViewY,
        stickyViewTops,
        stickyViewPositions,
        fixedHeaderHeight,
        contentMinHeight,
      ]
    );

    return (
      <CollapsibleContext.Provider value={context}>
        <InternalCollapsibleContext.Provider value={internalContext}>
          <CollapsibleHeaderProvider>
            {/** @ts-ignore */}
            <Component {...props} />
          </CollapsibleHeaderProvider>
        </InternalCollapsibleContext.Provider>
      </CollapsibleContext.Provider>
    );
  };
}
