/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import useCollapsibleHeaderContext from '../../hooks/useCollapsibleHeaderContext';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({ children }: Props) {
  const contentKey = useMemo(() => `collapsible-header-${key++}`, []);
  const { mount, unmount, update } = useCollapsibleHeaderContext();

  useEffect(() => {
    mount(contentKey, children);

    return () => {
      unmount(contentKey);
    };
  }, [contentKey]);

  useEffect(() => {
    update(contentKey, children);
  }, [children]);

  return null;
}
