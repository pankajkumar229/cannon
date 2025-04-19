const path = require('path');

module.exports = [
  // Extension Host bundle
  {
    target: 'node',
    mode: 'none',
    entry: './src/extension/extension.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    externals: {
      vscode: 'commonjs vscode'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      modules: ['node_modules']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  module: 'commonjs',
                  moduleResolution: 'node',
                  jsx: 'react',
                  sourceMap: true
                }
              }
            }
          ]
        }
      ]
    },
    devtool: 'source-map'
  },
  // Webview bundle
  {
    target: 'web',
    mode: 'development',
    entry: './src/frontend/AIAssistant.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webview.js',
      library: {
        name: 'AIAssistant',
        type: 'window',
        export: 'default'
      }
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      modules: ['node_modules']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  module: 'esnext',
                  moduleResolution: 'node',
                  jsx: 'react',
                  sourceMap: true
                }
              }
            }
          ]
        }
      ]
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    devtool: 'source-map'
  }
]; 