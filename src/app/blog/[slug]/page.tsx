import { getAllPosts } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface PostPropsAsync {
    params: Promise<{slug: string}>
}

// Generate static params for all posts at build time
export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: PostPropsAsync) {
    const awaited = await params;
  const post = getPostBySlug(awaited.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.frontmatter.title || awaited.slug
  }
}

function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts')
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { content, data: frontmatter } = matter(fileContents)
    return { content, frontmatter }
  } catch {
    return null
  }
}

export default async function Post({ params }: PostPropsAsync) {
    const awaited = await params;
  const post = getPostBySlug(awaited.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <div className="prose dark:prose-invert max-w-none">
        <h1>{post.frontmatter.title}</h1>
        {post.frontmatter.date && (
          <time className="text-gray-500">
            {new Date(post.frontmatter.date).toLocaleDateString()}
          </time>
        )}
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
} 