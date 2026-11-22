import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  StickyView,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import CollapsibleFlashList from '@r0b0t3d/react-native-collapsible/plugins/CollapsibleFlashList';
import CollapsibleLegendList from '@r0b0t3d/react-native-collapsible/plugins/CollapsibleLegendList';

type Item = { id: number };

const ITEM_HEIGHT = 60;

const data: Item[] = [...Array(200).keys()].map((id) => ({ id }));

const keyExtractor = (item: Item) => String(item.id);

const renderItem = ({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>Item {item.id}</Text>
  </View>
);

function PluginListLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { top } = useSafeAreaInsets();

  return (
    <CollapsibleContainer style={styles.container}>
      <CollapsibleHeaderContainer>
        <View style={[styles.header, { paddingTop: top }]} pointerEvents="none">
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <StickyView style={{ paddingTop: top }}>
          <View style={styles.sticky}>
            <Text style={styles.stickyTitle}>Sticky view</Text>
          </View>
        </StickyView>
      </CollapsibleHeaderContainer>
      {children}
    </CollapsibleContainer>
  );
}

export const FlashListScreen = withCollapsibleContext(() => (
  <PluginListLayout title="CollapsibleFlashList">
    <CollapsibleFlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  </PluginListLayout>
));

export const LegendListScreen = withCollapsibleContext(() => (
  <PluginListLayout title="CollapsibleLegendList">
    <CollapsibleLegendList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={ITEM_HEIGHT}
      recycleItems
    />
  </PluginListLayout>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sticky: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#A5D3FF',
  },
  stickyTitle: {
    fontWeight: 'bold',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});
