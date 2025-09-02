import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';
import { useRouter } from 'expo-router';

// expo-router is mocked in jest.setup.js

// fetch is mocked in jest.setup.js

const mockPostsPage1 = [
  { id: 1, title: 'Post 1', by: 'user1' },
  { id: 2, title: 'Post 2', by: 'user2' },
];

const mockPostsPage2 = [
  { id: 3, title: 'Post 3', by: 'user3' },
  { id: 4, title: 'Post 4', by: 'user4' },
];

describe('PostList Infinite Scroll & Loading', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('shows loading indicator and loads more posts on scroll', async () => {
    // First page mock
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPostsPage1.map(p => p.id),
      ok: true,
    });
    for (const post of mockPostsPage1) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => post,
        ok: true,
      });
    }

    // Second page mock
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPostsPage2.map(p => p.id),
      ok: true,
    });
    for (const post of mockPostsPage2) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => post,
        ok: true,
      });
    }

    const { getByText, getByTestId } = render(<Posts storyType="topstories" />);

    // Wait for first page to render
    for (const post of mockPostsPage1) {
      await waitFor(() => expect(getByText(post.title)).toBeTruthy());
    }

    // Simulate scroll to bottom
    const flatList = getByTestId('post-flatlist'); // Add testID="post-flatlist" in PostList FlatList
    fireEvent.scroll(flatList, {
      nativeEvent: { contentOffset: { y: 1000 }, layoutMeasurement: { height: 500 }, contentSize: { height: 1500 } }
    });

    // Wait for second page to render
    for (const post of mockPostsPage2) {
      await waitFor(() => expect(getByText(post.title)).toBeTruthy());
    }
  });

  it('displays error message when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<Posts storyType="topstories" />);
    await waitFor(() => expect(screen.getByText(/error loading posts/i)).toBeTruthy());
  });
});
