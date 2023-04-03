/* eslint-disable */
export default {
    displayName: 'meerkat',
    preset: '../../jest.preset.js',
    globals: {},
    transform: {
        '^.+\\.[tj]s$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
            },
        ],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/meerkat',
    testEnvironment: 'node',
    verbose: process.env.CI === 'true',
};
