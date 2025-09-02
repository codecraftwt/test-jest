import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Posts } from './components/posts/Posts';

describe('Accessibility Tests', () => {
  it('PostList items have accessible roles and labels', async () => {
    render(<Posts storyType="topstories" />);

    const list = screen.getByTestId('post-flatlist');
    expect(list.props.accessibilityRole).toBe('list');

    // If individual post items have accessibilityLabel
    // Example: <View accessibilityLabel={`Post by ${post.by}`} />
    const postItem = await screen.findByLabelText(/Post by/i);
    expect(postItem).toBeTruthy();
  });

  it('Buttons have accessibilityRole="button"', () => {
    render(<Posts storyType="topstories" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn.props.accessibilityRole).toBe('button'));
  });
});
