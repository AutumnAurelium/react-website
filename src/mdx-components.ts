import type { MDXComponents } from 'mdx/types'
import { Footnote } from '@/components/Footnote'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Footnote: Footnote,
  }
}