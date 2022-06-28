const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for server render environment
module.exports = {
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.js$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.md$': './scripts/_demoPreprocessor',
    '\\.(jpg|png|gif|svg)$': require.resolve('@ant-design/tools/lib/jest/imagePreprocessor'),
  },
  testRegex: 'node\\.test\\.(j|t)sx$',
  testEnvironment: 'node',
  transformIgnorePatterns,
};
