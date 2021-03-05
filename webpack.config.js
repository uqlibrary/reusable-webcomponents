const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const webpack = require('webpack');
const libraryName = 'uq-lib-resusable';
const outputFile = `${libraryName}.min.js`;

const componentJsPath = {
    local: '',
    development: 'https://homepage-development.library.uq.edu.au/' + process.env.CI_BRANCH + '/',
    staging: 'https://homepage-staging.library.uq.edu.au/test-web-components/',
    production: 'https://library.uq.edu.au/test-web-components/',
};

module.exports = () => {
    console.log('------------------------------------------------------------');
    console.log('BUILD ENVIRONMENT: ', process.env.NODE_ENV);
    console.log('------------------------------------------------------------');
    return {
        entry: './src/index.js',
        output: {
            library: libraryName,
            libraryTarget: 'umd',
            libraryExport: 'default',
            path: path.resolve(__dirname, 'dist'),
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
                    test: /\.scss$/,
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 20000, // Convert images < 8kb to base64 strings
                            name: 'img/[hash]-[name].[ext]',
                        },
                    }],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 20000, // Convert images < 8kb to base64 strings
                            name: 'img/[hash]-[name].[ext]',
                        },
                    }],
                },
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'index.html'),
            }),
            new webpack.HotModuleReplacementPlugin(),
            // This plugin simply copies the external js into the dist and renames it
            new CopyPlugin({
                patterns: [
                    {from: "src/AuthButton/js/uqds.js", to: "auth-button.js"},
                    {from: "src/ConnectFooter/js/uqds.js", to: "connect-footer.js"},
                    {from: "src/UQHeader/js/uqds.js", to: "uq-header.js"},
                    {from: "src/UQFooter/js/uqds.js", to: "uq-footer.js"},
                    {from: "src/UQSiteHeader/js/uqds.js", to: "uq-site-header.js"},
                ],
            }),
            // This plugin will rename the external js imports to full paths for deploy
            (process.env.NODE_ENV !== 'local') && new ReplaceInFileWebpackPlugin([{
                dir: 'dist',
                files: ['uq-lib-resusable.min.js'],
                rules: [{
                    search: /uq-header\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'uq-header.js',
                },{
                    search: /uq-footer\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'uq-footer.js',
                },{
                    search: /uq-site-header\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'uq-site-header.js',
                },{
                    search: /connect-footer\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'connect-footer.js',
                },{
                    search: /auth-button\.js/gm,
                    replace: componentJsPath[process.env.NODE_ENV] + 'auth-button.js',
                }]
            }]),
        ].filter(Boolean),
        mode: 'none',
    }
};
