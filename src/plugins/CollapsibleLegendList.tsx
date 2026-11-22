import React from 'react';
import {
  AnimatedLegendList,
  AnimatedLegendListProps,
} from '@legendapp/list/reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from '../scrollable/useCollapsibleScrollable';
import { renderListHeader } from '../scrollable/HeaderSpacer';

type Props<Data> = Omit<AnimatedLegendListProps<Data>, 'scrollEnabled'> &
  CollapsibleProps;

const adapter: ScrollableAdapter = {
  name: 'CollapsibleLegendList',
  scrollTo: (list, offset, animated) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
};

export default function CollapsibleLegendList<Data>(props: Props<Data>) {
  const scrollableProps = useCollapsibleScrollable(adapter, props);

  return (
    <AnimatedLegendList
      {...scrollableProps}
      ListHeaderComponent={renderListHeader(props.ListHeaderComponent)}
    />
  );
}
