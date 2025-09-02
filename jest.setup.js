require('@testing-library/jest-native/extend-expect');
require('whatwg-fetch');

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ data: null, isLoading: false, error: null })),
  useInfiniteQuery: jest.fn(() => ({ 
    data: { pages: [] }, 
    hasNextPage: false, 
    fetchNextPage: jest.fn(), 
    isLoading: false 
  })),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();