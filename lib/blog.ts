import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { format, parseISO } from "date-fns"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  formattedDate: string
  tags: string[]
  draft?: boolean
}

export interface Post extends PostMeta {
  content: string
}

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => b.localeCompare(a))
}

export function getPostSlugs(): string[] {
  return getMarkdownFiles().map((file) => file.replace(/\.md$/, ""))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date || "",
    formattedDate: data.date ? format(parseISO(data.date), "MMMM d, yyyy") : "",
    tags: data.tags || [],
    draft: data.draft || false,
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs()

  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && !post.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
