module.exports = {
    globDirectory: "build/",
    globPatterns: [
      "**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,json}"
    ],
    swDest: "build/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          }
        }
      }
    ]
  };