import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  CollapsibleFlatList,
  CollapsibleHeaderContainer,
  useCollapsibleContext,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';

function CollapsibleFlatListScreen() {
  const data = useMemo(() => [...Array(5).keys()].map((id) => ({ id })), []);

  const { collapse } = useCollapsibleContext();

  const renderItem = ({ index }: { index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <Text>{`Item-${index}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CollapsibleHeaderContainer>
        <View pointerEvents="box-none">
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2020/03/22/06/57/game-background-4956017_960_720.jpg',
            }}
            style={styles.bannerImage}
            // @ts-ignore
            pointerEvents="none"
          />
          <View style={styles.searchBox}>
            <TextInput
              placeholder="search"
              style={{ flex: 1 }}
              onFocus={collapse}
            />
          </View>
        </View>
      </CollapsibleHeaderContainer>
      <CollapsibleFlatList data={data} renderItem={renderItem} bounces />
    </View>
  );
}

export default withCollapsibleContext(CollapsibleFlatListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'grey',
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
