import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';
import { useRouter, router } from 'expo-router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// expo-router is mocked in jest.setup.js
// fetch is mocked in jest.setup.js
// React Query is mocked in jest.setup.js

const mockPosts = [
  { 
    id: 1, 
    title: 'Post 1', 
    by: 'user1',
    deleted: false,
    dead: false,
    type: 'story' as const,
    time: Date.now(),
    text: 'Some content',
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
    text: 'Some content',
    parent: 0,
    poll: 0,
    kids: [],
    url: '',
    score: 5,
    parts: [],
    descendants: 0
  },
];

describe('Posts Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (useQuery as jest.Mock).mockClear();
    (useInfiniteQuery as jest.Mock).mockClear();
    (router.push as jest.Mock).mockClear();
  });

  it('renders correctly with no posts', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [] },
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isLoading: false,
    });

    render(<Posts storyType="topstories" />);
    await waitFor(() => expect(screen.getByText(/no posts/i)).toBeTruthy());
  });

  it('renders posts list correctly', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPosts.map(p => p.id),
      isLoading: false,
      error: null,
    });
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [mockPosts] },
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isLoading: false,
    });

    const { getByTestId } = render(<Posts storyType="topstories" />);

    // Debug: log what's being rendered
    screen.debug();

    // Try to find all text elements
    const allTexts = screen.getAllByText(/Post \d/);
    expect(allTexts).toHaveLength(2);

    for (const post of mockPosts) {
      expect(screen.getByText(post.title)).toBeTruthy();
    }
  });

  it('navigates to post detail on press', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPosts.map(p => p.id),
      isLoading: false,
      error: null,
    });
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [mockPosts] },
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isLoading: false,
    });

    render(<Posts storyType="topstories" />);
    const postItem = screen.getByText('Post 1');
    fireEvent.press(postItem);
    
    // Wait for async operations
    await waitFor(() => {
      expect(router.push).toHaveBeenCalled();
    });
  });
});
            