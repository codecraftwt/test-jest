import React from 'react';
import { render } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

describe('App', () => {
  beforeEach(() => {
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
  });

  it('renders correctly', () => {
    const { getByText } = render(<Posts storyType="topstories" />);
    // Test that the Posts component renders without crashing
    expect(getByText).toBeDefined();
  });
});
