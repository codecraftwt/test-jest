module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/android/',
      '/ios/'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@expo|expo|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|@react-navigation|@react-native-async-storage|@tanstack))'
      ],
      
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    globals: {
      'ts-jest': {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      }
    }
  };
  