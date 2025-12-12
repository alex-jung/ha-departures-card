module.exports = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "jest-environment-jsdom",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
