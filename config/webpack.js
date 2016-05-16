var path = require('path');
module.exports = {
  cache: true,
  debug: true,
  devtool: 'source-map',
  entry: './app/initialize',
  output: {
  path: __dirname,
  publicPath: 'http://localhost:3000/javascripts/',
    filename: 'main.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      // {exclude: /node_modules/},
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
      { test: /\.hbs/, loader: "handlebars-template-loader" },
      { test: /\.json/, loader: "json-loader" }
    ]
  }
};
