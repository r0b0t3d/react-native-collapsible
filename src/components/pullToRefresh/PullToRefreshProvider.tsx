import React, { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { PullToRefreshContext } from './usePullToRefreshContext';

type Props = {
  children: React.ReactNode;
};

export default function PullToRefreshProvider({ children }: Props) {
  const refreshValue = useSharedValue(0);
  const internalRefreshing = useSharedValue(false);
  const internalHeight = useSharedValue(0);

  const context = useMemo(() => {
    return {
      refreshValue: refreshValue,
      internalRefreshing,
      internalHeight,
    };
  }, [refreshValue, internalRefreshing, internalHeight]);

  return (
    <PullToRefreshContext.Provider value={context}>
      {children}
    </PullToRefreshContext.Provider>
  );
}
