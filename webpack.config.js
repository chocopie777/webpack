const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {
  const isDev = env.mode === 'development';
  const isProd = env.mode === 'production';

  const conf = {
    mode: env.mode,
    target: isDev ? 'web' : ['web', 'es5'],
    entry: isProd ? ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.tsx')] : path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      filename: isDev ? 'main.js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
      assetModuleFilename: 'images/[hash][ext][query]',
    },
    devServer: isDev ? {
      port: 3000,
      hot: true,
    } : undefined,
    devtool: isDev ? 'eval-source-map' : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                getCustomTransformers: () => ({
                  before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                }),
                transpileOnly: isDev,
              }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react",
                ]
              }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    }
    ,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: path.resolve('public', 'favicon.ico'),
      }),
      isProd && new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css'
      }),
      isDev && new ReactRefreshWebpackPlugin(),
      isDev && new ForkTsCheckerWebpackPlugin(),
    ]
  }

  return conf;
}