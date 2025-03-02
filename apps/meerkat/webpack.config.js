const { BannerPlugin } = require("webpack");
const { composePlugins, withNx } = require('@nx/webpack')

module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    config.plugins.push(new BannerPlugin({
        banner: "#!/usr/bin/env node",
        raw: true,
    }));
    return config;
  },
);
