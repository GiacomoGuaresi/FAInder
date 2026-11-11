// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'builds/*', 'android/*', 'ios/*'],
  },
  {
    rules: {
      // Regola pensata per l'HTML: in React Native apostrofi e virgolette nel testo sono innocui
      'react/no-unescaped-entities': 'off',
    },
  },
]);
