/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "/node_modules/", // Ignore files in the node_modules directory
        "/__tests__/helpers/", // Ignore files in the helpers directory,
    ],
    testTimeout: 10000,
};
