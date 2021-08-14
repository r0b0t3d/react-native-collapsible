/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import useCollapsibleContext from './useCollapsibleContext';
import { useInternalCollapsibleContext } from './useInternalCollapsibleContext';

const { height: wHeight } = Dimensions.get('window');

type Props = {
  headerSnappable: boolean;
  scrollTo: (yValue: number, animated?: boolean) => void;
};

export default function useAnimatedScroll({
  headerSnappable,
  scrollTo,
}: Props) {
  const scrollDirection = useSharedValue('unknown');
  const { scrollY } = useCollapsibleContext();
  const { setCollapsibleHandlers, firstStickyViewY, fixedHeaderHeight } =
    useInternalCollapsibleContext();

  useEffect(() => {
    if (scrollY.value > 0) {
      requestAnimationFrame(() => scrollTo(scrollY.value, false));
    }
  }, []);

  const collapse = useCallback(() => {
    scrollTo(
      Math.min(fixedHeaderHeight.current || 0, firstStickyViewY.current || 0)
    );
  }, [scrollTo, fixedHeaderHeight.current, firstStickyViewY.current]);

  const expand = useCallback(() => scrollTo(0), [scrollTo]);

  useEffect(() => {
    setCollapsibleHandlers({
      collapse,
      expand,
      scrollTo,
    });
  }, [setCollapsibleHandlers, collapse, expand, scrollTo]);

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
        const maxY =
          firstStickyViewY.current && firstStickyViewY.current > 0
            ? firstStickyViewY.current
            : fixedHeaderHeight.current || 0;

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
    [firstStickyViewY.current, fixedHeaderHeight.current]
  );

  return {
    scrollHandler,
    collapse,
    expand,
  };
}
