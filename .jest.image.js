const { moduleNameMapper, transformIgnorePatterns } = require('./.jest');

// jest config for image snapshots
module.exports = {
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'md'],
  moduleNameMapper,
  transform: {
    '\\.tsx?$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.js$': require.resolve('@ant-design/tools/lib/jest/codePreprocessor'),
    '\\.md$': './scripts/_demoPreprocessor',
    '\\.(jpg|png|gif|svg)$': require.resolve('@ant-design/tools/lib/jest/imagePreprocessor'),
  },
  testRegex: 'image\\.test\\.(j|t)s$',
  transformIgnorePatterns,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.test.json',
    },
  },
  preset: 'jest-puppeteer',
  testTimeout: 10000,
};
