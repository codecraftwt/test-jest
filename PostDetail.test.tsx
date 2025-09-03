import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PostDetail from './components/PostDetail';
import { useRouter } from 'expo-router';

// expo-router is mocked in jest.setup.js

// fetch is mocked in jest.setup.js

const mockPost = {
  id: 1,
  title: 'Post 1',
  by: 'user1',
  content: 'This is **bold** content\n> blockquote',
  kids: [1, 2], // Comment IDs
};

const mockComments = [
  { id: 1, text: 'Nice post!', by: 'user2' },
  { id: 2, text: 'Thanks for sharing', by: 'user3' },
];

describe('PostDetail Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders post details', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPost,
      ok: true,
    });

    render(<PostDetail postId={1} />);

    await waitFor(() => expect(screen.getByText(mockPost.title)).toBeTruthy());
    await waitFor(() => expect(screen.getByText(/This is/i)).toBeTruthy());
  });

  it('renders comments correctly', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPost,
      ok: true,
    });
    // Mock individual comment requests
    for (const comment of mockComments) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => comment,
        ok: true,
      });
    }

    render(<PostDetail postId={1} />);

    for (const comment of mockComments) {
      await waitFor(() => expect(screen.getByText(comment.text)).toBeTruthy());
    }
  });

  it('handles empty comments', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPost,
      ok: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
      ok: true,
    });

    render(<PostDetail postId={1} />);
    await waitFor(() => expect(screen.getByText(/no comments/i)).toBeTruthy());
  });

  it('handles refresh comments', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPost,
      ok: true,
    });
    // Mock individual comment requests for initial load
    for (const comment of mockComments) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => comment,
        ok: true,
      });
    }
    // Mock individual comment requests for refresh
    for (const comment of mockComments) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => comment,
        ok: true,
      });
    }

    const { getByTestId } = render(<PostDetail postId={1} />);
    
    // Wait for the component to load and show the refresh button
    await waitFor(() => expect(getByTestId('refresh-comments')).toBeTruthy());
    
    const refreshButton = getByTestId('refresh-comments');
    fireEvent.press(refreshButton);
    
    // Should have called fetch for initial post + initial comments + refresh comments
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5)); // 1 + 2 + 2
  });
});
