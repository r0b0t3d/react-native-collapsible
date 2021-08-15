import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CollapsibleList from './screens/CollapsibleList';
import CollapsibleViewScreen from './screens/CollapsibleViewScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CollapsibleList" component={CollapsibleList} />
        <Stack.Screen
          name="CollapsibleViewScreen"
          component={CollapsibleViewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
