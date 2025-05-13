const { defineConfig } = require('@vue/cli-service');
// Import webpack properly as a separate module at the top level
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // Set feature flags for production builds
    plugins: [
      // Use the imported webpack module to access the DefinePlugin constructor
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  }
});