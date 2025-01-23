// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js']


const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

module.exports = createJestConfig(customJestConfig);

  