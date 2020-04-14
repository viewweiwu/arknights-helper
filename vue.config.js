const path = require('path')
let url = 'http://122.112.221.198:8080/pas'

module.exports = {
  publicPath: './',
  assetsDir: './static',
  devServer: {
    proxy: {
      '/api': {
        target: url,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/assets/less/variable.less')
      ]
    }
  }
}
