const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack')

module.exports = { 
  "mode": "none", 
  "entry": "./src/app.js", 
  "output": { 
    "path": __dirname + '/dist', 
    "filename": "bundle.js" 
  },
  devServer: { 
    contentBase: path.join(__dirname, 'dist') 
  },
  plugins: [
      new Dotenv()
    // new Dotenv()
  ],
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify")
    }
  }
}