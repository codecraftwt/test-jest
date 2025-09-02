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
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockComments,
      ok: true,
    });

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
    const refreshMock = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockPost,
      ok: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockComments,
      ok: true,
    });

    const { getByTestId } = render(<PostDetail postId={1} />);
    const refreshButton = getByTestId('refresh-comments'); // add testID in component

    fireEvent.press(refreshButton);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3)); // initial + comments + refresh
  });
});
