const { BannerPlugin } = require("webpack");
// Helper for combining webpack config objects
const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  return merge(config, {
    plugins: [
        ...(config.plugins || []),
        /**
         * See this StackOverflow question and answer:
         * https://stackoverflow.com/a/10398567/6562635
         *
         * This is NEEDED, even on Windows. NPM uses the existence of this exact
         * shebang to determine if it will create a Windows command alias.
         */
        new BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true,
        }),
    ],
  });
};
