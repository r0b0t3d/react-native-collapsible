/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import useKeyboardShowEvent from '../hooks/useKeyboardShowEvent';
import useInternalCollapsibleContext from '../hooks/useInternalCollapsibleContext';
import useCollapsibleContext from '../hooks/useCollapsibleContext';
import CollapsibleHeaderConsumer from './header/CollapsibleHeaderConsumer';

type Props = Omit<ViewProps, 'ref' | 'onLayout'> & {
  children: React.ReactNode;
  KeyboardAvoidingViewComponent?: typeof KeyboardAvoidingView;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  textInputRefs?: any[];
};

function CollapsibleContainer({
  children,
  KeyboardAvoidingViewComponent = KeyboardAvoidingView,
  keyboardAvoidingViewProps,
  textInputRefs = [],
}: Props) {
  const { containerHeight, containerRef } = useInternalCollapsibleContext();
  const { scrollY, scrollTo } = useCollapsibleContext();

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
            if (top + height - scrollY.value > containerHeight.value) {
              const extraOffset =
                keyboardAvoidingViewProps?.keyboardVerticalOffset ?? 20;
              scrollTo(top + height + extraOffset - containerHeight.value);
            }
          },
          () => {}
        );
      }
      return isFocused;
    });
  });

  return (
    <KeyboardAvoidingViewComponent
      style={styles.container}
      behavior="padding"
      {...keyboardAvoidingViewProps}
    >
      {children}
    </KeyboardAvoidingViewComponent>
  );
}

export default function CollapsibleContainerWrapper({
  children,
  textInputRefs,
  keyboardAvoidingViewProps,
  KeyboardAvoidingViewComponent,
  ...props
}: Props) {
  const { containerHeight, containerRef } = useInternalCollapsibleContext();

  useLayoutEffect(() => {
    const { height } = containerRef.current.getBoundingClientRect();
    containerHeight.value = height;
  }, []);

  function renderContent() {
    return (
      <View
        {...props}
        ref={containerRef}
        style={[styles.container, props.style]}
        collapsable={false}
      >
        <CollapsibleHeaderConsumer>{children}</CollapsibleHeaderConsumer>
      </View>
    );
  }

  if (textInputRefs && textInputRefs.length > 0) {
    return (
      <CollapsibleContainer
        textInputRefs={textInputRefs}
        keyboardAvoidingViewProps={keyboardAvoidingViewProps}
        KeyboardAvoidingViewComponent={KeyboardAvoidingViewComponent}
      >
        {renderContent()}
      </CollapsibleContainer>
    );
  }
  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
