/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useMemo, useRef } from 'react';
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
import PullToRefreshProvider from './components/pullToRefresh/PullToRefreshProvider';

export default function withCollapsibleContext<T>(Component: FC<T>) {
  return (props: T) => {
    const collapsibleHandlers = useRef<CollapsibleHandles>();
    const headerHeight = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const stickyViewRefs = useRef<Record<string, React.RefObject<View>>>({});
    const stickyViewTops = useSharedValue<Record<string, number>>({});
    const stickyViewPositionsRef = useRef<Record<string, LayoutParams>>({});
    const stickyViewPositions = useSharedValue<Record<string, LayoutParams>>(
      {}
    );
    const fixedHeaderHeight = useSharedValue(0);
    const stickyHeaderHeight = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const firstStickyViewY = useSharedValue(1000000);
    const headerContainersHeight = useRef<Record<string, number>>({});
    const containerRef = useRef<View>(null);
    const scrollViewRef = useRef<View>(null);

    const setCollapsibleHandlers = useCallback((handlers) => {
      console.log({ handlers });

      collapsibleHandlers.current = handlers;
    }, []);

    const headerCollapsed = useDerivedValue(() => {
      const maxY = fixedHeaderHeight.value - firstStickyViewY.value;
      return scrollY.value >= maxY;
    }, []);

    const contentMinHeight = useDerivedValue(() => {
      return (
        containerHeight.value +
        fixedHeaderHeight.value -
        stickyHeaderHeight.value
      );
    }, []);

    useAnimatedReaction(
      () => {
        const totalHeight = Object.keys(stickyViewPositions.value).reduce(
          (acc, item) => {
            return acc + stickyViewPositions.value[item].top;
          },
          0
        );
        return totalHeight - fixedHeaderHeight.value;
      },
      (result, previous) => {
        if (result !== previous) {
          const viewPositions = stickyViewPositions.value;
          const headerHeight = fixedHeaderHeight.value;
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
          stickyViewTops.value = values;
          firstStickyViewY.value = viewPositions[sortedKeys[0]]?.top || 0;
          const stickyHeader = sortedKeys.reduce((acc, key) => {
            const data = viewPositions[key];
            const isInsideHeader = data.top < headerHeight;
            if (isInsideHeader) {
              return acc + data.height;
            }
            return acc;
          }, 0);
          stickyHeaderHeight.value = stickyHeader;
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
              stickyViewPositions.value = stickyViewPositionsRef.current;
            },
            () => {}
          );
        } else {
          delete stickyViewRefs.current[viewKey];
          delete stickyViewPositionsRef.current[viewKey];
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
          duration: fixedHeaderHeight.value === 0 ? 0 : 10,
        });
        fixedHeaderHeight.value = totalHeight;
        // Try refresh sticky positions
        debounceRefreshStickyPositions();
      },
      []
    );

    const handleContainerHeight = useCallback((height: number) => {
      containerHeight.value = height;
    }, []);

    const context = useMemo(() => {
      return {
        collapse: () => collapsibleHandlers.current?.collapse(),
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
          <PullToRefreshProvider>
            <Component {...props} />
          </PullToRefreshProvider>
        </InternalCollapsibleContext.Provider>
      </CollapsibleContext.Provider>
    );
  };
}
