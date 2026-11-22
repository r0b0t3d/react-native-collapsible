import React, {
  ComponentType,
  createElement,
  isValidElement,
  ReactElement,
} from 'react';
import { View } from 'react-native';
import AnimatedTopView from '../header/AnimatedTopView';
import useCollapsibleContext from '../../hooks/useCollapsibleContext';

type Props = {
  component?: ComponentType<any> | ReactElement | null;
};

export default function CollapsibleListHeader({ component }: Props) {
  const { headerHeight } = useCollapsibleContext();

  return (
    <View>
      <AnimatedTopView height={headerHeight} />
      {isValidElement(component)
        ? component
        : component
          ? createElement(component)
          : null}
    </View>
  );
}
