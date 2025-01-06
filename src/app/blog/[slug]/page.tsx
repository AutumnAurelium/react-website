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
  const post = await getPostBySlug(awaited.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.metadata.title || awaited.slug
  }
}

async function getPostBySlug(slug: string) {
  try {
    const postModule = (await import(`../posts/${slug}.mdx`));
    const Content = postModule.default;

    return { content: Content, metadata: postModule.metadata }
  } catch {
    return null;
  }
}

export default async function Post({ params }: PostPropsAsync) {
  const awaited = await params;
  const post = await getPostBySlug(awaited.slug);

  if(!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <div className="prose dark:prose-invert max-w-none">
        <h1>{post.metadata.title}</h1>
        {post.metadata.date && (
          <time className="text-gray-500">
            {new Date(post.metadata.date).toLocaleDateString()}
          </time>
        )}
        {/* <MDXRemote source={post.content} options={config}/> */}
        <post.content />
      </div>
    </article>
  )
} 