import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FeedbackForm() {
  const [stars, setStars] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ stars?: string; comment?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load saved feedback on component mount
    const loadSavedFeedback = async () => {
      try {
        const savedFeedback = await AsyncStorage.getItem('feedback');
        if (savedFeedback) {
          const { stars: savedStars, comment: savedComment } = JSON.parse(savedFeedback);
          setStars(savedStars || 0);
          setComment(savedComment || '');
        }
      } catch (error) {
        console.error('Error loading saved feedback:', error);
      }
    };

    loadSavedFeedback();
  }, []);

  const handleStarPress = (rating: number) => {
    setStars(rating);
    if (errors.stars) {
      setErrors(prev => ({ ...prev, stars: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: { stars?: string; comment?: string } = {};

    if (stars === 0) {
      newErrors.stars = 'Star rating is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const feedback = { stars, comment };
      await AsyncStorage.setItem('feedback', JSON.stringify(feedback));
      setSuccessMessage('Feedback submitted successfully');
      setErrors({});
    } catch (error) {
      setErrors({ comment: 'Failed to save feedback' });
    }
  };

  const renderStars = () => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 8 }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => handleStarPress(rating)}
            style={{ marginRight: 8 }}
          >
            <Text style={{ fontSize: 24, color: rating <= stars ? '#FFD700' : '#DDD' }}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View testID="feedback-form" style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Star Rating</Text>
      <View testID="star-rating" value={stars}>
        {renderStars()}
      </View>
      {errors.stars && (
        <Text style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>{errors.stars}</Text>
      )}

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
        Comment
      </Text>
      <TextInput 
        placeholder="Write a comment..." 
        testID="comment-input"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        style={{ 
          borderWidth: 1, 
          borderColor: '#ccc', 
          padding: 12, 
          borderRadius: 8,
          textAlignVertical: 'top'
        }}
      />

      <TouchableOpacity 
        testID="submit-button"
        onPress={handleSubmit}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 16, 
          borderRadius: 8, 
          marginTop: 16,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>

      {successMessage && (
        <Text style={{ color: 'green', fontSize: 16, marginTop: 16, textAlign: 'center' }}>
          {successMessage}
        </Text>
      )}

      {errors.comment && (
        <Text style={{ color: 'red', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
          {errors.comment}
        </Text>
      )}
    </View>
  );
}
