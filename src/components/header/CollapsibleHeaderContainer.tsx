/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useMemo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({ children }: Props) {
  const contentKey = useMemo(() => `collapsible-header-${key++}`, []);
  const { mount, unmount, update } = useCollapsibleHeaderContext();

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key,
    };
  }, []);

  const content = useMemo(() => {
    return (
      <View key={contentKey} style={internalStyle} pointerEvents="box-none">
        {children}
      </View>
    );
  }, [children]);

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
