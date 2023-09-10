// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// @type {import('expo/metro-config').MetroConfig} 
const deafultConfig = getDefaultConfig(__dirname);
deafultConfig.resolver.assetExts.push('cjs');

module.exports = deafultConfig;
