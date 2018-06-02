var path = require('path');

const PATHS = {
    webpackModules: path.join(__dirname, 'webpack'),
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

const webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    merge = require('webpack-merge');

const devserver = require( PATHS.webpackModules + '/devserver'),
    sass = require( PATHS.webpackModules + '/sass'),
    extractCSS = require( PATHS.webpackModules + '/css.extract'),
    uglify = require( PATHS.webpackModules + '/js.uglify');

const common = merge([
    {
        entry: {
            'main': PATHS.source + '/js/main.ts'
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: PATHS.source + '/index.html',
                chunks: ['main', 'common']
            })
        ],
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },

        module: {
            rules: [
                { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader' } },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        }
    }
]);

module.exports = function (env) {
    'use strict';
    if (env === 'production') {
        console.log('PRODUCTION MODE');
        return merge([
            common,
            extractCSS(),
            uglify()
        ]);
    }
    if (env === 'development') {
        console.log('DEVOLOPMENT MODE');
        return merge([
                common,
                sass(),
                devserver()
            ]
        );
    }
};


