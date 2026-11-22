import React, { useMemo } from 'react';
import { FlatListProps, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useCollapsibleScrollable, {
  ScrollableMethods,
  unsupported,
} from './useCollapsibleScrollable';
import CollapsibleListHeader from './CollapsibleListHeader';

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

const methods: ScrollableMethods = {
  scrollTo: (list, offset, animated = true) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
  scrollToLocation: unsupported('CollapsibleFlatList', 'scrollToLocation'),
};

const ignoreScrollToIndexFailed = () => {};

export default function CollapsibleFlatList<Data>({
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
    <Animated.FlatList
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
