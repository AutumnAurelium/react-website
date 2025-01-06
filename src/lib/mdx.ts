import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts')

export async function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = [];

  for(const filename of files) {
    const slug = filename.replace(/\.mdx$/, '');

    const postModule = (await import(`../app/blog/posts/${slug}.mdx`));

    posts.push({
      slug: slug,
      ...postModule.metadata,
    });
  }

  return posts;
} 