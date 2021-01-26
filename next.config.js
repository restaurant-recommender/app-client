const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

console.log(isProd)

module.exports = withCSS({
  env: {
    NEXT_PUBLIC_APP_SERVER_URL: isProd ? "https://neutron-dot-restaurant-recommender-system.et.r.appspot.com" : "http://localhost:3001",
    NEXT_PUBLIC_APP_CLIENT_URL: isProd ? "https://restaurant-recommender-system.et.r.appspot.com" : "http://localhost:3000"
  },
  distDir: 'build',
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    })
  ),
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});