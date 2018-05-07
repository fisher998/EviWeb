// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            //上线接口
            // '/api': {
            //     target: 'https://api.51zbb.net',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': '/web'
            //     }
            // },
            // 测试接口
            '/api': {
                target: 'http://beta.51zbb.net:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/web'
                }
            },
            // '/api': {
            //     target: 'http://118.190.79.11:81',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': '/web'
            //     }
            // },
            '/upload': {
                target: 'http://118.190.76.81',
                changeOrigin: true
            },
            '/web': {
                target: 'http://118.190.79.11:81',
                changeOrigin: true
            },
            '/cer': {
                target: 'http://114.215.42.252:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/cer': ''
                }
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
