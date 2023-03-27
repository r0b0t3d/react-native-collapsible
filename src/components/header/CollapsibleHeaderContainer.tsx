/* eslint-disable react-hooks/exhaustive-deps */
import type { StyleProp, ViewStyle } from 'react-native';
import React, { Fragment, ReactNode, useEffect, useMemo } from 'react';
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

  const content = useMemo(() => {
    return <Fragment key={contentKey}>{children}</Fragment>;
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
