// jest.config.js
export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Ensure all JS files are transformed using babel-jest
  },
  testEnvironment: 'node', // Set the environment to Node.js
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch|data-uri-to-buffer)/)', // Add data-uri-to-buffer here to transform it
  ],
  globals: {
    'babel-jest': {
      useESM: true, // Ensure babel-jest correctly handles ESM
    },
  },
};
