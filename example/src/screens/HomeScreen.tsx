import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import MenuItem from '../components/MenuItem';

type Props = {};

export default function Home({}: Props) {
  const navigation = useNavigation();

  const navigate = useCallback(
    (screen: string) => () => {
      // @ts-ignore
      navigation.navigate(screen);
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <MenuItem
        title={'CollapsibleFlatList'}
        onPress={navigate('CollapsibleFlatListScreen')}
      />
      <MenuItem
        title={'CollapsibleScrollView'}
        onPress={navigate('CollapsibleScrollViewScreen')}
      />
      <MenuItem
        title={'Advanced combination'}
        onPress={navigate('AdvancedCombinationScreen')}
      />
      <MenuItem
        title={'CollapsibleView'}
        onPress={navigate('CollapsibleViewScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
