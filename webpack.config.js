const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require( 'tsconfig-paths-webpack-plugin' );

module.exports = {
    entry: './src/Bootstrap.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: false,
        port: 4200
    },
    plugins: [
        new CleanWebpackPlugin( {} ),
        new HtmlWebpackPlugin( {
            template: path.resolve( __dirname, 'index.html' )
        } ),
        // new CopyWebpackPlugin([{ from: './src/assets', to: 'assets' }]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: false,
                            experimentalWatchApi: false,
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|fnt|glsl)$/,
                use: 'file-loader'
            }
        ]
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin( {
                configFile: "./tsconfig.json"
            } )
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve( __dirname, 'dist' )
    }
};