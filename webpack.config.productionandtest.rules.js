module.exports = {
    rules:
        [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                exclude: /(node_modules)/,
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // {
            //     test: /\.json$/,
            //     loader: 'babel-loader',
            //     exclude: /node_modules/
            // },
        ],
    extensions: ['.ts', '.js', '.json', '.html']
}