import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['aurelium.me'],
  },
  // Ensure static assets are handled correctly in all environments
  poweredByHeader: false,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"]
    });

    return config;
  },

  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      },
    }
  },
}

// We can't just import them and use that due to those not being serializable.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-math", {}],
      ["remark-gfm", {}],
      ["remark-smartypants", { dashes: true }]
    ],
    rehypePlugins: [
      ["rehype-prism-plus", {
        ignoreMissing: true,
        showLineNumbers: true
      }],
      ["rehype-katex", {}]
    ]
  }
})

export default withMDX(nextConfig) 