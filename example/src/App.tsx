import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CollapsibleFlatListScreen from './screens/CollapsibleFlatListScreen';
import CollapsibleScrollViewScreen from './screens/CollapsibleScrollViewScreen';
import AdvancedCombinationScreen from './screens/AdvancedCombinationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="CollapsibleFlatListScreen"
          component={CollapsibleFlatListScreen}
        />
        <Stack.Screen
          name="CollapsibleScrollViewScreen"
          component={CollapsibleScrollViewScreen}
        />
        <Stack.Screen
          name="AdvancedCombinationScreen"
          component={AdvancedCombinationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
