module.exports = (env, argv) => ({
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    entry: {
        // just create the react-bundle once

        //for dev
        // '/js/react-bundle': argv.mode === 'production'
        //     ? ['./static/react_files/react.min.js', './static/react_files/react-dom.min.js']
        //     : ['./static/react_files/react.development.js', './static/react_files/react-dom.development.js'],

        //mapping of <js file destination>: <react source>
        '/js/main-app': './src/MainApp.js',
        '/js/code-app': './src/CodeApp.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/static/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
});