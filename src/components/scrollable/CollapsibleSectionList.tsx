import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  SectionListProps,
  SectionListScrollParams,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import useAnimatedScroll from './useAnimatedScroll';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import type { CollapsibleProps } from '../../types';
import AnimatedTopView from '../header/AnimatedTopView';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

type Props<Data> = Omit<SectionListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

export default function CollapsibleSectionList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { headerHeight } = useCollapsibleContext();
  const { contentMinHeight, scrollViewRef, fixedHeaderHeight } =
    useInternalCollapsibleContext();
  const mounted = useRef(true);
  const contentHeight = useRef(0);
  const [internalContentMinHeight, setInternalContentMinHeight] = useState(
    contentMinHeight.value
  );
  const [internalProgressViewOffset, setInternalProgressViewOffset] =
    useState(0);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTo = useCallback(() => {
    console.warn('Not supported');
  }, []);

  const scrollToIndex = useCallback(() => {
    console.warn('Not supported');
  }, []);

  const scrollToLocation = useCallback(
    (params: SectionListScrollParams) => {
      scrollViewRef.current?.scrollToLocation(params);
    },
    [scrollViewRef]
  );

  const { scrollHandler } = useAnimatedScroll({
    headerSnappable,
    scrollTo,
    scrollToIndex,
    scrollToLocation,
  });

  const handleInternalContentHeight = useCallback((value: number) => {
    if (mounted.current) {
      setInternalContentMinHeight(value);
    }
  }, []);

  const handleInternalProgressViewOffset = useCallback((value: number) => {
    if (mounted.current) {
      setInternalProgressViewOffset(value);
    }
  }, []);

  useAnimatedReaction(
    () => {
      return contentMinHeight.value;
    },
    (result, previous) => {
      if (result !== previous) {
        if (
          contentHeight.current < result &&
          internalContentMinHeight !== result
        ) {
          runOnJS(handleInternalContentHeight)(result);
        }
      }
    }
  );

  useAnimatedReaction(
    () => {
      return fixedHeaderHeight.value;
    },
    (result, previous) => {
      if (result !== previous) {
        runOnJS(handleInternalProgressViewOffset)(result);
      }
    }
  );

  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      { minHeight: internalContentMinHeight },
      props.contentContainerStyle,
    ],
    [props.contentContainerStyle, internalContentMinHeight]
  );

  const handleContentSizeChange = useCallback((_, height) => {
    contentHeight.current = height;
  }, []);

  const handleScrollToIndexFailed = useCallback(() => {}, []);

  function renderListHeader() {
    return (
      <View>
        <AnimatedTopView height={headerHeight} />
        {props.ListHeaderComponent}
      </View>
    );
  }

  return (
    <AnimatedSectionList
      ref={scrollViewRef}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={1}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      {...props}
      style={[styles.container, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={renderListHeader()}
      onContentSizeChange={handleContentSizeChange}
      //@ts-ignore
      simultaneousHandlers={[]}
      progressViewOffset={internalProgressViewOffset}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flexGrow: 1,
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
