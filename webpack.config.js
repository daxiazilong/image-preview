
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const version = process.env.npm_package_version;
const mode = (process.argv[2].split('=')[1]);
const dev =  mode == "development";
let  compilePath = {
  test: './src/core/test.ts'
}
const output = dev ? 'debug' : 'example/image-preview';
var plugins = [new HtmlWebpackPlugin({
  title: 'this is dev mode!',
  template: './debug/template.html'
})];
plugins.push(new webpack.HotModuleReplacementPlugin({}))
module.exports = {
  mode,
  entry: compilePath,
  module: {
    rules: [
      {
        test: /\.(frag)|(vert)/,
        use: [
          {
            loader: path.resolve(__dirname, 'scripts/shader-loader.js'),
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        }],
        exclude: /node_modules/
      },
    ]
  },
  output: {
    filename: `[name]${version}.js`,
    path: path.resolve(__dirname, output)
  },
  devServer: {
    contentBase: './debug',
    hot: true,
    host: getIp(),
    port: 9999,
    open: true
  },
  plugins: plugins,
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['.ts', '.js']
  }
};
function getIp() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}