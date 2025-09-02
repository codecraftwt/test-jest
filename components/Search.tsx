import React from 'react';
import { View, TextInput, Text } from 'react-native';

export default function Search() {
  return (
    <View testID="search-component">
      <TextInput 
        placeholder="Search..." 
        testID="search-input"
      />
      <Text>Search Component</Text>
    </View>
  );
}
