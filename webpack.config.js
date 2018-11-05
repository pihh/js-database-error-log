
const path = require('path');
const webpack = require('webpack');
const WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

const minifyOpts = {};
const pluginOpts = {};

module.exports = {
    context: __dirname,
    node: {
        __filename: true
    },
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname),
        filename: 'index.js',
        libraryTarget: 'var',
        library: 'Pihhstake'
    },
    plugins: [
        new WatchLiveReloadPlugin({
          files: [
            // Replace these globs with yours
            './*.html',
            // './src/**/*.css',
            // './src/**/*.png',
            // './src/**/*.jpg',
            './src/**/*.js',
          ],
          // port:
        }),
        new MinifyPlugin(minifyOpts, pluginOpts)
    ],
    module: {
        rules: [{
            test: /\.(js)$/,
            use: 'babel-loader'
        }]
    }
}
