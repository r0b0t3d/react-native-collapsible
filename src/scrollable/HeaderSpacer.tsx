import React, {
  ComponentType,
  createElement,
  isValidElement,
  ReactElement,
} from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useCollapsibleContext } from '../container/context';

export default function HeaderSpacer() {
  const { headerHeight } = useCollapsibleContext();
  const style = useAnimatedStyle(() => ({ height: headerHeight.value }));
  return <Animated.View style={style} />;
}

export function renderListHeader(
  header?: ComponentType<any> | ReactElement | null
) {
  return (
    <View>
      <HeaderSpacer />
      {isValidElement(header) ? header : header ? createElement(header) : null}
    </View>
  );
}
