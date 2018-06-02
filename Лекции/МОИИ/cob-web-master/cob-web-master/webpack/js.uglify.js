const webpack = require('webpack');
module.exports = function() {
    'use strict';

    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            })
        ]
    };
};