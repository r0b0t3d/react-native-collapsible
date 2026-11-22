import React, { useMemo } from 'react';
import { StyleSheet, SectionList, SectionListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useCollapsibleScrollable, {
  ScrollableMethods,
  unsupported,
} from './useCollapsibleScrollable';
import CollapsibleListHeader from './CollapsibleListHeader';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

type Props<Data> = Omit<SectionListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

const methods: ScrollableMethods = {
  scrollTo: unsupported('CollapsibleSectionList', 'scrollTo'),
  scrollToIndex: unsupported('CollapsibleSectionList', 'scrollToIndex'),
  scrollToLocation: (list, params) => list?.scrollToLocation(params),
};

const ignoreScrollToIndexFailed = () => {};

export default function CollapsibleSectionList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const {
    scrollableProps,
    scrollHandler,
    progressViewOffset,
    contentMinHeight,
  } = useCollapsibleScrollable(methods, headerSnappable);

  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      { minHeight: contentMinHeight },
      props.contentContainerStyle,
    ],
    [props.contentContainerStyle, contentMinHeight]
  );

  return (
    // @ts-ignore
    <AnimatedSectionList
      {...scrollableProps}
      onScrollToIndexFailed={ignoreScrollToIndexFailed}
      {...props}
      style={[StyleSheet.absoluteFill, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      ListHeaderComponent={
        <CollapsibleListHeader component={props.ListHeaderComponent} />
      }
      progressViewOffset={progressViewOffset}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
