module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' },
        ],
    },
    output: {
        filename: 'index_bundle.js'
    },
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 600,
        poll: true
    },
};