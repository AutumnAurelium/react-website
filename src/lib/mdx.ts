import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts')

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory)
  
  return files
    .filter(file => /\.mdx$/.test(file))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug: fileName.replace(/\.mdx$/, ''),
        ...data,
      }
    })
} 