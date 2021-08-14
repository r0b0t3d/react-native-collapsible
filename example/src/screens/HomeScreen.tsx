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
        title={'CollapsibleList'}
        onPress={navigate('CollapsibleList')}
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
    paddingTop: 50,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
