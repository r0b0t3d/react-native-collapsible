import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import useKeyboardShowEvent from '../hooks/useKeyboardShowEvent';
import useInternalCollapsibleContext from '../hooks/useInternalCollapsibleContext';
import useCollapsibleContext from '../hooks/useCollapsibleContext';

type Props = Omit<ViewProps, 'ref' | 'onLayout'> & {
  children: Element;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  textInputRefs?: any[];
};

export default function CollapsibleContainer({
  children,
  keyboardAvoidingViewProps,
  textInputRefs = [],
  ...props
}: Props) {
  const { containerRef, handleContainerHeight } =
    useInternalCollapsibleContext();
  const { scrollY, scrollTo } = useCollapsibleContext();

  const containerHeight = useRef(0);

  useKeyboardShowEvent(() => {
    textInputRefs.some((ref) => {
      const isFocusedFunc = ref.current.isFocused;
      const isFocused =
        isFocusedFunc && typeof isFocusedFunc === 'function'
          ? isFocusedFunc()
          : isFocusedFunc;
      if (isFocused) {
        ref.current.measureLayout(
          // @ts-ignore
          containerRef.current,
          (_left: number, top: number, _width: number, height: number) => {
            if (top + height - scrollY.value > containerHeight.current) {
              const extraOffset =
                keyboardAvoidingViewProps?.keyboardVerticalOffset ?? 20;
              scrollTo(top + height + extraOffset - containerHeight.current);
            }
          },
          () => {}
        );
      }
      return isFocused;
    });
  });

  const handleContainerLayout = useCallback(
    (layout: LayoutChangeEvent) => {
      const height = layout.nativeEvent.layout.height;
      containerHeight.current = height;
      handleContainerHeight(height);
    },
    [handleContainerHeight]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      {...keyboardAvoidingViewProps}
    >
      <View
        {...props}
        ref={containerRef}
        style={[styles.container, props.style]}
        onLayout={handleContainerLayout}
      >
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
