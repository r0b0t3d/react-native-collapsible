import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CollapsibleList from './screens/CollapsibleList';
import CollapsibleViewScreen from './screens/CollapsibleViewScreen';
import { FlashListScreen, LegendListScreen } from './screens/PluginListScreens';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="CollapsibleList" component={CollapsibleList} />
          <Stack.Screen
            name="CollapsibleViewScreen"
            component={CollapsibleViewScreen}
          />
          <Stack.Screen name="FlashListScreen" component={FlashListScreen} />
          <Stack.Screen name="LegendListScreen" component={LegendListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
