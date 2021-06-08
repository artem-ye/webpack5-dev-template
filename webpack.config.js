const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// *************************************************************
// PROJECT PATH CONSTANTS
// *************************************************************

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'dist');
const aliases = {
    '@': SRC_PATH,
    '@core': path.resolve(BUILD_PATH, 'core')
};

// *************************************************************
// CONFIG
// *************************************************************

function config(isDevMode, isProdMode) {
    const filename = (ext) =>
        `[name].${isProdMode ? '[contenthash].' : ''}bundle.${ext}`;

    const plugins = () => {
        const activePlugins = [
            new HtmlWebpackPlugin({template: './index.html'}),
            new CopyPlugin({
                patterns: [
                    {from: path.resolve(SRC_PATH, 'favicon.ico'), to: BUILD_PATH},
                ],
            }),
            new MiniCssExtractPlugin({filename: filename('css')}),
        ];

        if (isDevMode) {
            activePlugins.push(new ESLintPlugin());
        }

        return activePlugins;
    };

    return {
        target: 'web',
        context: SRC_PATH,
        entry: {
            main: './index.js'
        },
        output: {
            path: BUILD_PATH,
            filename: filename('js'),
            clean: true
        },
        resolve: {
            extensions: ['.js'],
            alias: aliases
        },
        plugins: plugins(),
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader', // sass-loader: Translates CSS into CommonJS
                        'sass-loader', // sass-loader: Compiles Sass to CSS
                    ],
                },

                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
            ],
        },

        // -------------------------------------------------------------------
        // Dev mode only
        // -------------------------------------------------------------------
        devServer: {
            contentBase: BUILD_PATH,
            port: 3000,
            open: true,
            hot: true,
            // watchContentBase: true, // !!! Use this, if want to update HTML content
        },
        devtool: isDevMode ? 'source-map' : false,
    };
}

module.exports = (env, argv) => {
    const isProdMode = (argv.mode === 'production');
    const isDevMode = !isProdMode;
    return config(isDevMode, isProdMode);
};
