import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { CollapsibleHeaderConsumerContext } from '../../hooks/useCollapsibleHeaderConsumerContext';
import useInternalCollapsibleContext from '../../hooks/useInternalCollapsibleContext';
import { withTiming } from 'react-native-reanimated';

export type HeaderItem = { key: string; children: ReactNode };

export default function CollapsibleHeaderConsumer({
  children,
}: {
  children: ReactNode;
}) {
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const mounted = useRef(false);
  const { fixedHeaderHeight, headerHeight } = useInternalCollapsibleContext();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const mount = useCallback((key: string, children: ReactNode) => {
    setHeaders((prev) => [...prev, { key, children }]);
  }, []);

  const unmount = useCallback((key: string) => {
    setHeaders((prev) => prev.filter((h) => h.key !== key));
  }, []);

  const update = useCallback((key: string, children: ReactNode) => {
    if (!mounted.current) {
      return;
    }
    setHeaders((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            children,
          };
        }
        return item;
      })
    );
  }, []);

  const context = useMemo(
    () => ({
      headers,
      mount,
      unmount,
      update,
    }),
    [headers, mount, unmount, update]
  );

  const handleLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const { height } = layout;
      headerHeight.value = withTiming(height, {
        duration: fixedHeaderHeight.value === 0 ? 0 : 10,
      });
      fixedHeaderHeight.value = height;
    },
    [headerHeight, fixedHeaderHeight]
  );

  return (
    <CollapsibleHeaderConsumerContext.Provider value={context}>
      {children}
      <View
        style={styles.container}
        pointerEvents="box-none"
        onLayout={handleLayout}
      >
        {headers.map((item) => item.children)}
      </View>
    </CollapsibleHeaderConsumerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
});
