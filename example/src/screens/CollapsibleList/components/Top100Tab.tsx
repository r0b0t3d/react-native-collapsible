import {
  CollapsibleFlatList,
  CollapsibleHeaderContainer,
  StickyView,
  useCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Top100Tab() {
  const { collapse } = useCollapsibleContext();
  const data = useMemo(() => [...Array(20).keys()].map((id) => ({ id })), []);
  const [isLoading, setLoading] = React.useState(true);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 5000);
  }, []);

  const renderItem = ({ index }: any) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.order}>{index + 1}</Text>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZkjvh77-uqnvGnus_qPaNM2yxwdH2ITNCVQ&usqp=CAU',
          }}
          style={styles.songCover}
        />
        <Text style={styles.songName}>{'On My Way'}</Text>
      </View>
    );
  };

  return (
    <>
      <CollapsibleHeaderContainer>
        <View style={styles.headerView} />
        <StickyView>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Looking for..."
              style={styles.search}
              onFocus={() => collapse()}
            />
          </View>
        </StickyView>
      </CollapsibleHeaderContainer>
      <CollapsibleHeaderContainer>
        <View style={styles.headerView} />
        <StickyView>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Looking for..."
              style={styles.search}
              onFocus={() => collapse()}
            />
          </View>
        </StickyView>
      </CollapsibleHeaderContainer>
      <CollapsibleFlatList
        headerSnappable={false}
        data={data}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={handleRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBox: {
    marginHorizontal: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 7,
    paddingVertical: 15,
    paddingHorizontal: 15,
    height: 80,
  },
  search: {
    fontSize: 14,
  },
  songCover: {
    width: 60,
    aspectRatio: 1,
  },
  songName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  order: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 15,
    width: 20,
  },
  headerView: {
    height: 100,
    backgroundColor: 'red',
  },
});
