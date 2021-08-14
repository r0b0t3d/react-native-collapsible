import React, { useCallback } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from 'react-native';
import { useInternalCollapsibleContext } from '../hooks/useInternalCollapsibleContext';

type Props = ViewProps & {
  children: Element;
};

export default function CollapsibleContainer({ children, ...props }: Props) {
  const { containerRef, handleContainerHeight } =
    useInternalCollapsibleContext();

  const handleContainerLayout = useCallback(
    (layout: LayoutChangeEvent) => {
      const height = layout.nativeEvent.layout.height;
      handleContainerHeight(height);
    },
    [handleContainerHeight]
  );

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={handleContainerLayout}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
