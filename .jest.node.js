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
  testRegex: 'demo\\.test\\.(j|t)s$',
  testEnvironment: 'node',
  transformIgnorePatterns,
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
