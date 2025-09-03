const { resolveTestEnvironment } = require("jest-resolve");

//jest.config.cjs
module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testEnvironment: 'jest-environment-jsdom',
}