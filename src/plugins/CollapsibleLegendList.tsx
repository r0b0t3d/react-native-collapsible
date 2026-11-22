import React from 'react';
import { FlatListProps, View } from 'react-native';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from '../scrollable/useCollapsibleScrollable';
import { renderListHeader } from '../scrollable/HeaderSpacer';

type Props<Data> = FlatListProps<Data> & CollapsibleProps;

const adapter: ScrollableAdapter = {
  name: 'CollapsibleLegendList',
  scrollTo: (list, offset, animated) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
};

export default function CollapsibleLegendList<Data>(props: Props<Data>) {
  const { style, ...scrollableProps } = useCollapsibleScrollable(
    adapter,
    props
  );

  return (
    <View style={style}>
      {/* @ts-expect-error animated list types drop the generic item type */}
      <AnimatedLegendList
        {...scrollableProps}
        style={props.style}
        contentContainerStyle={props.contentContainerStyle}
        ListHeaderComponent={renderListHeader(props.ListHeaderComponent)}
      />
    </View>
  );
}
