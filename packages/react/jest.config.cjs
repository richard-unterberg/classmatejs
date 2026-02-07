/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx|jsx)$": [
      "ts-jest",
      {
        useESM: true,
        // do manual typechecking to speed up tests
        isolatedModules: true,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^\\.\\.\\/\\.\\.\\/dist$": "<rootDir>/dist/index.cjs.js",
  },
}
