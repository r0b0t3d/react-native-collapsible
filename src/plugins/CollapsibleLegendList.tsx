import React from 'react';
import { View, StyleSheet, FlatListProps } from 'react-native';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableMethods,
  unsupported,
} from '../components/scrollable/useCollapsibleScrollable';
import CollapsibleListHeader from '../components/scrollable/CollapsibleListHeader';

type Props<Data> = FlatListProps<Data> & CollapsibleProps;

const methods: ScrollableMethods = {
  scrollTo: (list, offset, animated = true) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
  scrollToLocation: unsupported('CollapsibleLegendList', 'scrollToLocation'),
};

export default function CollapsibleLegendList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { scrollableProps, scrollHandler, progressViewOffset } =
    useCollapsibleScrollable(methods, headerSnappable);

  return (
    <View style={[StyleSheet.absoluteFill, props.style]}>
      {/* @ts-ignore */}
      <AnimatedLegendList
        {...scrollableProps}
        {...props}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <CollapsibleListHeader component={props.ListHeaderComponent} />
        }
        progressViewOffset={progressViewOffset}
      />
    </View>
  );
}
