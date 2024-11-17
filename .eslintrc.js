module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "airbnb"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["only-warn", "react"],
    rules: {
        "react/jsx-props-no-spreading": ["off"],
        "react/jsx-indent": ["error", 4],
        indent: ["error", 4],
        quotes: ["error", "double"],
    },
    ignorePatterns: [
        "node_modules/@firebase/**/*.map", // Only ignore source map files in Firebase
    ],
}
