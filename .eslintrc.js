module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["airbnb-base", "plugin:vue/essential"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2020,
    sourceType: "module",
    allowImportExportEverywhere: true
  },
  plugins: ["vue"],
  rules: {
      "linebreak-style": "off",
      "no-debugger": "off",
      "max-len": "off",
      "no-param-reassign": "off",
      "no-shadow": "off",
  },
};
