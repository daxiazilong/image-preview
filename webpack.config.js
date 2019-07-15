  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const dev = (process.argv[2].split('=')[1]) == "development";
  const compilePath = dev ? './src/ts/test.ts' :'./src/ts/index.ts'
  module.exports = {
      entry: compilePath,
      module: {
          rules: [{
              test: /\.ts$/,
              use: 'ts-loader',
              exclude: /node_modules/
          }]
      },
      resolve: {
          extensions: ['.ts', '.js']
      },
      output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, 'dist')
      },
      devServer:{
          contentBase: './dist',
          hot: true,
      },
      plugins:[
          new webpack.HotModuleReplacementPlugin({
              
          }),
          new HtmlWebpackPlugin({
            title: 'this is dev mode!',
            template:'./dist/template.html'
        }),
      ]
  };