import { getPostBySlug, getPostSlugs } from "@/lib/blog"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: `${post.title} | Ben Bravo`,
    description: post.description,
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/blog" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Blog</span>
            </Link>
            <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
              Ben Bravo
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Post */}
      <article className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {post.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-700 dark:prose-p:text-slate-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-code:text-pink-600 dark:prose-code:text-pink-400
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400
            prose-li:text-slate-700 dark:prose-li:text-slate-300
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" />
                All Posts
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Ben Bravo
        </div>
      </footer>
    </div>
  )
}
