module.exports = {
  globals: {
    window: {}
  },
  cacheDirectory: '<rootDir>/.cache',
  displayName: 'until-destroy',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/migration/**/*.spec.ts'],
  testPathIgnorePatterns: ['node_modules']
};
