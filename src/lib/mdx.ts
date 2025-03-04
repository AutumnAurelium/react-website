import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts')

export async function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = [];

  for(const filename of files) {
    const slug = filename.replace(/\.mdx$/, '');

    const postModule = (await import(`../app/blog/posts/${slug}.mdx`));

    // Skip posts that have hidden: true in their metadata
    if (postModule.metadata.hidden === true) {
      continue;
    }

    posts.push({
      slug: slug,
      ...postModule.metadata,
    });
  }

  return posts;
} 