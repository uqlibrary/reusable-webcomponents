module.exports = {
    env: {
        es6: true,
    },
    parserOptions: {
        sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    extends: ['plugin:prettier/recommended'],
};
