import { CollapsibleScrollView } from '@r0b0t3d/react-native-collapsible';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {};

export default function ScrollViewTab({}: Props) {
  const data = useMemo(() => [...Array(5).keys()].map((id) => ({ id })), []);

  const renderItem = useCallback((item, index) => {
    return (
      <View key={`${item}-${index}`} style={styles.itemContainer}>
        <Text>{`Item-${index}`}</Text>
      </View>
    );
  }, []);

  return (
    <CollapsibleScrollView persistHeaderHeight={58}>
      {data.map(renderItem)}
    </CollapsibleScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'yellow',
    marginBottom: 20,
    padding: 20,
  },
  bannerImage: {
    height: 200,
  },
  searchBox: {
    marginHorizontal: 20,
    backgroundColor: 'cyan',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
