import React, { ReactNode } from 'react';
import { RefreshControl, ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../types';
import useCollapsibleScrollable, {
  ScrollableAdapter,
} from './useCollapsibleScrollable';
import HeaderSpacer from './HeaderSpacer';

type Props = ScrollViewProps &
  CollapsibleProps & {
    children?: ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
  };

const adapter: ScrollableAdapter = {
  name: 'CollapsibleScrollView',
  scrollTo: (scrollView, y, animated) => scrollView?.scrollTo({ y, animated }),
};

export default function CollapsibleScrollView({
  children,
  refreshing = false,
  onRefresh,
  ...props
}: Props) {
  const { progressViewOffset, ...scrollableProps } = useCollapsibleScrollable(
    adapter,
    props
  );

  return (
    <Animated.ScrollView
      refreshControl={
        onRefresh ? (
          <RefreshControl
            progressViewOffset={progressViewOffset}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      {...scrollableProps}
    >
      <HeaderSpacer />
      {children}
    </Animated.ScrollView>
  );
}
