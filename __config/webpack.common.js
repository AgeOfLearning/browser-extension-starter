const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AofLTemplatingPlugin = require('@aofl/templating-plugin/index');
const htmlWebpackConfig = require('./html-webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (mode) => {
  const config = {
    entry: {
      'boot/background/index': './boot/background/index.js',
      'boot/content_scripts/index': './boot/content_scripts/index.js',
      'boot/devtools/index': './boot/devtools/index.js',
      'custom-elements-es5-adapter':
        './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'init-polyfill-service': './js/init-polyfill-service/index.js'
    },
    output: {
      path: path.join(__dirname, '..', '__build'),
      publicPath: '/',
      filename: '[name].min.js'
    },
    mode,
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /template\.html/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
                attrs: [
                  'aofl-img:aofl-src',
                  'aofl-source:srcset',
                  'aofl-img:src',
                  'source:srcset',
                  ':src'
                ]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: '@aofl/webcomponent-css-loader',
              options: {
                sourceMap: false,
                path: path.resolve(__dirname, '..', 'templates', 'devtools', 'css', 'index.css')
              }
            }
          ]
        },
        {
          test: /@webcomponents/,
          loader: 'imports-loader?this=>window'
        },
        {
          test: /i18n\/index\.js$/,
          use: '@aofl/i18n-loader'
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /(node_modules|sw)/,
          use: {
            loader: 'eslint-loader',
            options: {
              configFile: path.resolve('.eslintrc.js')
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!@aofl|@polymer|lit-html).*/,
          use: {
            loader: 'babel-loader',
            options: {
              'cacheDirectory': true,
              ...require('./.babelrc.json')
            }
          }
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name]-[hash].[ext]',
                limit: 2000
              }
            },
            {
              loader: 'img-loader',
              options: {
                pngquant: {
                  speed: 1
                },
                mozjpeg: {
                  progressive: true,
                  quality: 80
                }
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              limit: 1
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin('__build', {
        root: path.resolve(__dirname, '..')
      }),
      new CopyWebpackPlugin([
        {
          from: '_locales',
          to: '_locales'
        }, {
          from: 'assets/manifest',
          to: 'assets/manifest'
        }, {
          from: 'boot/manifest.json',
          to: 'manifest.json'
        }
      ]),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', 'boot', 'devtools', 'view.ejs'),
        filename: 'boot/devtools/view.html',
        ...htmlWebpackConfig(mode)
      }),
      new AofLTemplatingPlugin({
        template: {
          name: 'main',
          template: path.resolve(__dirname, '..', 'templates', 'devtools', 'template.ejs'),
          filename: path.join('templates', 'devtools', 'template.html'),
          ...htmlWebpackConfig(mode)
        },
        routes: {
          mainRoutes: path.join(__dirname, '..', 'routes'),
          pattern: [
            path.join(__dirname, '..', 'routes*', '**', '*', 'index.js')
          ],
          ignore: ['**/__build/**/*', '**/node_modules/**/*']
        }
      }),
      new CopyWebpackPlugin([{
        from: 'assets/favicon.ico',
        to: 'favicon.ico'
      }])
    ],
    resolve: {
      modules: [
        path.resolve('./'),
        './node_modules/'
      ]
    },
    watchOptions: {
      ignored: [/node_modules\//]
    },
    stats: 'minimal'
  };

  return config;
};
