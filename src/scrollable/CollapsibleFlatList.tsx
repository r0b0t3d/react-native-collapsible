import React from 'react';
import type { FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from './useCollapsibleScrollable';
import { renderListHeader } from './HeaderSpacer';

type Props<Data> = Omit<FlatListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

const adapter: ScrollableAdapter = {
  name: 'CollapsibleFlatList',
  scrollTo: (list, offset, animated) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
};

const ignoreScrollToIndexFailed = () => {};

export default function CollapsibleFlatList<Data>(props: Props<Data>) {
  const scrollableProps = useCollapsibleScrollable(adapter, props);

  return (
    // @ts-expect-error animated list types drop the generic item type
    <Animated.FlatList
      onScrollToIndexFailed={ignoreScrollToIndexFailed}
      {...scrollableProps}
      ListHeaderComponent={renderListHeader(props.ListHeaderComponent)}
    />
  );
}
