import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Search from './components/Search';
import { useRouter } from 'expo-router';

// expo-router is mocked in jest.setup.js

// fetch is mocked in jest.setup.js

const mockResults = [
  { id: 1, title: 'React Native Test', by: 'user1' },
  { id: 2, title: 'Expo Test', by: 'user2' },
];

describe('Search Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders search input', () => {
    render(<Search />);
    expect(screen.getByPlaceholderText(/search/i)).toBeTruthy();
  });

  it('fetches and displays search results', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResults.map(r => r.id),
      ok: true,
    });
    for (const result of mockResults) {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => result,
        ok: true,
      });
    }

    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.changeText(input, 'React');

    await waitFor(() => {
      for (const result of mockResults) {
        expect(screen.getByText(result.title)).toBeTruthy();
      }
    });
  });

  it('handles empty search results gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
      ok: true,
    });

    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.changeText(input, 'Nothing');

    await waitFor(() => expect(screen.getByText(/no results/i)).toBeTruthy());
  });

  it('handles search fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<Search />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.changeText(input, 'React');

    await waitFor(() => expect(screen.getByText(/error fetching results/i)).toBeTruthy());
  });
});
