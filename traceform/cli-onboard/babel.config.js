// SPDX-License-Identifier: Apache-2.0
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    // Add Traceform plugin ONLY during development to the 'plugins' array
    ...(process.env.NODE_ENV === 'development' ? ['@lucidlayer/babel-plugin-traceform'] : [])
  ],
}; 