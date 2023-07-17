import React, { ReactNode, useEffect, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import useCollapsibleHeaderConsumerContext from '../../hooks/useCollapsibleHeaderConsumerContext';
import CollapsibleHeaderContainerProvider from './CollapsibleHeaderContainerProvider';

type Props = {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

let key = 0;

export default function CollapsibleHeaderContainer({
  children,
  containerStyle,
}: Props) {
  const originalKey = useMemo(() => key++, []);
  const contentKey = useMemo(
    () => `collapsible-header-${originalKey}`,
    [originalKey]
  );
  const { mount, unmount, update } = useCollapsibleHeaderConsumerContext();

  const internalStyle = useMemo(() => {
    return {
      zIndex: 100000 - key - originalKey,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, originalKey]);

  const content = useMemo(() => {
    return (
      <CollapsibleHeaderContainerProvider
        containerStyle={[internalStyle, containerStyle]}
        contentKey={contentKey}
        key={contentKey}
      >
        {children}
      </CollapsibleHeaderContainerProvider>
    );
  }, [children, containerStyle, contentKey, internalStyle]);

  useEffect(() => {
    mount(contentKey, content);

    return () => {
      unmount(contentKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  useEffect(() => {
    update(contentKey, content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return null;
}
