import { getAllPosts } from "@/lib/blog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Blog | Ben Bravo",
  description: "Thoughts on software development, projects, and lessons learned.",
}

export default function BlogPage() {
  const posts = getAllPosts()

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
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </Link>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Blog</span>
            </Link>
            <div className="w-16" />
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Notes on software, projects, and things I&apos;ve learned along the way.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No posts yet. Check back soon.
            </p>
          ) : (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 hover:bg-card/80 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={post.date}>{post.formattedDate}</time>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ben Bravo
        </div>
      </footer>
    </div>
  )
}
