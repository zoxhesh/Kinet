module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./app', './components', './lib', './hooks', './db', './design'],
          alias: {
            '@': './app',
          },
        },
      ],
    ],
  };
};