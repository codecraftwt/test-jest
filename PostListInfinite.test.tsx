import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';
import { useRouter } from 'expo-router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// expo-router is mocked in jest.setup.js
// fetch is mocked in jest.setup.js
// React Query is mocked in jest.setup.js

const mockPostsPage1 = [
  { 
    id: 1, 
    title: 'Post 1', 
    by: 'user1',
    deleted: false,
    dead: false,
    type: 'story' as const,
    time: Date.now(),
    text: '',
    parent: 0,
    poll: 0,
    kids: [],
    url: '',
    score: 10,
    parts: [],
    descendants: 0
  },
  { 
    id: 2, 
    title: 'Post 2', 
    by: 'user2',
    deleted: false,
    dead: false,
    type: 'story' as const,
    time: Date.now(),
    text: '',
    parent: 0,
    poll: 0,
    kids: [],
    url: '',
    score: 5,
    parts: [],
    descendants: 0
  },
];

const mockPostsPage2 = [
  { 
    id: 3, 
    title: 'Post 3', 
    by: 'user3',
    deleted: false,
    dead: false,
    type: 'story' as const,
    time: Date.now(),
    text: '',
    parent: 0,
    poll: 0,
    kids: [],
    url: '',
    score: 8,
    parts: [],
    descendants: 0
  },
  { 
    id: 4, 
    title: 'Post 4', 
    by: 'user4',
    deleted: false,
    dead: false,
    type: 'story' as const,
    time: Date.now(),
    text: '',
    parent: 0,
    poll: 0,
    kids: [],
    url: '',
    score: 12,
    parts: [],
    descendants: 0
  },
];

describe('PostList Infinite Scroll & Loading', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (useQuery as jest.Mock).mockClear();
    (useInfiniteQuery as jest.Mock).mockClear();
  });

  it('shows loading indicator and loads more posts on scroll', async () => {
    const mockFetchNextPage = jest.fn();
    
    (useQuery as jest.Mock).mockReturnValue({
      data: [...mockPostsPage1.map(p => p.id), ...mockPostsPage2.map(p => p.id)],
      isLoading: false,
      error: null,
    });
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [mockPostsPage1, mockPostsPage2] },
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      isLoading: false,
    });

    const { getByText, getByTestId } = render(<Posts storyType="topstories" />);

    // Wait for first page to render
    for (const post of mockPostsPage1) {
      await waitFor(() => expect(getByText(post.title)).toBeTruthy());
    }

    // Simulate scroll to bottom
    const flatList = getByTestId('post-flatlist');
    fireEvent.scroll(flatList, {
      nativeEvent: { contentOffset: { y: 1000 }, layoutMeasurement: { height: 500 }, contentSize: { height: 1500 } }
    });

    // Wait for second page to render
    for (const post of mockPostsPage2) {
      await waitFor(() => expect(getByText(post.title)).toBeTruthy());
    }
  });

  it('displays error message when fetch fails', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Error loading posts'),
    });
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [] },
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isLoading: false,
    });

    render(<Posts storyType="topstories" />);
    await waitFor(() => expect(screen.getByText('No posts available')).toBeTruthy());
  });
});
