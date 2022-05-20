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
    new webpack.DefinePlugin({
      "process.env": {
        API_KEY: JSON.stringify(process.env.API_KEY)
      }
    }),
    // new Dotenv()
  ],
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify")
    }
  }
}