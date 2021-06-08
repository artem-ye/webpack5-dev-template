module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        babelOptions: {
            configFile: './babel.config.json',
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'google'],
    rules: {
        'indent': ['error', 4],
        'comma-dangle': 'off',
        'require-jsdoc': 'off',
        'max-len': ['error', 120]
    },
};
