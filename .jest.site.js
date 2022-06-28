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
  testRegex: 'check-site\\.(j|t)s$',
  testEnvironment: 'node',
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
};
