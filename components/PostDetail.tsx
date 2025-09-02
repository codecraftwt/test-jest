import React from 'react';
import { View, Text } from 'react-native';

interface PostDetailProps {
  postId: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  return (
    <View testID="post-detail">
      <Text>Post Detail for ID: {postId}</Text>
    </View>
  );
}
