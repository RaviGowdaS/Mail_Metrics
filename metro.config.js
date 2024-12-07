const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
