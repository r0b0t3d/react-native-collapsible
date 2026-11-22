import React, { ReactNode, useCallback, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import {
  useCollapsibleContext,
  useInternalCollapsibleContext,
} from './context';

const DEFAULT_KEYBOARD_OFFSET = 20;

type Props = Omit<ViewProps, 'ref' | 'onLayout'> & {
  children: ReactNode;
  KeyboardAvoidingViewComponent?: typeof KeyboardAvoidingView;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  textInputRefs?: any[];
};

function isFocused(ref: any) {
  const focused = ref.current?.isFocused;
  return typeof focused === 'function'
    ? Boolean(focused.call(ref.current))
    : Boolean(focused);
}

export default function CollapsibleContainer({
  children,
  textInputRefs = [],
  keyboardAvoidingViewProps,
  KeyboardAvoidingViewComponent = KeyboardAvoidingView,
  ...props
}: Props) {
  const { containerRef, containerHeight, measureInContainer } =
    useInternalCollapsibleContext();
  const { scrollY, scrollTo } = useCollapsibleContext();
  const avoidsKeyboard = textInputRefs.length > 0;
  const keyboardOffset =
    keyboardAvoidingViewProps?.keyboardVerticalOffset ??
    DEFAULT_KEYBOARD_OFFSET;

  useEffect(() => {
    if (!avoidsKeyboard) {
      return;
    }
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      const focusedRef = textInputRefs.find(isFocused);
      if (!focusedRef) {
        return;
      }
      measureInContainer(focusedRef, (top, height) => {
        const bottom = top + height;
        if (bottom - scrollY.value > containerHeight.value) {
          scrollTo(bottom + keyboardOffset - containerHeight.value);
        }
      });
    });
    return () => subscription.remove();
  }, [
    avoidsKeyboard,
    textInputRefs,
    measureInContainer,
    scrollY,
    scrollTo,
    containerHeight,
    keyboardOffset,
  ]);

  const handleLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      containerHeight.value = layout.height;
    },
    [containerHeight]
  );

  const content = (
    <View
      {...props}
      ref={containerRef}
      style={[styles.container, props.style]}
      collapsable={false}
      onLayout={handleLayout}
    >
      {children}
    </View>
  );

  if (!avoidsKeyboard) {
    return content;
  }
  return (
    <KeyboardAvoidingViewComponent
      style={styles.container}
      behavior="padding"
      {...keyboardAvoidingViewProps}
    >
      {content}
    </KeyboardAvoidingViewComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
