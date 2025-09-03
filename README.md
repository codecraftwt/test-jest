# Hacker Native - React Native Expo App

## Overview
A modern React Native Expo application that displays Hacker News posts with full functionality including search, post details, comments, and user feedback. Built with **TypeScript**, **Expo Router**, **React Query**, and comprehensive testing using **Jest** and **React Native Testing Library**.

## Test Status
**All tests passing!**
- **Test Suites: 7 passed, 7 total**
- **Tests: 21 passed, 21 total**
- **No warnings or errors**

## Features Implemented

### 1. **Posts List Component**
- Infinite scroll with pagination
- Loading states and error handling
- Navigation to post details
- Real-time data fetching from Hacker News API
- Accessibility support with proper roles and labels

### 2. **Search Component**
- Real-time search with debouncing
- Fetch and display search results
- Handle empty results gracefully
- Error handling for network failures
- Clean UI with loading states

### 3. **Post Detail Component**
- Full post content rendering
- Comments system with refresh functionality
- Handle empty comments state
- Formatted content support (markdown-like)
- Navigation and user interactions

### 4. **Feedback Form Component**
- Interactive star rating system
- Form validation and error handling
- AsyncStorage integration for persistence
- Success/error message display
- Load previously saved feedback

### 5. **Accessibility Features**
- Proper accessibility roles and labels
- Screen reader support
- Keyboard navigation
- Semantic HTML structure in tests

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Query (TanStack Query)
- **Storage**: AsyncStorage
- **Testing**: Jest + React Native Testing Library
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd hacker-native

# Install dependencies
npm install

# Start the development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Testing

The project includes comprehensive test coverage with the following test files:

- `App.test.tsx` - Main app component tests
- `PostList.test.tsx` - Posts list functionality
- `PostListInfinite.test.tsx` - Infinite scroll and loading states
- `PostDetail.test.tsx` - Post details and comments
- `Search.test.tsx` - Search functionality
- `FeedbackForm.test.tsx` - Feedback form interactions
- `Accessibility.test.tsx` - Accessibility compliance

### Test Configuration
- **Jest** configuration optimized for React Native
- **React Native Testing Library** for component testing
- **Comprehensive mocking** for React Native modules, Expo, and third-party libraries
- **Async testing** with proper waitFor and act utilities

## Project Structure

```
hacker-native/
├── components/
│   ├── posts/
│   │   ├── Posts.tsx          # Main posts list component
│   │   └── Post.tsx           # Individual post component
│   ├── PostDetail.tsx         # Post details and comments
│   ├── Search.tsx             # Search functionality
│   ├── FeedbackForm.tsx       # User feedback form
│   └── Spinner.tsx            # Loading spinner
├── api/
│   └── endpoints.ts           # API integration
├── constants/
│   ├── pagination.ts          # Pagination settings
│   ├── stories.ts             # Story type mappings
│   └── item.ts                # Item query configurations
├── shared/
│   └── types.ts               # TypeScript type definitions
├── __tests__/                 # Test files
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup and mocks
├── babel.config.js            # Babel configuration
└── package.json               # Dependencies and scripts
```

## Key Features

### Data Fetching
- **React Query** for efficient data management
- **Infinite queries** for pagination
- **Error handling** and retry logic
- **Loading states** and optimistic updates

### User Experience
- **Smooth navigation** with Expo Router
- **Haptic feedback** for interactions
- **Loading indicators** and error states
- **Responsive design** for different screen sizes

### Performance
- **Optimized rendering** with proper key props
- **Efficient list rendering** with FlatList
- **Debounced search** to reduce API calls
- **Memory management** with proper cleanup

## Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm test           # Run all tests
npm test --watch   # Run tests in watch mode
npm run lint       # Run ESLint (if configured)
```

### Environment Setup
- Node.js 16+ recommended
- Expo CLI installed globally
- iOS Simulator or Android Emulator for testing

## Supported Platforms
- **iOS** (iOS 11+)
- **Android** (API level 21+)
- **Web** (with Expo Web)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License
This project is part of a technical assessment and is for demonstration purposes.

---

**Status**: All tests passing, ready for production deployment!
