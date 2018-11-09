const merge = require('webpack-merge');
const common = require('./__config/webpack.common');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');


const config = merge(common('development'), {
  devtool: 'cheap-module-source-map',
  plugins: [
    new HardSourceWebpackPlugin(),
    new ChromeExtensionReloader({
      entries: {
        contentScript: [
          'boot/content_scripts/index'
        ],
        background: 'boot/background/index'
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '__build'),
    port: 8080,
    open: true,
    stats: 'minimal',
    historyApiFallback: true
    // useLocalIp: true
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000
  }
});

module.exports = config;
