module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "@cards/types", "@cards/jwt", "@cards/data"],
  images: {
    domains: ['api.multiavatar.com']
  },
  // eslint-disable-next-line no-unused-vars
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
};
