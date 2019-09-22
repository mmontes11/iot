module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  globals: {
    NODE_ENV: "test",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coveragePathIgnorePatterns: ["src/index.js", "src/lib/iotClient.js"],
  moduleDirectories: ["node_modules", "./src"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.js",
  },
  setupFiles: [
    "<rootDir>/test/helpers/enzyme-setup.js",
    "<rootDir>/test/helpers/expect-extensions.js",
    "<rootDir>/test/helpers/jest-setup.js",
  ],
  snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"],
};
