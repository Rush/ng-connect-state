module.exports = {
  displayName: 'until-destroy integration',
  testMatch: ['<rootDir>/integration/app/**/*.spec.ts'],
  moduleNameMapper: {
    'ng-connect-state': '<rootDir>/src'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  cacheDirectory: '<rootDir>/.cache',
  bail: true,
  clearMocks: true,
  resetModules: true
};
