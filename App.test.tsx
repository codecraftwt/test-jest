import React from 'react';
import { render } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Posts storyType="topstories" />);
    // Test that the Posts component renders without crashing
    expect(getByText).toBeDefined();
  });
});
