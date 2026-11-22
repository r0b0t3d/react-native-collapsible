import React from 'react';
import { SectionList, SectionListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from './useCollapsibleScrollable';
import { renderListHeader } from './HeaderSpacer';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

type Props<Data> = Omit<SectionListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

const adapter: ScrollableAdapter = {
  name: 'CollapsibleSectionList',
  scrollToLocation: (list, params) => list?.scrollToLocation(params),
};

const ignoreScrollToIndexFailed = () => {};

export default function CollapsibleSectionList<Data>(props: Props<Data>) {
  const scrollableProps = useCollapsibleScrollable(adapter, props);

  return (
    // @ts-expect-error animated list types drop the generic item type
    <AnimatedSectionList
      onScrollToIndexFailed={ignoreScrollToIndexFailed}
      {...scrollableProps}
      ListHeaderComponent={renderListHeader(props.ListHeaderComponent)}
    />
  );
}
