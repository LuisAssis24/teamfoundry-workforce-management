export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
};