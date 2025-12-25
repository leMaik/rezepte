/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  webpack(config, { dev }) {
    if (dev) {
      config.module.rules.push({
        test: /\.cook$/,
        type: "asset/source",
      });
    }
    return config;
  },
  turbopack: {
    rules: {
      "*.cook": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

module.exports = nextConfig;
