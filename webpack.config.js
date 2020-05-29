const path = require('path');

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['selector', '.js'],
    alias: {
      'selector': path.resolve(__dirname, './selector')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
    }
},
  output: {
    filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
};