import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableMethods,
  unsupported,
} from '../components/scrollable/useCollapsibleScrollable';
import CollapsibleListHeader from '../components/scrollable/CollapsibleListHeader';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

type Props<Data> = FlashListProps<Data> & CollapsibleProps;

const methods: ScrollableMethods = {
  scrollTo: (list, offset, animated = true) =>
    list?.scrollToOffset({ offset, animated }),
  scrollToIndex: (list, params) => list?.scrollToIndex(params),
  scrollToLocation: unsupported('CollapsibleFlashList', 'scrollToLocation'),
};

export default function CollapsibleFlashList<Data>({
  headerSnappable = true,
  ...props
}: Props<Data>) {
  const { scrollableProps, scrollHandler, progressViewOffset } =
    useCollapsibleScrollable(methods, headerSnappable);

  return (
    <View style={[StyleSheet.absoluteFill, props.style]}>
      {/* @ts-ignore */}
      <AnimatedFlashList
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
