  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const dev = (process.argv[2].split('=')[1]) == "development";
  let compilePath = {
    imgPreview: './src/ts/index.ts'
  };
  const output = dev ? 'debug' : 'release';

  var plugins = [];

  if(dev){
    compilePath = {
        imgPreview: './src/ts/index.ts',
        test: './src/ts/test.ts'
    }
    plugins = [
        new webpack.HotModuleReplacementPlugin({
            
        }),
        new HtmlWebpackPlugin({
          title: 'this is dev mode!',
          template:'./debug/template.html'
      }),
    ]
  }
 
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
          filename: '[name].js',
          path: path.resolve(__dirname, output)
      },
      devServer:{
          contentBase: './debug',
          hot: true,
          host: getIp()
      },
      plugins:plugins
  };
  function getIp(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
  }