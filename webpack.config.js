
  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const version = process.env.npm_package_version;
  const dev = (process.argv[2].split('=')[1]) == "development";
  let compilePath = {
    imagePreview: './src/ts/image-preview-prd.ts'
  };
  const output = dev ? 'debug' : 'release';

  var plugins = [];

  if(dev){
    compilePath = {
        imagePreview: './src/ts/image-preview.ts',
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
              use: [{
                loader: 'ts-loader',
                options:{
                  configFile:path.resolve(__dirname,'tsconfig.json')
                } 
              }],
              exclude: /node_modules/
          }]
      },
      output: {
          filename: `[name]${version}.js`,
          path: path.resolve(__dirname, output)
      },
      devServer:{
          contentBase: './debug',
          hot: true,
          host: getIp(),
          port: 9999
      },
      plugins:plugins,
      resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        },
        extensions: ['.ts', '.js']
    }
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