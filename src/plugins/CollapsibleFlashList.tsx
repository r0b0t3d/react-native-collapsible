import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from '../scrollable/useCollapsibleScrollable';
import { renderListHeader } from '../scrollable/HeaderSpacer';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

type Props<Data> = FlashListProps<Data> & CollapsibleProps;

const adapter: ScrollableAdapter = {
  name: 'CollapsibleFlashList',
  scrollTo: (list, offset, animated) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
};

export default function CollapsibleFlashList<Data>(props: Props<Data>) {
  const { style, ...scrollableProps } = useCollapsibleScrollable(
    adapter,
    props
  );

  return (
    <View style={style}>
      {/* @ts-expect-error animated list types drop the generic item type */}
      <AnimatedFlashList
        {...scrollableProps}
        style={props.style}
        contentContainerStyle={props.contentContainerStyle}
        ListHeaderComponent={renderListHeader(props.ListHeaderComponent)}
      />
    </View>
  );
}
