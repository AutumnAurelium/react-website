import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}
 
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-math", {}],
      ["remark-gfm", {}]
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