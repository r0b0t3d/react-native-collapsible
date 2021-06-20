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
  CollapsibleHeaderContainer,
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
    <View>
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
          {currentTab === Tabs.FlatList && (
            <View style={styles.searchBox}>
              <TextInput placeholder="search" onFocus={collapse} />
            </View>
          )}
        </View>
      </CollapsibleHeaderContainer>
      {currentTab === Tabs.FlatList && <FlatListTab />}
      {currentTab === Tabs.ScrollView && <ScrollViewTab />}
    </View>
  );
}

export default withCollapsibleContext(AdvancedCombinationScreen);

const styles = StyleSheet.create({
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
    backgroundColor: 'blue',
  },
});
