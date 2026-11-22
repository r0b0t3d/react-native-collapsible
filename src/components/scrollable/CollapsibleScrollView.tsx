import React, { ReactNode, useMemo } from 'react';
import {
  RefreshControl,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import type { CollapsibleProps } from '../../types';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';
import AnimatedTopView from '../header/AnimatedTopView';
import useCollapsibleScrollable, {
  ScrollableMethods,
  unsupported,
} from './useCollapsibleScrollable';

type Props = ScrollViewProps &
  CollapsibleProps & {
    children?: ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
  };

const methods: ScrollableMethods = {
  scrollTo: (scrollView, y, animated = true) =>
    scrollView?.scrollTo({ y, animated }),
  scrollToIndex: unsupported('CollapsibleScrollView', 'scrollToIndex'),
  scrollToLocation: unsupported('CollapsibleScrollView', 'scrollToLocation'),
};

export default function CollapsibleScrollView({
  headerSnappable = true,
  children,
  refreshing = false,
  onRefresh,
  ...props
}: Props) {
  const { headerHeight } = useCollapsibleContext();
  const {
    scrollableProps,
    scrollHandler,
    progressViewOffset,
    contentMinHeight,
  } = useCollapsibleScrollable(methods, headerSnappable);

  const contentContainerStyle = useMemo(
    () => [styles.contentContainer, props.contentContainerStyle],
    [props.contentContainerStyle]
  );

  return (
    <Animated.ScrollView
      {...scrollableProps}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            progressViewOffset={progressViewOffset}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      {...props}
      style={[StyleSheet.absoluteFill, props.style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
    >
      <View style={{ minHeight: contentMinHeight }}>
        <AnimatedTopView height={headerHeight} />
        {children}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
