import React, { useRef, useState } from 'react';
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
  CollapsibleHeaderText,
  CollapsibleView,
  StickyView,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import Top100Tab from './components/Top100Tab';
import AlbumsTab from './components/AlbumsTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CollapsibleList() {
  const [currentTab, setCurrentTab] = useState(0);
  const { top } = useSafeAreaInsets();
  const textInput = useRef(null);

  function renderHeder(props: any) {
    return <CollapsibleHeaderText title="Collapsible view" {...props} />;
  }

  return (
    <View style={styles.container}>
      <CollapsibleContainer
        style={styles.contentContainer}
        textInputRefs={[textInput]}
      >
        <CollapsibleHeaderContainer>
          <View pointerEvents="box-none" style={styles.infoContainer}>
            <View style={styles.backgroundTop} />
            <Image
              source={{
                uri: 'https://pbs.twimg.com/profile_images/378800000806904695/6933c86eecd26a7eca28797ebf9bf59f.jpeg',
              }}
              style={styles.profileImage}
              // @ts-ignore
              pointerEvents="none"
            />
            <Text style={styles.name}>Alan Walker</Text>
          </View>
          <CollapsibleView renderHeader={renderHeder}>
            <View style={styles.collapsibleView} pointerEvents="box-none">
              <TextInput
                ref={textInput}
                placeholder="Avoiding keyboard textinput"
              />
            </View>
          </CollapsibleView>
          <StickyView style={{ paddingTop: top }}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, currentTab === 0 ? styles.tabSelected : {}]}
                onPress={() => setCurrentTab(0)}
              >
                <Text
                  style={[
                    styles.tabTitle,
                    currentTab === 0 ? styles.tabTitleSelected : {},
                  ]}
                >
                  TOP 100
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, currentTab === 1 ? styles.tabSelected : {}]}
                onPress={() => setCurrentTab(1)}
              >
                <Text
                  style={[
                    styles.tabTitle,
                    currentTab === 1 ? styles.tabTitleSelected : {},
                  ]}
                >
                  ALBUMS
                </Text>
              </TouchableOpacity>
            </View>
          </StickyView>
        </CollapsibleHeaderContainer>
        {currentTab === 0 && <Top100Tab />}
        {currentTab === 1 && <AlbumsTab />}
      </CollapsibleContainer>
    </View>
  );
}

export default withCollapsibleContext(CollapsibleList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#713D7C',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '85%',
    backgroundColor: '#713D7C',
  },
  infoContainer: {
    height: 200,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
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
    height: 40,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabSelected: {
    borderColor: '#7339B3',
  },
  tabTitle: {
    fontWeight: 'bold',
    color: '#ACAEB0',
  },
  tabTitleSelected: {
    color: '#7339B3',
  },
  collapsibleView: {
    height: 500,
    backgroundColor: 'yellow',
    justifyContent: 'flex-end',
  },
});
