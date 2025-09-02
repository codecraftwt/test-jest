import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import FeedbackForm from './components/FeedbackForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage is mocked in jest.setup.js

describe('FeedbackForm Component', () => {
  beforeEach(() => {
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it('renders form fields correctly', () => {
    render(<FeedbackForm />);
    expect(screen.getByTestId('star-rating')).toBeTruthy();
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeTruthy();
    expect(screen.getByText(/submit/i)).toBeTruthy();
  });

  it('validates star rating is required', async () => {
    render(<FeedbackForm />);
    const submitBtn = screen.getByText(/submit/i);
    fireEvent.press(submitBtn);

    await waitFor(() =>
      expect(screen.getByText(/star rating is required/i)).toBeTruthy()
    );
  });

  it('saves feedback to AsyncStorage on submit', async () => {
    render(<FeedbackForm />);

    const starInput = screen.getByTestId('star-rating');
    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitBtn = screen.getByText(/submit/i);

    fireEvent(starInput, 'change', { nativeEvent: { value: 5 } });
    fireEvent.changeText(commentInput, 'Great app!');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'feedback',
        JSON.stringify({ stars: 5, comment: 'Great app!' })
      );
      expect(screen.getByText(/feedback submitted successfully/i)).toBeTruthy();
    });
  });

  it('loads saved feedback from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ stars: 4, comment: 'Good app' })
    );

    render(<FeedbackForm />);
    await waitFor(() => {
      expect(screen.getByTestId('star-rating').props.value).toBe(4);
      expect(screen.getByPlaceholderText(/write a comment/i).props.value).toBe('Good app');
    });
  });

  it('displays error message if AsyncStorage fails', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    render(<FeedbackForm />);
    const starInput = screen.getByTestId('star-rating');
    fireEvent(starInput, 'change', { nativeEvent: { value: 5 } });
    const submitBtn = screen.getByText(/submit/i);
    fireEvent.press(submitBtn);

    await waitFor(() => expect(screen.getByText(/failed to save feedback/i)).toBeTruthy());
  });
});
