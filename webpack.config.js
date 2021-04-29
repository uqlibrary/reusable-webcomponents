const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const webpack = require('webpack');
const libraryName = 'uq-lib-reusable';
const outputFile = `${libraryName}.min.js`;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// get branch name for current build (if running build locally, CI_BRANCH is not set - it's set in AWS)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';
const environment = branch === 'production' || branch === 'staging' ? branch : 'development';

// get configuration for the branch
const config = require('./config').default[environment] || require('./config').default.development;

const useMock = !!process.env.USE_MOCK || false;

module.exports = () => {
    const componentJsPath = {
        local: 'http://localhost:8080/',
        development:
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/' + process.env.CI_BRANCH + '/',
        staging: 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/',
        production: 'https://assets.library.uq.edu.au/reusable-webcomponents/',
    };
    const buildPath = {
        local: path.resolve(__dirname, 'dist'),
        development: path.resolve(__dirname, 'dist') + '/' + process.env.CI_BRANCH + '/',
        staging: path.resolve(__dirname, 'dist'),
        production: path.resolve(__dirname, 'dist'),
    };
    console.log('------------------------------------------------------------');
    console.log('BUILD ENVIRONMENT: ', process.env.NODE_ENV);
    console.log('BUILD BRANCH     : ', process.env.CI_BRANCH || process.env.NODE_ENV);
    console.log('BUILD URL        : ', componentJsPath[process.env.NODE_ENV]);
    console.log('BUILD PATH       : ', buildPath[process.env.NODE_ENV]);
    console.log('------------------------------------------------------------');
    return {
        entry: './src/index.js',
        output: {
            library: libraryName,
            libraryTarget: 'umd',
            libraryExport: 'default',
            path: buildPath[process.env.NODE_ENV],
            filename: outputFile,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 20000, // Convert images < 8kb to base64 strings
                                name: 'img/[hash]-[name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 20000, // Convert images < 8kb to base64 strings
                                name: 'img/[hash]-[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: process.env.NODE_ENV === 'production',
                        },
                    },
                }),
            ],
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'index.html'),
            }),
            new webpack.HotModuleReplacementPlugin(),
            // This plugin simply copies the external js from ITS DS into the dist and renames it
            new CopyPlugin({
                patterns: [
                    { from: 'src/Alerts/js/uqds.js', to: 'alert-list.js' },
                    { from: 'src/ApiAccess/js/uqds.js', to: 'api-access.js' },
                    { from: 'src/UtilityArea/js/uqds.js', to: 'askus-button.js' },
                    { from: 'src/UtilityArea/js/uqds.js', to: 'auth-button.js' },
                    { from: 'src/UtilityArea/js/uqds.js', to: 'mylibrary-button.js' },
                    { from: 'src/ConnectFooter/js/uqds.js', to: 'connect-footer.js' },
                    { from: 'src/UQHeader/js/uqds.js', to: 'uq-header.js' },
                    { from: 'src/UQFooter/js/uqds.js', to: 'uq-footer.js' },
                    { from: 'src/UQSiteHeader/js/uqds.js', to: 'uq-site-header.js' },
                    {
                        from: 'src/applications/libguides/arrow-right.png',
                        to: 'applications/libguides/arrow-right.png',
                    },
                    { from: 'src/applications/libguides/arrow-down.png', to: 'applications/libguides/arrow-down.png' },
                    { from: 'src/favicon.ico', to: 'favicon.ico' },
                    // all load.js for applications should be included here
                    { from: 'src/applications/drupal/load.js', to: 'applications/drupal/load.js' },
                    { from: 'src/applications/omeka/load.js', to: 'applications/omeka/load.js' },
                    { from: 'src/applications/rightnow/load.js', to: 'applications/rightnow/load.js' },
                    { from: 'src/applications/shared/load.js', to: 'applications/shared/load.js' },
                    { from: 'src/applications/studenthub/load.js', to: 'applications/studenthub/load.js' },
                    { from: 'src/applications/uqlapp/load.js', to: 'applications/uqlapp/load.js' },
                    { from: 'src/applications/libguides/load.js', to: 'applications/libguides/load.js' },
                    { from: 'src/applications/libcal/load.js', to: 'applications/libcal/load.js' },
                ],
            }),
            // This plugin will rename the external js imports to full paths for deploy
            process.env.NODE_ENV !== 'local' &&
                new ReplaceInFileWebpackPlugin([
                    {
                        dir: buildPath[process.env.NODE_ENV],
                        files: ['uq-lib-reusable.min.js'],
                        rules: [
                            {
                                search: /uq-header\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'uq-header.js',
                            },
                            {
                                search: /uq-footer\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'uq-footer.js',
                            },
                            {
                                search: /uq-site-header\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'uq-site-header.js',
                            },
                            {
                                search: /connect-footer\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'connect-footer.js',
                            },
                            {
                                search: /askus-button\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'askus-button.js',
                            },
                            {
                                search: /auth-button\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'auth-button.js',
                            },
                            {
                                search: /mylibrary-button\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'mylibrary-button.js',
                            },
                            {
                                search: /alert-list\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'alert-list.js',
                            },
                            {
                                search: /alert\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'alert.js',
                            },
                        ],
                    },
                ]),
            new webpack.DefinePlugin({
                __DEVELOPMENT__: true,
                'process.env.NODE_ENV': JSON.stringify(config.environment),
                'process.env.USE_MOCK': JSON.stringify(useMock),
                'process.env.BRANCH': JSON.stringify(config.environment),
                'process.env.FULL_PATH': JSON.stringify(process.env.FULL_PATH),
                'process.env.API_URL': JSON.stringify(config.api),
            }),
        ].filter(Boolean),
        mode: 'none',
    };
};
