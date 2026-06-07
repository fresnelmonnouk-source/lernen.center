module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo (SDK 56) auto-adds, when their packages are installed:
  //  - react-native-worklets/plugin  → required by Reanimated 4 (must run last)
  //  - the expo-router babel plugin
  // The project previously had no babel.config.js (Expo applied the preset by
  // default). We make it explicit so the worklets transform is guaranteed now
  // that the app uses Reanimated (BrandSplash motion). Same preset → no behaviour
  // change for the rest of the app.
  return {
    presets: ['babel-preset-expo'],
  };
};
