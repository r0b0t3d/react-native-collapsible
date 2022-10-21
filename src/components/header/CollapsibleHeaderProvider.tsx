/* eslint-disable no-shadow */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CollapsibleHeaderContext,
  HeaderItem,
} from '../../hooks/useCollapsibleHeaderContext';

export default function CollapsibleHeaderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const mounted = useRef(false);

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

  return (
    <CollapsibleHeaderContext.Provider value={context}>
      {children}
    </CollapsibleHeaderContext.Provider>
  );
}
