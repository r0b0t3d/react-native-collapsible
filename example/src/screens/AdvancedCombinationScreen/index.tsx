import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  PersistView,
  useCollapsibleContext,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import FlatListTab from './FlatListTab';
import ScrollViewTab from './ScrollViewTab';

enum Tabs {
  FlatList = 'flatlist',
  ScrollView = 'scrollview',
}
function AdvancedCombinationScreen() {
  const [currentTab, setCurrentTab] = useState(Tabs.FlatList);

  const { collapse } = useCollapsibleContext();

  return (
    <CollapsibleContainer style={styles.container}>
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
          <PersistView>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  currentTab === Tabs.FlatList ? styles.tabSelected : {},
                ]}
                onPress={() => setCurrentTab(Tabs.FlatList)}
              >
                <Text>FlatList</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  { marginLeft: 10 },
                  currentTab === Tabs.ScrollView ? styles.tabSelected : {},
                ]}
                onPress={() => setCurrentTab(Tabs.ScrollView)}
              >
                <Text>ScrollView</Text>
              </TouchableOpacity>
            </View>
          </PersistView>
          <View style={{ height: 100, backgroundColor: 'yellow' }} />
          {currentTab === Tabs.FlatList && (
            <View style={styles.searchBox}>
              <TextInput
                placeholder="search"
                onFocus={() => requestAnimationFrame(collapse)}
              />
            </View>
          )}
        </View>
      </CollapsibleHeaderContainer>
      {currentTab === Tabs.FlatList && <FlatListTab />}
      {currentTab === Tabs.ScrollView && <ScrollViewTab />}
    </CollapsibleContainer>
  );
}

export default withCollapsibleContext(AdvancedCombinationScreen);

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
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'white',
  },
  tabSelected: {
    backgroundColor: 'cyan',
  },
});
