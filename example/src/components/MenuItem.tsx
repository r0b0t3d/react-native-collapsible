import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export default function MenuItem({ title, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
        styles.container,
      ]}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A5D3FF',
    height: 50,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
  },
});
