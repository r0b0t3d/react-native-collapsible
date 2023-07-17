/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import type { ScrollToIndexParams } from '../../types';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';

const { height: wHeight } = Dimensions.get('window');

type Props = {
  headerSnappable: boolean;
  scrollTo: (yValue: number, animated?: boolean) => void;
  scrollToIndex: (params: ScrollToIndexParams) => void;
};

export default function useAnimatedScroll({
  headerSnappable,
  scrollTo,
  scrollToIndex,
}: Props) {
  const scrollDirection = useSharedValue('unknown');
  const { scrollY } = useCollapsibleContext();
  const { setCollapsibleHandlers, fixedHeaderHeight } =
    useInternalCollapsibleContext();

  useEffect(() => {
    if (scrollY.value > 0) {
      requestAnimationFrame(() => scrollTo(scrollY.value, false));
    }
  }, []);

  const collapse = useCallback(
    (animated = true) => {
      scrollTo(fixedHeaderHeight.value, animated);
    },
    [scrollTo]
  );

  const expand = useCallback(() => scrollTo(0), [scrollTo]);

  useEffect(() => {
    setCollapsibleHandlers({
      collapse,
      expand,
      scrollTo,
      scrollToIndex,
    });
  }, [setCollapsibleHandlers, collapse, expand, scrollTo, scrollToIndex]);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const offset = event.contentOffset.y;
        const diff = scrollY.value - offset;
        scrollDirection.value = diff > 0 ? 'down' : diff < 0 ? 'up' : 'unknown';
        scrollY.value = offset;
      },
      onEndDrag: () => {
        if (!headerSnappable) return;
        const maxY = fixedHeaderHeight.value;

        if (scrollY.value < maxY) {
          const delta = Math.abs(scrollY.value - maxY);
          if (delta < wHeight / 2) {
            let yValue = 0;
            if (scrollDirection.value === 'up') {
              yValue = maxY;
            }
            runOnJS(scrollTo)(yValue);
          }
        }
      },
    },
    [scrollTo]
  );

  return {
    scrollHandler,
    collapse,
    expand,
  };
}
