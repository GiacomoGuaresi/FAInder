const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver options to handle the whatwg-url-without-unicode issue
config.resolver = {
  ...config.resolver,
  alias: {
    ...config.resolver.alias,
    'whatwg-url-without-unicode': 'whatwg-url',
  },
};

module.exports = config;
