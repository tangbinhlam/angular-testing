module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    './setupJest.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/test.ts'
  ],
  globals: {
    "ts-jest": {
      tsConfig: './tsconfig.spec.json',
      // stringifyContentPathRegex: "\\.html$",
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    }
  },
};
