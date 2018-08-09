// src/Stsbl/SendMailAsGroupBundle/Resources/webpack.config.js
let merge = require('webpack-merge');
let path = require('path');
let baseConfig = require(path.join(process.env.WEBPACK_BASE_PATH, 'webpack.config.base.js'));

let webpackConfig = {
    entry: {
        'js/jquery.initialize': './assets/vendor/jquery-initialize/jquery.initialize.js',
        'js/select2-jquery.initialize': './assets/js/select2-jquery.initialize.js',
    },
};

module.exports = merge(baseConfig.get(__dirname), webpackConfig);