const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for server render environment
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.js$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.md$': './scripts/_demoPreprocessor',
    '\\.(jpg|png|gif|svg)$': require.resolve('@ant-design/tools/lib/jest/imagePreprocessor'),
  },
  testRegex: 'check-site\\.js$',
  testEnvironment: 'node',
  transformIgnorePatterns,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
};
