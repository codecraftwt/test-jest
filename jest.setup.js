// Set up global variables
global.__DEV__ = true;

// Import testing library extensions
require('@testing-library/jest-native/extend-expect');
require('whatwg-fetch');

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  AccessibilityInfo: {
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn(),
    compose: jest.fn((style1, style2) => [style1, style2]),
  },
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  FlatList: ({ data, renderItem, keyExtractor, ...props }) => {
    const React = require('react');
    return React.createElement('View', props, 
      data ? data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return React.createElement(React.Fragment, { key }, renderItem({ item, index }));
      }) : null
    );
  },
  TouchableOpacity: ({ children, onPress, accessibilityRole, ...props }) => {
    const React = require('react');
    return React.createElement('button', { ...props, onClick: onPress, role: accessibilityRole || 'button' }, children);
  },
  TextInput: 'TextInput',
  Image: 'Image',
  Pressable: ({ children, onPress, accessibilityRole, ...props }) => {
    const React = require('react');
    return React.createElement('button', { ...props, onClick: onPress, role: accessibilityRole || 'button' }, children);
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
  },
}));



// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useInfiniteQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({
    prefetchQuery: jest.fn(),
  })),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  router: mockRouter,
}));

jest.mock('expo-constants', () => ({
  expoConfig: {},
  manifest: {},
}));

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
  createURL: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  G: 'G',
  Text: 'Text',
  TSpan: 'TSpan',
  TextPath: 'TextPath',
  Path: 'Path',
  Polygon: 'Polygon',
  Polyline: 'Polyline',
  Line: 'Line',
  Rect: 'Rect',
  Use: 'Use',
  Image: 'Image',
  Symbol: 'Symbol',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
  Pattern: 'Pattern',
  Mask: 'Mask',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Link2: 'Link2',
  MessageSquareText: 'MessageSquareText',
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Suppress React key prop warnings in tests (these are often false positives in test environments)
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: Each child in a list should have a unique "key" prop')
  ) {
    return;
  }
  originalError.call(console, ...args);
};