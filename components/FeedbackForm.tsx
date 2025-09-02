import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function FeedbackForm() {
  return (
    <View testID="feedback-form">
      <Text>Star Rating</Text>
      <View testID="star-rating" />
      <TextInput 
        placeholder="Write a comment..." 
        testID="comment-input"
      />
      <TouchableOpacity testID="submit-button">
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
