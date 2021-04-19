// jest.config.js
module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]s?)$',
    moduleFileExtensions: ['ts', 'js'],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
        'wx': {
            getFileSystemManager: () => []
        }
    },
    moduleNameMapper: {
        'mime-types': '<rootDir>/node_modules/mime-types/index.js',
    },
};
