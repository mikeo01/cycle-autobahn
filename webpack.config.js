const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = env => ({
    mode: env,

    // Application
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].[contenthash].js'
    },

    // Optimisations
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    // Resolution
    resolve: {
        symlinks: false,
        extensions: ['.js', '.ts']
    },

    // Loaders
    module: {
        rules: [{ // TypeScript & Babel loader
            test: /\.(j|t)s$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader'
            }, {
                loader: 'ts-loader'
            }]
        }]
    },

    // Auto watch files
    watch: false,
    // Sourcemaps
    // devtool: 'inline-source-map'
});
