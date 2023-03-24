/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const contentKey = useMemo(() => `collapsible-header-${key++}`, []);
  const { mount, unmount, update } = useCollapsibleHeaderContext();

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key,
    };
  }, []);

  const content = useMemo(() => {
    return (
      <View
        key={contentKey}
        style={[containerStyle, internalStyle]}
        pointerEvents="box-none"
      >
        {children}
      </View>
    );
  }, [children, containerStyle]);

  useEffect(() => {
    mount(contentKey, content);

    return () => {
      unmount(contentKey);
    };
  }, [contentKey]);

  useEffect(() => {
    update(contentKey, content);
  }, [content]);

  return null;
}
