const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const webpack = require('webpack');

// get branch name for current build (if running build locally, CI_BRANCH is not set - it's set in AWS)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';
const environment = branch === 'production' || branch === 'staging' ? branch : 'development';

// get configuration for the branch
const config = require('./config').default[environment] || require('./config').default.development;

const useMock = !!process.env.USE_MOCK || false;

var htmlFiles = [];
htmlFiles.push('index.html');
var directories = ['.'];
while (directories.length > 0) {
    let directory = directories.pop();
    if (!directory.startsWith('src') && directory !== '.') {
        continue;
    }
    let dirContents = fs.readdirSync(directory).map((file) => path.join(directory, file));
    htmlFiles.push(...dirContents.filter((file) => file.endsWith('.html')));
    directories.push(...dirContents.filter((file) => fs.statSync(file).isDirectory()));
}

module.exports = () => {
    const componentJsPath = {
        local: 'http://localhost:8080/',
        development:
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/' + process.env.CI_BRANCH + '/',
        staging: 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/',
        production: 'https://assets.library.uq.edu.au/reusable-webcomponents/',
    };
    const buildPath = (location, file) => {
        const fileMarker = file === 'drupal' ? '/drupal' : '';
        const buildPathType = {
            local: path.resolve(__dirname, 'dist' + fileMarker),
            development: path.resolve(__dirname, 'dist') + '/' + process.env.CI_BRANCH + fileMarker + '/',
            staging: path.resolve(__dirname, 'dist' + fileMarker),
            production: path.resolve(__dirname, 'dist' + fileMarker),
        };
        return buildPathType[location];
    };
    console.log('------------------------------------------------------------');
    console.log('BUILD ENVIRONMENT: ', process.env.NODE_ENV);
    console.log('BUILD BRANCH     : ', process.env.CI_BRANCH || process.env.NODE_ENV);
    console.log('BUILD URL        : ', componentJsPath[process.env.NODE_ENV]);
    console.log('BUILD PATH       : ', buildPath(process.env.NODE_ENV, 'index'));
    console.log('------------------------------------------------------------');
    return {
        devServer: {
            hot: true,
            liveReload: true,
            watchFiles: {
                paths: ['src/**/*', 'index*.html', 'src/**/*.html'],
            },
        },
        entry: {
            'uq-lib-reusable': './src/index.js',
            'drupal-lib-reusable': './src/drupal.js',
        },
        output: {
            path: buildPath(process.env.NODE_ENV, '[name]'),
            filename: '[name].min.js',
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
                                name: 'img/[contenthash]-[name].[ext]',
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
                                name: 'img/[contenthash]-[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            // https://stackoverflow.com/questions/60589413/how-to-create-multi-output-files
            // https://yonatankra.com/how-to-use-htmlwebpackplugin-for-multiple-entries/
            ...htmlFiles.map((htmlFile) => {
                return new HTMLWebpackPlugin({
                    template: path.resolve(__dirname, htmlFile),
                    filename: htmlFile, // normalise,
                    inject: htmlFile === 'index.html', // our test .html already have script tags
                });
            }),
            new CopyPlugin({
                patterns: [
                    // copy the external js from ITS DS into the dist and rename it
                    { from: 'src/UQSiteHeader/js/uqds.js', to: 'uq-site-header.js' },
                    // move some needed files into the distro
                    {
                        from: 'src/applications/libguides/arrow-right.png',
                        to: 'applications/libguides/arrow-right.png',
                    },
                    { from: 'src/applications/libguides/arrow-down.png', to: 'applications/libguides/arrow-down.png' },
                    {
                        from: 'src/applications/libguides/images/hero-BSL-group-study.jpg',
                        to: 'applications/libguides/hero_2025.jpg',
                    },
                    { from: 'src/favicon.ico', to: 'favicon.ico' },
                    // all load.js for applications should be included here
                    { from: 'src/applications/atom/load.js', to: 'applications/atom/load.js' },
                    { from: 'src/applications/auth/load.js', to: 'applications/auth/load.js' },
                    { from: 'src/applications/drupal/load.js', to: 'applications/drupal/load.js' },
                    { from: 'src/applications/drupal/subload.js', to: 'applications/drupal/subload.js' },
                    { from: 'src/applications/libcal/load.js', to: 'applications/libcal/load.js' },
                    { from: 'src/applications/libguides/load.js', to: 'applications/libguides/load.js' },
                    { from: 'src/applications/libwizard/load.js', to: 'applications/libwizard/load.js' },
                    { from: 'src/applications/rightnow/load.js', to: 'applications/rightnow/load.js' },
                    { from: 'src/applications/rightnow/chatload.js', to: 'applications/rightnow/chatload.js' },
                    { from: 'src/applications/shared/load.js', to: 'applications/shared/load.js' },
                    { from: 'src/applications/uqlapp/load.js', to: 'applications/uqlapp/load.js' },
                ],
            }),
            // Rename the external js imports to full paths when deployed & remove the drupal.js from homepage
            process.env.NODE_ENV !== 'local' &&
                new ReplaceInFileWebpackPlugin([
                    {
                        dir: buildPath(process.env.NODE_ENV, 'index'),
                        files: ['uq-lib-reusable.min.js'],
                        rules: [
                            {
                                search: /uq-site-header\.js/gm,
                                replace: componentJsPath[process.env.NODE_ENV] + 'uq-site-header.js',
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
        mode: process.env.NODE_ENV === 'local' ? 'development' : 'none',
    };
};
