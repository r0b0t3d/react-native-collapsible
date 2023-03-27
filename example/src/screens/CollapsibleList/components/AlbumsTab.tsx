import { CollapsibleScrollView } from '@r0b0t3d/react-native-collapsible';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {};

export default function AlbumsTab({}: Props) {
  const data = useMemo(() => [...Array(20).keys()].map((id) => ({ id })), []);

  function renderItem(item: any) {
    return (
      <View style={styles.itemContainer} key={item.id}>
        <Image
          source={{
            uri: 'https://c-cl.cdn.smule.com/rs-s47/arr/9c/41/bde657bd-960c-4da9-94d0-f261115b675a.jpg',
          }}
          style={styles.image}
        />
        <View style={styles.itemOverlay}>
          <Text style={styles.albumName}>Different World</Text>
          <Text style={styles.albumYear}>2018</Text>
        </View>
      </View>
    );
  }

  return <CollapsibleScrollView>{data.map(renderItem)}</CollapsibleScrollView>;
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    flex: 1,
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  albumName: {
    color: 'white',
    fontWeight: 'bold',
  },
  albumYear: {
    color: 'white',
  },
});
