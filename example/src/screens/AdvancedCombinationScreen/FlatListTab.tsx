import {
  CollapsibleFlatList,
  CollapsibleHeaderContainer,
  PersistView,
} from '@r0b0t3d/react-native-collapsible';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {};

export default function FlatListTab({}: Props) {
  const data = useMemo(() => [...Array(5).keys()].map((id) => ({ id })), []);

  const renderItem = useCallback(({ index }) => {
    return (
      <View style={styles.itemContainer}>
        <Text>{`Item-${index}`}</Text>
      </View>
    );
  }, []);

  return (
    <>
      <CollapsibleHeaderContainer>
        <View style={styles.banner} />
        <PersistView>
          <View style={styles.searchBox}>
            <TextInput placeholder="search" />
          </View>
        </PersistView>
      </CollapsibleHeaderContainer>
      <CollapsibleFlatList data={data} renderItem={renderItem} />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'grey',
    marginBottom: 20,
    padding: 20,
  },
  searchBox: {
    marginHorizontal: 20,
    backgroundColor: 'cyan',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  banner: { height: 100, backgroundColor: 'yellow', marginBottom: 10 },
});
