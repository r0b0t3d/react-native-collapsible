import React, { ComponentType, RefObject, useMemo, useRef } from 'react';
import type { View } from 'react-native';
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import type { CollapsibleContextType, CollapsibleHandles } from '../types';
import {
  CollapsibleContext,
  InternalCollapsibleContext,
  InternalCollapsibleContextType,
} from './context';
import {
  collapsibleDistanceOf,
  headerHeightOf,
  HeaderLayouts,
  stickyHeightAbove,
} from './geometry';

export default function withCollapsibleContext<T extends object>(
  Component: ComponentType<T>
) {
  return function CollapsibleProvider(props: T) {
    const scrollable = useRef<CollapsibleHandles | null>(null);
    const containerRef = useRef<View>(null);
    const scrollY = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const headerLayouts = useSharedValue<HeaderLayouts>({});
    const scrollableRef = useAnimatedRef<any>();
    const scrollableContentHeight = useSharedValue(0);
    const dragScrollY = useSharedValue(0);
    const snapOffsets = useSharedValue<number[] | undefined>(undefined);

    useAnimatedReaction(
      () => dragScrollY.value,
      (offset, previous) => {
        if (previous !== null && offset !== previous) {
          scrollTo(scrollableRef, 0, offset, false);
        }
      }
    );

    const headerHeight = useDerivedValue(() =>
      headerHeightOf(headerLayouts.value)
    );
    const collapsibleDistance = useDerivedValue(() =>
      collapsibleDistanceOf(headerLayouts.value)
    );
    const headerCollapsed = useDerivedValue(
      () => scrollY.value >= collapsibleDistance.value
    );
    const contentMinHeight = useDerivedValue(
      () => containerHeight.value + collapsibleDistance.value
    );

    const internalContext = useMemo<InternalCollapsibleContextType>(
      () => ({
        containerRef,
        containerHeight,
        contentMinHeight,
        collapsibleDistance,
        headerLayouts,
        scrollableRef,
        scrollableContentHeight,
        dragScrollY,
        snapOffsets,
        measureInContainer: (ref: RefObject<any>, onMeasure) => {
          ref.current?.measureLayout(
            containerRef.current,
            (_left: number, top: number, _width: number, height: number) =>
              onMeasure(top, height),
            () => {
              if (__DEV__) {
                console.warn(
                  'Could not measure view inside CollapsibleContainer'
                );
              }
            }
          );
        },
        registerScrollable: (handles) => {
          scrollable.current = handles;
          return () => {
            if (scrollable.current === handles) {
              scrollable.current = null;
            }
          };
        },
      }),
      [
        containerHeight,
        contentMinHeight,
        collapsibleDistance,
        headerLayouts,
        scrollableRef,
        scrollableContentHeight,
        dragScrollY,
        snapOffsets,
      ]
    );

    const context = useMemo<CollapsibleContextType>(
      () => ({
        collapse: (animated) => scrollable.current?.collapse(animated),
        expand: () => scrollable.current?.expand(),
        scrollTo: (offset, animated) =>
          scrollable.current?.scrollTo(offset, animated),
        scrollToIndex: (params) => scrollable.current?.scrollToIndex(params),
        scrollToLocation: (params) =>
          scrollable.current?.scrollToLocation(params),
        scrollToView: (ref, animated) =>
          internalContext.measureInContainer(ref, (top) =>
            scrollable.current?.scrollTo(
              top - stickyHeightAbove(headerLayouts.value, top),
              animated
            )
          ),
        scrollY,
        headerHeight,
        headerCollapsed,
      }),
      [internalContext, headerLayouts, scrollY, headerHeight, headerCollapsed]
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
