import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://aurelium.me' : '',
  images: {
    domains: ['aurelium.me'],
  },
}

// We can't just import them and use that due to those not being serializable.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-math", {}],
      ["remark-gfm", {}],
      ["remark-smartypants", {dashes: true}]
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