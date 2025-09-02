import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';
import { useRouter } from 'expo-router';

// expo-router is mocked in jest.setup.js

// fetch is mocked in jest.setup.js

const mockPosts = [
  { id: 1, title: 'Post 1', by: 'user1' },
  { id: 2, title: 'Post 2', by: 'user2' },
];

describe('Posts Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly with no posts', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
      ok: true,
    });

    render(<Posts storyType="topstories" />);
    await waitFor(() => expect(screen.getByText(/no posts/i)).toBeTruthy());
  });

  it('renders posts list correctly', async () => {
    // Mock fetching post IDs
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPosts.map(p => p.id),
      ok: true,
    });

    // Mock fetching each post detail
    for (const post of mockPosts) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => post,
        ok: true,
      });
    }

    render(<Posts storyType="topstories" />);

    for (const post of mockPosts) {
      await waitFor(() => expect(screen.getByText(post.title)).toBeTruthy());
    }
  });

  it('navigates to post detail on press', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPosts.map(p => p.id),
      ok: true,
    });

    for (const post of mockPosts) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => post,
        ok: true,
      });
    }

    render(<Posts storyType="topstories" />);
    const postItem = await waitFor(() => screen.getByText('Post 1'));
    fireEvent.press(postItem);

    expect(mockPush).toHaveBeenCalled();
  });
});
            