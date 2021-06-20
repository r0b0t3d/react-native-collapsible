import { CollapsibleFlatList } from '@r0b0t3d/react-native-collapsible';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    <CollapsibleFlatList
      data={data}
      renderItem={renderItem}
      persistHeaderHeight={105}
    />
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
});
