const webpack = require('webpack');
const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE || false;

const cssFilename = isProd ? '[name].[contenthash:8].css' : '[name].css';

const PATHS = {
    polyfills: path.join(__dirname, 'src/polyfills'),
    styles: path.join(__dirname, 'styles'),
    app: path.join(__dirname, 'src'),
    build: path.resolve(__dirname, 'build/static'),
    public: '/static/',
};

const minify = isProd
    ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
      }
    : false;

const getStyleLoaders = cssOptions => {
    const loaders = [
        isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                ...cssOptions,
                sourceMap: false,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                ident: 'postcss',
                plugins: [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        preserve: false,
                        stage: 0,
                        importFrom: 'src/base.css',
                    }),
                    require('postcss-hexrgba'),
                    require('postcss-color-function'),
                ],
            },
        },
    ];
    return loaders;
};

const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? '' : 'cheap-module-source-map',
    entry: {
        app: [!isProd && 'webpack-dev-server/client?/', PATHS.app].filter(Boolean),
    },
    output: {
        path: PATHS.build,
        publicPath: PATHS.public,
        filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        pure_funcs: ['console.log'],
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: true,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    discardComments: {
                        removeAll: true,
                    },
                    // map: {
                    //     inline: false,
                    //     annotation: true,
                    // },
                },
            }),
        ],
        concatenateModules: isProd,
        noEmitOnErrors: isProd,
        namedModules: !isProd,
        splitChunks: isProd
            ? {
                  chunks: 'all',
                  name: 'vendor',
              }
            : false,
        runtimeChunk: isProd,
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                parser: {
                    requireEnsure: false,
                },
            },
            // isProd
            //     ? {}
            //     : {
            //           test: /\.(js|jsx)$/,
            //           include: path.resolve(__dirname, 'source'),
            //           enforce: 'pre',
            //           use: require.resolve('eslint-loader'),
            //       },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(mjs|js|jsx)$/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: isProd,
                            cacheCompression: isProd,
                            cacheDirectory: true,
                            presets: [
                                [
                                    require.resolve('@babel/preset-env'),
                                    {
                                        modules: false,
                                        useBuiltIns: false,
                                    },
                                ],
                                [
                                    require.resolve('@babel/preset-react'),
                                    {
                                        useBuiltIns: true,
                                    },
                                ],
                            ],
                            plugins: [
                                require.resolve('@babel/plugin-syntax-dynamic-import'),
                                [
                                    require.resolve('@babel/plugin-proposal-object-rest-spread'),
                                    {
                                        loose: true,
                                        useBuiltIns: true,
                                    },
                                ],
                                [
                                    require.resolve('@babel/plugin-proposal-class-properties'),
                                    {
                                        loose: true,
                                    },
                                ],
                            ].filter(Boolean),
                        },
                    },
                    !isProd && {
                        test: /\.jsx?$/,
                        include: /node_modules/,
                        use: ['react-hot-loader/webpack'],
                    },
                    {
                        test: /\.svg$/,
                        use: '@svgr/webpack',
                    },
                    {
                        test: /\.css$/,
                        loader: getStyleLoaders({
                            importLoaders: 1,
                            localIdentName: '[folder]__[local]',
                            modules: true,
                        }),
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(ejs|js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/],
                        options: {
                            name: 'media/[name].[hash:8].[ext]',
                        },
                    },
                ].filter(Boolean),
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssFilename,
        }),
        new HtmlWebpackPlugin({
            minify,
            alwaysWriteToDisk: true,
            inject: true,
            filename: path.resolve(__dirname, 'build/index.html'),
            template: 'public/index.html',
        }),
        new HtmlWebpackHarddiskPlugin(),
        new CopyWebpackPlugin(
            [
                { from: 'public/images', to: '../images', cache: { key: '[hash:8]' } },
                { from: 'public/favicon.ico', to: '../' },
            ],
            {
                copyUnmodified: true,
            }
        ),
    ],
    stats: {
        hash: false,
        version: false,
        children: false,
        modules: false,
        entrypoints: false,
    },
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules', 'src'],
        // alias: isProd
        //     ? {
        //           'lodash-es': 'lodash',
        //           react: 'inferno-compat',
        //           'react-dom': 'inferno-compat',
        //       }
        //     : {},
    },
    node: {
        module: 'empty',
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
        process: false,
    },
    performance: false,
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        historyApiFallback: true,
        hot: true,
        compress: true,
        stats: 'errors-only',
        overlay: true,
    },
};

if (isProd) {
    config.plugins.push(
        new CleanWebpackPlugin([PATHS.build], {
            verbose: false,
        })
    );
} else {
    config.plugins.push(new CaseSensitivePathsPlugin(), new webpack.HotModuleReplacementPlugin());
}

if (isAnalyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
