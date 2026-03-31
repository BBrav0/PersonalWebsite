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
    <div className="min-h-screen bg-background noise-bg">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse animation-delay-1000" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Blog</span>
            </Link>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Ben Bravo</span>
            </Link>
            <div className="w-16" />
          </div>
        </div>
      </nav>

      {/* Post */}
      <article className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none
            prose-headings:text-foreground prose-headings:tracking-tight
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80
            prose-code:text-purple-400 prose-code:before:content-none prose-code:after:content-none
            prose-strong:text-foreground
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-li:text-muted-foreground
            prose-hr:border-border
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <Button variant="outline" asChild className="group">
              <Link href="/blog" className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                All Posts
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ben Bravo
        </div>
      </footer>
    </div>
  )
}
