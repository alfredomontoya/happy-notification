const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'xlsx'],
    blockList: [/[/\\\\]build[/\\\\]/],
  },
};

module.exports = mergeConfig(defaultConfig, config);
