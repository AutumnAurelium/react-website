import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

interface Post {
  slug: string
  title?: string
  date?: string
  description?: string
  hidden?: boolean
}

export const metadata = {
  title: 'Blog'
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  return (
    <div className="max-w-4xl mx-auto py-2 px-4 not-prose">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <article key={post.slug} className="blog-post-card">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="blog-post-title">
                {post.title || post.slug}
              </h2>
              {post.date && (
                <time className="blog-post-meta">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              )}
              {post.description && (
                <p className="blog-post-description">{post.description}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
} 