module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "@cards/types", "@cards/jwt"],
  images: {
    domains: ['api.multiavatar.com']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
};
