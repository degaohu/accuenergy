
const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");
const Timestamp = new Date().getTime()
const TerserPlugin = require("terser-webpack-plugin");

module.exports = defineConfig({
  productionSourceMap: false,
  chainWebpack: config => {
    config.module.rules.delete('eslint');
  },
 
 
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  publicPath: './',
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查
  assetsDir: 'static', // 配置js、css静态资源二级目录的位置
  indexPath: 'index.html',
 
  devServer: {
    host: 'localhost',
    port: 9099,
    open: true,
    proxy: {
      '/GoogleServer': {
        //target: 'http://192.168.11.100:61235',
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        pathRewrite: {
          '^/GoogleServer': ''
        },
        ws: true,
        logLevel: 'debug'
      }
   
    },
    
},




  transpileDependencies: true,

  configureWebpack: {


    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    },
  
    plugins:  [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      }),


      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
          compress: {
            drop_console: true, // 干掉所有的console.*这些函数的调用
            drop_debugger: true, // 干掉那些debugger
            pure_funcs: ['console.log'], // 干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
          },
          format: {
            comments: false, //删除注释
          },
        },
      }),












    ],
    
  },


 
  runtimeCompiler: true
})

