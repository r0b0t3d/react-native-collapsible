import {
  CollapsibleHeaderProps,
  CollapsibleHeaderText,
  CollapsibleView,
} from '@r0b0t3d/react-native-collapsible';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {};

export default function CollapsibleViewScreen({}: Props) {
  const renderHeader = useCallback((props: CollapsibleHeaderProps) => {
    return (
      <CollapsibleHeaderText
        {...props}
        title="What is Lorem Ipsum?"
        style={styles.header}
      />
    );
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 80 }}>
      <CollapsibleView
        renderHeader={renderHeader}
        containerStyle={styles.container}
        useDynamicLayout
      >
        <View style={{ backgroundColor: 'cyan', padding: 20 }}>
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
        </View>
      </CollapsibleView>
      <CollapsibleView
        renderHeader={renderHeader}
        containerStyle={styles.container}
        useDynamicLayout
      >
        <View style={{ backgroundColor: 'cyan', padding: 20 }}>
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
        </View>
      </CollapsibleView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'green',
  },
});
